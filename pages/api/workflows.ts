import type { NextApiRequest, NextApiResponse } from 'next';

let workflows: any[] = [];

export default function handleWorkflows(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(workflows);
  }
  if (req.method === 'POST') {
    const wf = { ...req.body, id: req.body.id || `wf_${Date.now()}` };
    workflows.push(wf);
    return res.status(201).json(wf);
  }
  if (req.method === 'PUT') {
    const idx = workflows.findIndex(w => w.id === req.body.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    workflows[idx] = { ...workflows[idx], ...req.body };
    return res.status(200).json(workflows[idx]);
  }
  if (req.method === 'DELETE') {
    workflows = workflows.filter(w => w.id !== req.body.id);
    return res.status(204).end();
  }
  res.status(405).end();
} 