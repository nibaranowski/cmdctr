import { NextApiRequest, NextApiResponse } from 'next';

import { CoreObjectSchema, CoreObjectCreateInput, CoreObjectFilter } from '../../../models/CoreObject';

// Mock database - replace with actual database connection
const coreObjects: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { metabox_id, phase_id, assigned_user_id, agent_id, status } = req.query;
      
      let filteredObjects = [...coreObjects];
      
      // Apply filters
      if (metabox_id) {
        filteredObjects = filteredObjects.filter(obj => obj.metabox_id === metabox_id);
      }
      if (phase_id) {
        filteredObjects = filteredObjects.filter(obj => obj.phase_id === phase_id);
      }
      if (assigned_user_id) {
        filteredObjects = filteredObjects.filter(obj => obj.assigned_user_id === assigned_user_id);
      }
      if (agent_id) {
        filteredObjects = filteredObjects.filter(obj => obj.agent_id === agent_id);
      }
      if (status) {
        const statusArray = Array.isArray(status) ? status : [status];
        filteredObjects = filteredObjects.filter(obj => statusArray.includes(obj.status));
      }
      
      res.status(200).json(filteredObjects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch core objects' });
    }
  } else if (req.method === 'POST') {
    try {
      const coreObjectData: CoreObjectCreateInput = req.body;
      
      // Validate input data
      const validationResult = CoreObjectSchema.safeParse({
        id: `coreobj_${Date.now()}`,
        ...coreObjectData,
        status: coreObjectData.status || 'active',
        activity_log: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid core object data', details: validationResult.error });
      }
      
      const newCoreObject = validationResult.data;
      coreObjects.push(newCoreObject);
      
      res.status(201).json(newCoreObject);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create core object' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 