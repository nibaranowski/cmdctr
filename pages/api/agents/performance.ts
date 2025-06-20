import { NextApiRequest, NextApiResponse } from 'next';

import { logger } from '../../../lib/agents/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const performanceReport = logger.getPerformanceReport();
    
    res.status(200).json({
      success: true,
      data: performanceReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics',
      timestamp: new Date().toISOString()
    });
  }
} 