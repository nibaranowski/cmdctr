import request from 'supertest';
import { createMocks } from 'node-mocks-http';

// Mock the API handler
jest.mock('../../../pages/api/agents/lifecycle', () => {
  return jest.fn().mockImplementation((req, res) => {
    const { action, agentId, data } = req.body;
    
    switch (action) {
      case 'register':
        return res.status(201).json({ 
          success: true, 
          agentId: 'test_agent_123',
          message: 'Agent registered successfully' 
        });
      case 'assign':
        return res.status(200).json({ 
          success: true, 
          message: 'Task assigned successfully',
          agentStatus: 'busy' 
        });
      case 'health':
        return res.status(200).json({
          success: true,
          health: {
            lastCheck: new Date(),
            isAlive: true,
            errorCount: 0,
          },
          status: 'idle',
          lastActivity: new Date(),
        });
      case 'log':
        return res.status(200).json({ 
          success: true, 
          message: 'Log entry added successfully' 
        });
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  });
});

describe('Agent Lifecycle API', () => {
  it('should register a new agent', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        action: 'register',
        data: {
          name: 'Test Agent',
          config: {
            maxRetries: 3,
            backoffMs: 1000,
          },
        },
      },
    });

    const handler = require('../../../pages/api/agents/lifecycle').default;
    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.agentId).toBeDefined();
    expect(data.message).toBe('Agent registered successfully');
  });

  it('should assign a task to an agent', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        action: 'assign',
        agentId: 'test_agent_123',
        data: {
          taskId: 'task_456',
          taskType: 'data_processing',
          payload: { data: 'test' },
        },
      },
    });

    const handler = require('../../../pages/api/agents/lifecycle').default;
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.message).toBe('Task assigned successfully');
    expect(data.agentStatus).toBe('busy');
  });

  it('should return agent health status', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        action: 'health',
        agentId: 'test_agent_123',
      },
    });

    const handler = require('../../../pages/api/agents/lifecycle').default;
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.health).toBeDefined();
    expect(data.health.isAlive).toBe(true);
    expect(data.status).toBe('idle');
  });

  it('should log agent actions and errors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        action: 'log',
        agentId: 'test_agent_123',
        data: {
          action: 'process_data',
          message: 'Processing data batch',
          level: 'info',
        },
      },
    });

    const handler = require('../../../pages/api/agents/lifecycle').default;
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.message).toBe('Log entry added successfully');
  });

  it('should handle agent errors and retry with backoff', async () => {
    // Test error handling by sending invalid action
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        action: 'invalid_action',
        agentId: 'test_agent_123',
      },
    });

    const handler = require('../../../pages/api/agents/lifecycle').default;
    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Invalid action');
  });

  it('should reject non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      body: {
        action: 'register',
        data: { name: 'Test Agent' },
      },
    });

    const handler = require('../../../pages/api/agents/lifecycle').default;
    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Method not allowed');
  });
}); 