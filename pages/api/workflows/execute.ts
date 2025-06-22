import type { NextApiRequest, NextApiResponse } from 'next';

export default function handleExecute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { workflow_id, test } = req.body;
  if (workflow_id === 'wf_fail') {
    return res.status(500).json({ success: false, error: 'Execution failed', retries: 3 });
  }
  return res.status(200).json({ success: true, logs: [{ message: 'Workflow executed', test }] });
} 