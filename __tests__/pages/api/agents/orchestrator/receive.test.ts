import { createMocks } from 'node-mocks-http';
import receiveHandler from '../../../../../pages/api/agents/orchestrator/receive';

describe('/api/agents/orchestrator/receive', () => {
  it('returns 200 for POST request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        message: 'test message',
        agentId: 'test-agent',
      },
    });

    await receiveHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Orchestrator endpoint placeholder' });
  });

  it('returns 200 for GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await receiveHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Orchestrator endpoint placeholder' });
  });

  it('handles missing body gracefully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await receiveHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Orchestrator endpoint placeholder' });
  });
}); 