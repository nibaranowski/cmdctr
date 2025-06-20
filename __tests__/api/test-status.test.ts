import { createMocks } from 'node-mocks-http';

import handler from '../../pages/api/test-status';

describe('/api/test-status', () => {
  it('returns test coverage data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('dev');
    expect(data).toHaveProperty('staging');
    expect(data).toHaveProperty('prod');
    expect(data.dev).toHaveProperty('backend');
    expect(data.dev).toHaveProperty('frontend');
    expect(data.dev).toHaveProperty('coverage');
  });

  it('returns 405 for non-GET methods', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 405 for PUT method', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 405 for DELETE method', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 405 for PATCH method', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('returns correct data structure for dev environment', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.dev).toHaveProperty('backend');
    expect(data.dev).toHaveProperty('frontend');
    expect(data.dev).toHaveProperty('coverage');
    expect(typeof data.dev.backend).toBe('number');
    expect(typeof data.dev.frontend).toBe('number');
    expect(typeof data.dev.coverage).toBe('number');
  });

  it('returns correct data structure for staging environment', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.staging).toHaveProperty('backend');
    expect(data.staging).toHaveProperty('frontend');
    expect(data.staging).toHaveProperty('coverage');
    expect(typeof data.staging.backend).toBe('number');
    expect(typeof data.staging.frontend).toBe('number');
    expect(typeof data.staging.coverage).toBe('number');
  });

  it('returns correct data structure for prod environment', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.prod).toHaveProperty('backend');
    expect(data.prod).toHaveProperty('frontend');
    expect(data.prod).toHaveProperty('coverage');
    expect(typeof data.prod.backend).toBe('number');
    expect(typeof data.prod.frontend).toBe('number');
    expect(typeof data.prod.coverage).toBe('number');
  });

  it('returns valid JSON response', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getHeaders()['content-type']).toBe('application/json');
    
    const data = JSON.parse(res._getData());
    expect(typeof data).toBe('object');
    expect(Array.isArray(data)).toBe(false);
  });

  it('handles request with query parameters', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { format: 'json' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('dev');
    expect(data).toHaveProperty('staging');
    expect(data).toHaveProperty('prod');
  });

  it('handles request with headers', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'user-agent': 'test-agent',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('dev');
    expect(data).toHaveProperty('staging');
    expect(data).toHaveProperty('prod');
  });

  it('returns consistent data structure across multiple calls', async () => {
    const { req: req1, res: res1 } = createMocks({ method: 'GET' });
    const { req: req2, res: res2 } = createMocks({ method: 'GET' });

    await handler(req1, res1);
    await handler(req2, res2);

    const data1 = JSON.parse(res1._getData());
    const data2 = JSON.parse(res2._getData());

    expect(data1).toHaveProperty('dev');
    expect(data1).toHaveProperty('staging');
    expect(data1).toHaveProperty('prod');
    expect(data2).toHaveProperty('dev');
    expect(data2).toHaveProperty('staging');
    expect(data2).toHaveProperty('prod');
  });
}); 