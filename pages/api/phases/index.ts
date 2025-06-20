import { NextApiRequest, NextApiResponse } from 'next';

import { PhaseSchema, PhaseInput } from '../../../models/Phase';

// Mock database - replace with actual database connection
const phases: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { metabox_id, agent_id } = req.query;
      
      let filteredPhases = [...phases];
      
      // Apply filters
      if (metabox_id) {
        filteredPhases = filteredPhases.filter(phase => phase.metabox_id === metabox_id);
      }
      if (agent_id) {
        filteredPhases = filteredPhases.filter(phase => phase.agent_id === agent_id);
      }
      
      // Sort by order
      filteredPhases.sort((a, b) => a.order - b.order);
      
      res.status(200).json(filteredPhases);
    } catch {
      res.status(500).json({ error: 'Failed to fetch phases' });
    }
  } else if (req.method === 'POST') {
    try {
      const phaseData: PhaseInput = req.body;
      
      // Validate input data
      const validationResult = PhaseSchema.safeParse({
        ...phaseData,
        id: `phase_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid phase data', details: validationResult.error });
      }
      
      const newPhase = validationResult.data;
      phases.push(newPhase);
      
      res.status(201).json(newPhase);
    } catch {
      res.status(500).json({ error: 'Failed to create phase' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 