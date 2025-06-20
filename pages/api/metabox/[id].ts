import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../../lib/mongodb';
import { MetaBox, MetaBoxSchema } from '../../../models/MetaBox';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Meta box ID is required' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, id);
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { user_id } = req.query;

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    const metaBoxData = await collection.findOne({ id });

    if (!metaBoxData) {
      return res.status(404).json({ error: 'Meta box not found' });
    }

    const metaBox = new MetaBox(metaBoxData);

    // Check permissions
    if (user_id && typeof user_id === 'string') {
      if (!metaBox.canAccess(user_id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.status(200).json({
      success: true,
      data: metaBox
    });
  } catch (error) {
    console.error('Error fetching meta box:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    // Get existing meta box
    const existingData = await collection.findOne({ id });
    if (!existingData) {
      return res.status(404).json({ error: 'Meta box not found' });
    }

    const existingMetaBox = new MetaBox(existingData);

    // Check edit permissions
    if (!existingMetaBox.canEdit(user_id)) {
      return res.status(403).json({ error: 'Edit access denied' });
    }

    // Validate the update data
    const updateData = { ...existingData, ...req.body };
    const validationResult = MetaBoxSchema.safeParse(updateData);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid meta box data',
        details: validationResult.error.errors
      });
    }

    // Check for version conflicts
    const conflict = existingMetaBox.detectConflict({
      version: req.body.version || 0,
      changes: req.body
    });

    if (conflict.hasConflict) {
      return res.status(409).json({ 
        error: 'Version conflict',
        message: conflict.message
      });
    }

    // Update meta box
    const updatedMetaBox = new MetaBox(updateData);
    updatedMetaBox.version = existingMetaBox.version + 1;
    updatedMetaBox.updated_at = new Date().toISOString();

    const result = await collection.updateOne(
      { id },
      { $set: updatedMetaBox }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        data: updatedMetaBox,
        message: 'Meta box updated successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to update meta box' });
    }
  } catch (error) {
    console.error('Error updating meta box:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    await dbConnect();
    const MetaBoxModel = mongoose.model('MetaBox', new mongoose.Schema({}));
    const collection = MetaBoxModel.collection;

    // Get existing meta box
    const existingData = await collection.findOne({ id });
    if (!existingData) {
      return res.status(404).json({ error: 'Meta box not found' });
    }

    const existingMetaBox = new MetaBox(existingData);

    // Check delete permissions (only owner can delete)
    if (!existingMetaBox.canEdit(user_id)) {
      return res.status(403).json({ error: 'Delete access denied' });
    }

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