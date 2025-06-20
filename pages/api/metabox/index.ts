import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../../lib/mongodb';
import { MetaBox, MetaBoxSchema } from '../../../models/MetaBox';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { company_id, user_id } = req.query;

    if (!company_id || typeof company_id !== 'string') {
      return res.status(400).json({ error: 'company_id is required' });
    }

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    // Build query based on permissions
    const query: any = { company_id };
    
    if (user_id && typeof user_id === 'string') {
      // Include meta boxes that the user owns or has access to
      query.$or = [
        { owner_id: user_id },
        { shared_with: user_id }
      ];
    }

    const metaBoxes = await collection.find(query).toArray();

    // Convert to MetaBox instances
    const metaBoxInstances = metaBoxes.map((data: any) => new MetaBox(data));

    res.status(200).json({
      success: true,
      data: metaBoxInstances,
      count: metaBoxInstances.length
    });
  } catch (error) {
    console.error('Error fetching meta boxes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { company_id, user_id } = req.body;

    if (!company_id || !user_id) {
      return res.status(400).json({ error: 'company_id and user_id are required' });
    }

    // Validate the meta box data
    const validationResult = MetaBoxSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid meta box data',
        details: validationResult.error.errors
      });
    }

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    // Create new meta box
    const metaBox = new MetaBox({
      ...req.body,
      owner_id: user_id
    });

    // Insert into database
    const result = await collection.insertOne(metaBox);

    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        data: metaBox,
        message: 'Meta box created successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to create meta box' });
    }
  } catch (error) {
    console.error('Error creating meta box:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 