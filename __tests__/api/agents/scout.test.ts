import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/agents/scout/receive';

describe('/api/agents/scout/receive', () => {
  it('should return 200 for valid request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        message: 'Test scout request',
        userId: 'test-user-id',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Scout endpoint placeholder',
    });
  });

  it('should handle GET requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('should handle missing body gracefully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
}); 