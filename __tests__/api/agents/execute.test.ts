import { createMocks } from 'node-mocks-http';

import { AgentOrchestrator } from '../../../lib/agents/orchestrator';
import handler from '../../../pages/api/agents/execute';

describe('/api/agents/execute', () => {
  it('returns 405 for non-POST methods', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 400 for missing metaBoxId', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 400 for missing context', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        metaBoxId: 'test-meta-box',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 500 for non-existent metaBox', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        metaBoxId: 'non-existent-meta-box',
        context: {
          userId: 'user-123',
          organizationId: 'org-456',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });

  it('returns 500 for execution errors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        metaBoxId: 'test-meta-box',
        context: {
          userId: 'user-123',
          organizationId: 'org-456',
        },
      },
    });

    await handler(req, res);

    // Should return 500 when orchestrator throws an error
    expect(res._getStatusCode()).toBe(500);
  });

  it('returns 500 for execution with phase parameter', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        metaBoxId: 'test-meta-box',
        phase: 'research',
        context: {
          userId: 'user-123',
          organizationId: 'org-456',
        },
      },
    });

    await handler(req, res);

    // Should return 500 when orchestrator throws an error
    expect(res._getStatusCode()).toBe(500);
  });

  it('executes entire workflow when no phase is specified', async () => {
    const mockOrchestrator = {
      executeWorkflow: jest.fn().mockResolvedValue({
        'phase1': [{ success: true, data: 'result1' }],
        'phase2': [{ success: true, data: 'result2' }]
      })
    };
    
    jest.spyOn(AgentOrchestrator.prototype, 'executeWorkflow').mockImplementation(mockOrchestrator.executeWorkflow);
    
    const req = {
      method: 'POST',
      body: {
        metaBoxId: 'test-meta-box',
        context: {
          userId: 'user123',
          organizationId: 'org456'
        }
        // No phase specified
      }
    } as any;
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
    
    await handler(req, res);
    
    expect(mockOrchestrator.executeWorkflow).toHaveBeenCalledWith('test-meta-box');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        'phase1': [{ success: true, data: 'result1' }],
        'phase2': [{ success: true, data: 'result2' }]
      },
      metadata: {
        metaBoxId: 'test-meta-box',
        phase: 'all',
        timestamp: expect.any(String)
      }
    });
  });
}); 