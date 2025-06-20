import { NextApiRequest, NextApiResponse } from 'next';

import { CoreObjectSchema, CoreObjectUpdateInput } from '../../../models/CoreObject';

// Mock database - replace with actual database connection
const coreObjects: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const coreObject = coreObjects.find(obj => obj.id === id);
      
      if (!coreObject) {
        return res.status(404).json({ error: 'Core object not found' });
      }
      
      res.status(200).json(coreObject);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch core object' });
    }
  } else if (req.method === 'PUT') {
    try {
      const coreObjectIndex = coreObjects.findIndex(obj => obj.id === id);
      
      if (coreObjectIndex === -1) {
        return res.status(404).json({ error: 'Core object not found' });
      }
      
      const updateData: CoreObjectUpdateInput = req.body;
      
      // Validate update data
      const updatedObject = {
        ...coreObjects[coreObjectIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      const validationResult = CoreObjectSchema.safeParse(updatedObject);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid core object data', details: validationResult.error });
      }
      
      coreObjects[coreObjectIndex] = validationResult.data;
      
      res.status(200).json(validationResult.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update core object' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const coreObjectIndex = coreObjects.findIndex(obj => obj.id === id);
      
      if (coreObjectIndex === -1) {
        return res.status(404).json({ error: 'Core object not found' });
      }
      
      const deletedObject = coreObjects.splice(coreObjectIndex, 1)[0];
      
      res.status(200).json({ message: 'Core object deleted successfully', deletedObject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete core object' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 