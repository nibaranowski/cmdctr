import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock API endpoints
  http.get('/api/test-status', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  }),

  http.post('/api/agents/execute', async ({ request }) => {
    const body = await request.json() as { agentId?: string }
    return HttpResponse.json({
      success: true,
      agentId: body?.agentId || 'unknown',
      result: 'Mock agent execution result',
    })
  }),
] 