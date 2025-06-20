import { createMocks } from 'node-mocks-http';

import handler from '../../../pages/api/phases';
import phaseHandler from '../../../pages/api/phases/[id]';

describe('Phase API', () => {
  describe('GET /api/phases', () => {
    it('returns empty array when no phases exist', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([]);
    });

    it('filters phases by projectId', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { projectId: 'project-1' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([]);
    });
  });

  describe('POST /api/phases', () => {
    it('creates a new phase successfully', async () => {
      const phaseData = {
        name: 'In Progress',
        order: 1,
        projectId: 'project-1',
        description: 'Work in progress phase',
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: phaseData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const createdPhase = JSON.parse(res._getData());
      expect(createdPhase.name).toBe(phaseData.name);
      expect(createdPhase.order).toBe(phaseData.order);
      expect(createdPhase.projectId).toBe(phaseData.projectId);
      expect(createdPhase.description).toBe(phaseData.description);
      expect(createdPhase.id).toBeDefined();
      expect(createdPhase.createdAt).toBeDefined();
      expect(createdPhase.updatedAt).toBeDefined();
    });

    it('rejects invalid phase data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
        order: 1,
        projectId: 'project-1',
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const error = JSON.parse(res._getData());
      expect(error.error).toBe('Validation Error');
    });

    it('rejects missing required fields', async () => {
      const invalidData = {
        name: 'In Progress',
        // Missing order and projectId
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const error = JSON.parse(res._getData());
      expect(error.error).toBe('Validation Error');
    });
  });

  describe('GET /api/phases/[id]', () => {
    it('returns 404 for non-existent phase', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: 'non-existent-id' },
      });

      await phaseHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Phase not found' });
    });

    it('returns 400 for invalid ID', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {}, // No ID provided
      });

      await phaseHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Invalid phase ID' });
    });
  });

  describe('PUT /api/phases/[id]', () => {
    it('returns 404 for non-existent phase', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: 'non-existent-id' },
        body: { name: 'Updated Name' },
      });

      await phaseHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Phase not found' });
    });

    it('rejects invalid update data', async () => {
      // First create a phase
      const phaseData = {
        name: 'Original Name',
        order: 1,
        projectId: 'project-1',
      };

      const { req: createReq, res: createRes } = createMocks({
        method: 'POST',
        body: phaseData,
      });

      await handler(createReq, createRes);
      const createdPhase = JSON.parse(createRes._getData());

      // Then try to update it with invalid data
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: createdPhase.id },
        body: { name: '' }, // Empty name should fail validation
      });

      await phaseHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const error = JSON.parse(res._getData());
      expect(error.error).toBe('Validation Error');
    });
  });

  describe('DELETE /api/phases/[id]', () => {
    it('returns 404 for non-existent phase', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'non-existent-id' },
      });

      await phaseHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Phase not found' });
    });
  });

  describe('Method not allowed', () => {
    it('returns 405 for unsupported methods on /api/phases', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Method PUT Not Allowed' });
    });

    it('returns 405 for unsupported methods on /api/phases/[id]', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { id: 'some-id' },
      });

      await phaseHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Method POST Not Allowed' });
    });
  });
}); 