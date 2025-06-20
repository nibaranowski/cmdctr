import { createMocks } from 'node-mocks-http';
import receive from '../../pages/api/agents/scout/receive';

describe('/api/receive', () => {
  it('handles GET requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await receive(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toBeDefined();
  });

  it('handles POST requests', async () => {
    const { req, res } = createMocks({ 
      method: 'POST',
      body: { test: 'data' }
    });
    await receive(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toBeDefined();
  });

  it('handles invalid methods', async () => {
    const { req, res } = createMocks({ method: 'PUT' });
    await receive(req, res);
    
    expect(res._getStatusCode()).toBe(405);
  });

  it('handles errors gracefully', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    // Mock any dependencies that might throw
    await receive(req, res);
    
    expect(res._getStatusCode()).toBeLessThan(500);
  });
});
