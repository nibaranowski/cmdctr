import { NextApiRequest, NextApiResponse } from 'next';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  health: {
    lastCheck: Date;
    isAlive: boolean;
    errorCount: number;
  };
  logs: Array<{
    timestamp: Date;
    action: string;
    message: string;
    level: 'info' | 'warn' | 'error';
  }>;
  retryConfig: {
    maxRetries: number;
    backoffMs: number;
    currentRetries: number;
  };
}

// In-memory agent registry (replace with DB in production)
const agentRegistry = new Map<string, Agent>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, agentId, data } = req.body;

    switch (action) {
      case 'register':
        return await registerAgent(req, res, data);
      case 'assign':
        return await assignTask(req, res, agentId, data);
      case 'health':
        return await checkHealth(req, res, agentId);
      case 'log':
        return await logAction(req, res, agentId, data);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Agent lifecycle error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function registerAgent(req: NextApiRequest, res: NextApiResponse, data: any) {
  const { name, config } = data;
  
  if (!name) {
    return res.status(400).json({ error: 'Agent name is required' });
  }

  const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const agent: Agent = {
    id: agentId,
    name,
    status: 'idle',
    health: {
      lastCheck: new Date(),
      isAlive: true,
      errorCount: 0,
    },
    logs: [{
      timestamp: new Date(),
      action: 'register',
      message: 'Agent registered successfully',
      level: 'info',
    }],
    retryConfig: {
      maxRetries: config?.maxRetries || 3,
      backoffMs: config?.backoffMs || 1000,
      currentRetries: 0,
    },
  };

  agentRegistry.set(agentId, agent);
  
  return res.status(201).json({ 
    success: true, 
    agentId,
    message: 'Agent registered successfully' 
  });
}

async function assignTask(req: NextApiRequest, res: NextApiResponse, agentId: string, data: any) {
  const agent = agentRegistry.get(agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  if (agent.status === 'busy') {
    return res.status(409).json({ error: 'Agent is busy' });
  }

  const { taskId, taskType, payload } = data;
  
  if (!taskId || !taskType) {
    return res.status(400).json({ error: 'Task ID and type are required' });
  }

  // Update agent status and log assignment
  agent.status = 'busy';
  agent.logs.push({
    timestamp: new Date(),
    action: 'assign',
    message: `Assigned task ${taskId} of type ${taskType}`,
    level: 'info',
  });

  // Simulate task execution with retry logic
  try {
    await executeTaskWithRetry(agent, taskId, taskType, payload);
    agent.status = 'idle';
  } catch (error) {
    agent.status = 'error';
    agent.health.errorCount++;
    agent.logs.push({
      timestamp: new Date(),
      action: 'error',
      message: `Task ${taskId} failed: ${(error as Error).message}`,
      level: 'error',
    });
  }

  return res.status(200).json({ 
    success: true, 
    message: 'Task assigned successfully',
    agentStatus: agent.status 
  });
}

async function checkHealth(req: NextApiRequest, res: NextApiResponse, agentId: string) {
  const agent = agentRegistry.get(agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  // Update health check timestamp
  agent.health.lastCheck = new Date();
  
  // Simple health check: agent is alive if it has been active recently
  const timeSinceLastActivity = Date.now() - agent.health.lastCheck.getTime();
  agent.health.isAlive = timeSinceLastActivity < 300000; // 5 minutes

  return res.status(200).json({
    success: true,
    health: agent.health,
    status: agent.status,
    lastActivity: agent.health.lastCheck,
  });
}

async function logAction(req: NextApiRequest, res: NextApiResponse, agentId: string, data: any) {
  const agent = agentRegistry.get(agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const { action, message, level = 'info' } = data;
  
  if (!action || !message) {
    return res.status(400).json({ error: 'Action and message are required' });
  }

  agent.logs.push({
    timestamp: new Date(),
    action,
    message,
    level,
  });

  // Keep only last 100 logs
  if (agent.logs.length > 100) {
    agent.logs = agent.logs.slice(-100);
  }

  return res.status(200).json({ 
    success: true, 
    message: 'Log entry added successfully' 
  });
}

// Retry logic with exponential backoff - FLAGGED FOR REVIEW
async function executeTaskWithRetry(agent: Agent, taskId: string, taskType: string, payload: any) {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= agent.retryConfig.maxRetries; attempt++) {
    try {
      // Simulate task execution
      await simulateTaskExecution(taskId, taskType, payload);
      agent.retryConfig.currentRetries = 0; // Reset on success
      return;
    } catch (error) {
      lastError = error as Error;
      agent.retryConfig.currentRetries = attempt;
      
      // Log retry attempt
      agent.logs.push({
        timestamp: new Date(),
        action: 'retry',
        message: `Task ${taskId} failed, attempt ${attempt}/${agent.retryConfig.maxRetries}`,
        level: 'warn',
      });

      if (attempt < agent.retryConfig.maxRetries) {
        // Exponential backoff: wait longer between each retry
        const backoffDelay = agent.retryConfig.backoffMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError!;
}

// Simulate task execution (replace with actual task logic)
async function simulateTaskExecution(taskId: string, taskType: string, payload: any) {
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate occasional failures
  if (Math.random() < 0.3) {
    throw new Error(`Simulated failure for task ${taskId}`);
  }
  
  return { success: true, taskId, result: 'Task completed successfully' };
} 