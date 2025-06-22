import { createMocks } from 'node-mocks-http';
import handleWorkflows from '../../../pages/api/workflows';
import handleExecute from '../../../pages/api/workflows/execute';
import handleWebhook from '../../../pages/api/integrations/webhook';
import handleHealth from '../../../pages/api/integrations/health';

describe('/api/workflows API', () => {
  it('creates a new workflow', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Workflow',
        triggers: [{ trigger_type: 'on_phase_change', conditions: [] }],
        actions: [{ type: 'webhook', config: { url: 'https://hooks.slack.com/test' } }],
        enabled: true
      }
    });
    await handleWorkflows(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(201);
    expect(data).toEqual(expect.objectContaining({ id: expect.any(String), name: 'Test Workflow' }));
  });

  it('fetches workflows', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handleWorkflows(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('updates a workflow', async () => {
    // First create a workflow
    const { req: createReq, res: createRes } = createMocks({
      method: 'POST',
      body: { name: 'Original Workflow', id: 'wf_001' }
    });
    await handleWorkflows(createReq, createRes);
    
    // Then update it
    const { req, res } = createMocks({
      method: 'PUT',
      body: { id: 'wf_001', name: 'Updated Workflow' }
    });
    await handleWorkflows(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(data).toEqual(expect.objectContaining({ id: 'wf_001', name: 'Updated Workflow' }));
  });

  it('deletes a workflow', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      body: { id: 'wf_001' }
    });
    await handleWorkflows(req, res);
    expect(res._getStatusCode()).toBe(204);
  });
});

describe('/api/workflows/execute API', () => {
  it('executes a workflow and returns results', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { workflow_id: 'wf_001', test: true }
    });
    await handleExecute(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(data).toEqual(expect.objectContaining({ success: true, logs: expect.any(Array) }));
  });

  it('handles execution failure and retries', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { workflow_id: 'wf_fail', test: true }
    });
    await handleExecute(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(500);
    expect(data).toEqual(expect.objectContaining({ success: false, error: expect.any(String), retries: expect.any(Number) }));
  });
});

describe('/api/integrations/webhook API', () => {
  it('accepts a valid webhook and triggers workflow', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { event: 'phase_change', data: { phase_id: 'p1' } }
    });
    await handleWebhook(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(data).toEqual(expect.objectContaining({ triggered: true }));
  });

  it('rejects invalid webhook payload', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { invalid: true }
    });
    await handleWebhook(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('prevents replay attacks (idempotency)', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { event: 'phase_change', data: { phase_id: 'p1' }, idempotency_key: 'abc123' }
    });
    await handleWebhook(req, res);
    // Second call with same idempotency_key
    const { req: req2, res: res2 } = createMocks({
      method: 'POST',
      body: { event: 'phase_change', data: { phase_id: 'p1' }, idempotency_key: 'abc123' }
    });
    await handleWebhook(req2, res2);
    expect(res2._getStatusCode()).toBe(409);
  });
});

describe('/api/integrations/health API', () => {
  it('returns integration health and logs', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handleHealth(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(data).toEqual(expect.objectContaining({ integrations: expect.any(Array), logs: expect.any(Array) }));
  });
}); 