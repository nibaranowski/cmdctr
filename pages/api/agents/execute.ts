import { NextApiRequest, NextApiResponse } from 'next';

import { AgentOrchestrator } from '../../../lib/agents/orchestrator';
import { AgentContext } from '../../../lib/agents/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metaBoxId, phase, context } = req.body;

    if (!metaBoxId || !context) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const agentContext: AgentContext = {
      userId: context.userId,
      organizationId: context.organizationId,
      metadata: context.metadata,
    };

    const orchestrator = new AgentOrchestrator(agentContext);

    let results;
    if (phase) {
      // Execute specific phase
      results = await orchestrator.executePhase(metaBoxId, phase);
    } else {
      // Execute entire workflow
      results = await orchestrator.executeWorkflow(metaBoxId);
    }

    return res.status(200).json({
      success: true,
      data: results,
      metadata: {
        metaBoxId,
        phase: phase || 'all',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Agent execution error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
} 