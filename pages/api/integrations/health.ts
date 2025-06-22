import type { NextApiRequest, NextApiResponse } from 'next';

export default function handleHealth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  return res.status(200).json({
    integrations: [
      { id: 'int1', type: 'slack', status: 'active' },
      { id: 'int2', type: 'stripe', status: 'error' }
    ],
    logs: [
      { integration_id: 'int1', message: 'OK', timestamp: new Date().toISOString() },
      { integration_id: 'int2', message: 'Connection failed', timestamp: new Date().toISOString() }
    ]
  });
} 