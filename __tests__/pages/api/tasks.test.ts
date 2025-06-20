import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/tasks';
import taskHandler from '../../../pages/api/tasks/[id]';

describe('Task API', () => {
  describe('GET /api/tasks', () => {
    it('returns empty array when no tasks exist', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([]);
    });

    it('filters tasks by phase_id', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { phase_id: 'phase-1' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([]);
    });
  });

  describe('POST /api/tasks', () => {
    it('creates a new task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        status: 'todo' as const,
        priority: 'medium' as const,
        company_id: 'company-1',
        tags: ['test'],
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: taskData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const createdTask = JSON.parse(res._getData());
      expect(createdTask.title).toBe(taskData.title);
      expect(createdTask.id).toBeDefined();
      expect(createdTask.created_at).toBeDefined();
      expect(createdTask.updated_at).toBeDefined();
    });

    it('rejects invalid task data', async () => {
      const invalidTaskData = {
        title: '', // Invalid: empty title
        status: 'invalid-status', // Invalid status
        company_id: 'company-1',
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidTaskData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const error = JSON.parse(res._getData());
      expect(error.error).toBe('Invalid task data');
    });
  });

  describe('GET /api/tasks/[id]', () => {
    it('returns 404 for non-existent task', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: 'non-existent' },
      });

      await taskHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Task not found' });
    });

    it('returns task when it exists', async () => {
      // First create a task
      const taskData = {
        title: 'Test Task',
        status: 'todo' as const,
        priority: 'medium' as const,
        company_id: 'company-1',
        tags: [],
      };

      const { req: createReq, res: createRes } = createMocks({
        method: 'POST',
        body: taskData,
      });

      await handler(createReq, createRes);
      const createdTask = JSON.parse(createRes._getData());

      // Then fetch it
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: createdTask.id },
      });

      await taskHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(createdTask);
    });
  });

  describe('PUT /api/tasks/[id]', () => {
    it('updates task with valid data', async () => {
      // First create a task
      const taskData = {
        title: 'Original Task',
        status: 'todo' as const,
        priority: 'medium' as const,
        company_id: 'company-1',
        tags: [],
      };

      const { req: createReq, res: createRes } = createMocks({
        method: 'POST',
        body: taskData,
      });

      await handler(createReq, createRes);
      const createdTask = JSON.parse(createRes._getData());

      // Then update it
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress' as const,
      };

      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: createdTask.id },
        body: updateData,
      });

      await taskHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const updatedTask = JSON.parse(res._getData());
      expect(updatedTask.title).toBe('Updated Task');
      expect(updatedTask.status).toBe('in-progress');
      expect(updatedTask.updated_at).toBeDefined();
    });

    it('rejects invalid update data', async () => {
      // First create a task
      const taskData = {
        title: 'Test Task',
        status: 'todo' as const,
        priority: 'medium' as const,
        company_id: 'company-1',
        tags: [],
      };

      const { req: createReq, res: createRes } = createMocks({
        method: 'POST',
        body: taskData,
      });

      await handler(createReq, createRes);
      const createdTask = JSON.parse(createRes._getData());

      // Then try to update with invalid data
      const invalidUpdateData = {
        status: 'invalid-status',
      };

      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: createdTask.id },
        body: invalidUpdateData,
      });

      await taskHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const error = JSON.parse(res._getData());
      expect(error.error).toBe('Invalid task data');
    });
  });

  describe('DELETE /api/tasks/[id]', () => {
    it('deletes existing task', async () => {
      // First create a task
      const taskData = {
        title: 'Task to Delete',
        status: 'todo' as const,
        priority: 'medium' as const,
        company_id: 'company-1',
        tags: [],
      };

      const { req: createReq, res: createRes } = createMocks({
        method: 'POST',
        body: taskData,
      });

      await handler(createReq, createRes);
      const createdTask = JSON.parse(createRes._getData());

      // Then delete it
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: createdTask.id },
      });

      await taskHandler(req, res);

      expect(res._getStatusCode()).toBe(204);

      // Verify it's deleted
      const { req: getReq, res: getRes } = createMocks({
        method: 'GET',
        query: { id: createdTask.id },
      });

      await taskHandler(getReq, getRes);
      expect(getRes._getStatusCode()).toBe(404);
    });

    it('returns 404 for non-existent task', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'non-existent' },
      });

      await taskHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Task not found' });
    });
  });
}); 