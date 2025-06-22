import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../../lib/mongodb';
import { MetaBox, MetaBoxSchema } from '../../../models/MetaBox';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else if (req.method === 'PUT') {
    return handlePut(req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
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

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, user_id, ...updateData } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ error: 'id and user_id are required' });
    }

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    // Check if meta box exists and user has permission to edit
    const existingMetaBox = await collection.findOne({ id });
    if (!existingMetaBox) {
      return res.status(404).json({ error: 'Meta box not found' });
    }

    if (existingMetaBox.owner_id !== user_id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Validate the update data
    const validationResult = MetaBoxSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid update data',
        details: validationResult.error.errors
      });
    }

    // Update the meta box
    const result = await collection.updateOne(
      { id },
      { 
        $set: {
          ...updateData,
          updated_at: new Date().toISOString(),
          version: (existingMetaBox.version || 1) + 1
        }
      }
    );

    if (result.modifiedCount > 0) {
      // Fetch updated meta box
      const updatedMetaBox = await collection.findOne({ id });
      if (updatedMetaBox && updatedMetaBox.name && updatedMetaBox.company_id) {
        res.status(200).json({
          success: true,
          data: new MetaBox(updatedMetaBox as any),
          message: 'Meta box updated successfully'
        });
      } else {
        res.status(500).json({ error: 'Failed to fetch updated meta box' });
      }
    } else {
      res.status(500).json({ error: 'Failed to update meta box' });
    }
  } catch (error) {
    console.error('Error updating meta box:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, user_id } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ error: 'id and user_id are required' });
    }

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    // Check if meta box exists and user has permission to delete
    const existingMetaBox = await collection.findOne({ id });
    if (!existingMetaBox) {
      return res.status(404).json({ error: 'Meta box not found' });
    }

    if (existingMetaBox.owner_id !== user_id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Delete the meta box
    const result = await collection.deleteOne({ id });

    if (result.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Meta box deleted successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to delete meta box' });
    }
  } catch (error) {
    console.error('Error deleting meta box:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 