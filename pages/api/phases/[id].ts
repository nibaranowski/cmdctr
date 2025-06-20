import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { phases } from '../../../lib/mockPhaseStore';
import { PhaseSchema } from '../../../models/Phase';

const UpdatePhaseSchema = PhaseSchema.omit({ id: true, createdAt: true }).partial();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid phase ID' });
    }
    
    switch (req.method) {
      case 'GET':
        return handleGet(id, res);
      case 'PUT':
        return handlePut(id, req, res);
      case 'DELETE':
        return handleDelete(id, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGet(id: string, res: NextApiResponse) {
  const phase = phases.find(p => p.id === id);
  
  if (!phase) {
    return res.status(404).json({ error: 'Phase not found' });
  }
  
  return res.status(200).json(phase);
}

async function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const phaseIndex = phases.findIndex(p => p.id === id);
    
    if (phaseIndex === -1) {
      return res.status(404).json({ error: 'Phase not found' });
    }
    
    const validatedData = UpdatePhaseSchema.parse(req.body);
    
    const updatedPhase = {
      ...phases[phaseIndex],
      ...validatedData,
      updatedAt: new Date(),
    };
    
    phases[phaseIndex] = updatedPhase;
    
    return res.status(200).json(updatedPhase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.errors 
      });
    }
    throw error;
  }
}

async function handleDelete(id: string, res: NextApiResponse) {
  const phaseIndex = phases.findIndex(p => p.id === id);
  
  if (phaseIndex === -1) {
    return res.status(404).json({ error: 'Phase not found' });
  }
  
  const deletedPhase = phases[phaseIndex];
  phases.splice(phaseIndex, 1);
  
  return res.status(200).json({ message: 'Phase deleted successfully', phase: deletedPhase });
} 