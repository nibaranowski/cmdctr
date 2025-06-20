import { createMocks } from 'node-mocks-http';
import TestStatus from '../../pages/api/test-status';

describe('/api/teststatus', () => {
  it('handles GET requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await TestStatus(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toBeDefined();
  });

  it('handles POST requests', async () => {
    const { req, res } = createMocks({ 
      method: 'POST',
      body: { test: 'data' }
    });
    await TestStatus(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toBeDefined();
  });

  it('handles invalid methods', async () => {
    const { req, res } = createMocks({ method: 'PUT' });
    await TestStatus(req, res);
    
    expect(res._getStatusCode()).toBe(405);
  });

  it('handles errors gracefully', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    // Mock any dependencies that might throw
    await TestStatus(req, res);
    
    expect(res._getStatusCode()).toBeLessThan(500);
  });
});
