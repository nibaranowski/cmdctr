import type { NextApiRequest, NextApiResponse } from 'next';

const idempotencySet = new Set<string>();

export default function handleWebhook(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { event, data, idempotency_key } = req.body;
  if (!event || !data) return res.status(400).json({ error: 'Invalid payload' });
  if (idempotency_key) {
    if (idempotencySet.has(idempotency_key)) {
      return res.status(409).json({ error: 'Duplicate idempotency key' });
    }
    idempotencySet.add(idempotency_key);
  }
  // Simulate triggering a workflow
  return res.status(200).json({ triggered: true });
} 