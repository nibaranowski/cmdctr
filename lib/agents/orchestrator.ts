import { BaseAgent, AgentContext, AgentResult } from './BaseAgent';
import { logger } from './logger';
import { AgentRegistry , getMetaBox, getPhaseAgents } from './registry';


export interface OrchestrationTask {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  assigned_agent_id?: string;
  core_object_id: string;
  company_id: string;
  phase_id?: string;
  metabox_id?: string;
  capabilities_required: string[];
  context: AgentContext;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentCollaboration {
  task_id: string;
  primary_agent_id: string;
  collaborating_agents: Array<{
    agent_id: string;
    role: 'assistant' | 'reviewer' | 'specialist' | 'coordinator';
    contribution: string;
  }>;
  collaboration_type: 'sequential' | 'parallel' | 'review' | 'handoff';
  status: 'active' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private registry: AgentRegistry;
  private tasks: Map<string, OrchestrationTask> = new Map();
  private collaborations: Map<string, AgentCollaboration> = new Map();
  private taskQueue: string[] = [];

  private constructor() {
    this.registry = AgentRegistry.getInstance();
  }

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  public async createTask(
    type: string,
    coreObjectId: string,
    companyId: string,
    capabilitiesRequired: string[],
    context: AgentContext,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    metadata?: Record<string, any>
  ): Promise<OrchestrationTask> {
    const task: OrchestrationTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      status: 'pending',
      core_object_id: coreObjectId,
      company_id: companyId,
      capabilities_required: capabilitiesRequired,
      context,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Set optional properties only if provided
    if (context.phase_id) {
      task.phase_id = context.phase_id;
    }
    if (context.metabox_id) {
      task.metabox_id = context.metabox_id;
    }
    if (metadata) {
      task.metadata = metadata;
    }

    this.tasks.set(task.id, task);
    this.taskQueue.push(task.id);
    
    // Sort queue by priority
    this.taskQueue.sort((a, b) => {
      const taskA = this.tasks.get(a);
      const taskB = this.tasks.get(b);
      if (!taskA || !taskB) return 0;
      
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[taskB.priority] - priorityOrder[taskA.priority];
    });

    // Update queue metrics
    logger.setQueueLength(this.taskQueue.length);
    logger.updateTaskMetrics('pending');

    logger.info(`Created task: ${task.id} (${type}) with priority ${priority}`);
    return task;
  }

  public async assignTask(taskId: string): Promise<BaseAgent | null> {
    const task = this.tasks.get(taskId);
    if (!task) {
      logger.error(`Task not found: ${taskId}`);
      throw new Error(`Task not found: ${taskId}`);
    }

    if (task.status !== 'pending') {
      logger.error(`Task ${taskId} is not in pending status`);
      throw new Error(`Task ${taskId} is not in pending status`);
    }

    // Find the best agent for this task
    const agent = this.registry.findBestAgentForTask(
      task.capabilities_required,
      task.company_id,
      task.phase_id,
      task.metabox_id
    );

    if (!agent) {
      logger.warn(`No suitable agent found for task ${taskId}`);
      return null;
    }

    // Check if agent can handle the task
    if (agent.availability.current_task_count >= agent.availability.max_concurrent_tasks) {
      logger.warn(`Agent ${agent.id} is at capacity`);
      return null;
    }

    // Assign the task
    task.assigned_agent_id = agent.id;
    task.status = 'in_progress';
    task.updated_at = new Date().toISOString();

    // Update agent availability
    agent.availability.current_task_count++;
    agent.current_core_object_id = task.core_object_id;

    logger.info(`Assigned task ${taskId} to agent ${agent.name} (${agent.id})`);
    return agent;
  }

  public async executeTask(taskId: string): Promise<AgentResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      logger.error(`Task not found: ${taskId}`);
      throw new Error(`Task not found: ${taskId}`);
    }

    if (!task.assigned_agent_id) {
      logger.error(`Task ${taskId} is not assigned to an agent`);
      throw new Error(`Task ${taskId} is not assigned to an agent`);
    }

    const agent = this.registry.getAgent(task.assigned_agent_id);
    if (!agent) {
      logger.error(`Assigned agent not found: ${task.assigned_agent_id}`);
      throw new Error(`Assigned agent not found: ${task.assigned_agent_id}`);
    }

    const timerId = logger.startTimer('task_execution', { 
      taskId, 
      agentId: agent.id, 
      agentName: agent.name,
      taskType: task.type 
    });

    try {
      logger.info(`Executing task ${taskId} with agent ${agent.name}`);
      
      // Execute the task
      const result = await agent.execute(task.context);
      
      // Update task status
      task.status = result.success ? 'completed' : 'failed';
      task.result = result.data;
      task.error = result.error;
      task.completed_at = new Date().toISOString();
      task.updated_at = new Date().toISOString();

      // Update agent availability
      agent.availability.current_task_count--;
      if (agent.availability.current_task_count < 0) {
        agent.availability.current_task_count = 0;
      }

      // Update agent performance
      if (result.success) {
        this.registry.updateAgentPerformance(agent.id, 100);
      } else {
        this.registry.updateAgentPerformance(agent.id, 0);
      }

      // End timer and get performance metric
      const performanceMetric = logger.endTimer(timerId, { 
        success: result.success,
        taskStatus: task.status 
      });

      // Update metrics
      if (performanceMetric) {
        logger.updateTaskMetrics(task.status, performanceMetric.duration);
        logger.updateAgentMetrics(String(agent.id ?? ''), String(agent.name ?? ''), result.success, performanceMetric.duration);
      }

      logger.info(`Task ${taskId} ${result.success ? 'completed' : 'failed'}`);
      return result;
    } catch (error) {
      // Handle execution error
      logger.error(`Error executing task ${taskId} with agent ${agent?.name || 'unknown'}:`, error);
      
      // End timer and get performance metric
      const performanceMetric = logger.endTimer(timerId, { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Update metrics
      if (performanceMetric) {
        logger.updateTaskMetrics('failed', performanceMetric.duration);
        logger.updateAgentMetrics(String(agent.id ?? ''), String(agent.name ?? ''), false, performanceMetric.duration);
      }

      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.updated_at = new Date().toISOString();

      // Update agent availability
      agent.availability.current_task_count--;
      if (agent.availability.current_task_count < 0) {
        agent.availability.current_task_count = 0;
      }

      logger.error(`Task ${taskId} execution failed:`, error);
      throw error;
    }
  }

  public async createCollaboration(
    taskId: string,
    primaryAgentId: string,
    collaboratingAgents: Array<{
      agent_id: string;
      role: 'assistant' | 'reviewer' | 'specialist' | 'coordinator';
      contribution: string;
    }>,
    collaborationType: 'sequential' | 'parallel' | 'review' | 'handoff' = 'parallel'
  ): Promise<AgentCollaboration> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const collaboration: AgentCollaboration = {
      task_id: taskId,
      primary_agent_id: primaryAgentId,
      collaborating_agents: collaboratingAgents,
      collaboration_type: collaborationType,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const collaborationId = `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.collaborations.set(collaborationId, collaboration);

    logger.info(`Created collaboration for task ${taskId} with ${collaboratingAgents.length} agents`);
    return collaboration;
  }

  public async executeCollaboration(collaborationId: string): Promise<AgentResult[]> {
    const collaboration = this.collaborations.get(collaborationId);
    if (!collaboration) {
      throw new Error(`Collaboration not found: ${collaborationId}`);
    }

    const task = this.tasks.get(collaboration.task_id);
    if (!task) {
      throw new Error(`Task not found: ${collaboration.task_id}`);
    }

    const results: AgentResult[] = [];

    try {
      if (collaboration.collaboration_type === 'parallel') {
        // Execute all agents in parallel
        const promises = collaboration.collaborating_agents.map(async (collabAgent) => {
          const agent = this.registry.getAgent(collabAgent.agent_id);
          if (!agent) {
            throw new Error(`Collaborating agent not found: ${collabAgent.agent_id}`);
          }

          // Create a modified context for the collaborating agent
          const collabContext: AgentContext = {
            ...task.context,
            metadata: {
              ...task.context.metadata,
              collaboration_role: collabAgent.role,
              primary_agent_id: collaboration.primary_agent_id,
              contribution: collabAgent.contribution
            }
          };

          return await agent.execute(collabContext);
        });

        const parallelResults = await Promise.all(promises);
        results.push(...parallelResults);

      } else if (collaboration.collaboration_type === 'sequential') {
        // Execute agents in sequence
        for (const collabAgent of collaboration.collaborating_agents) {
          const agent = this.registry.getAgent(collabAgent.agent_id);
          if (!agent) {
            throw new Error(`Collaborating agent not found: ${collabAgent.agent_id}`);
          }

          const collabContext: AgentContext = {
            ...task.context,
            metadata: {
              ...task.context.metadata,
              collaboration_role: collabAgent.role,
              primary_agent_id: collaboration.primary_agent_id,
              contribution: collabAgent.contribution,
              previous_results: results
            }
          };

          const result = await agent.execute(collabContext);
          results.push(result);
        }

      } else if (collaboration.collaboration_type === 'review') {
        // Primary agent executes, others review
        const primaryAgent = this.registry.getAgent(collaboration.primary_agent_id);
        if (!primaryAgent) {
          throw new Error(`Primary agent not found: ${collaboration.primary_agent_id}`);
        }

        const primaryResult = await primaryAgent.execute(task.context);
        results.push(primaryResult);

        // Reviewers provide feedback
        for (const collabAgent of collaboration.collaborating_agents) {
          const agent = this.registry.getAgent(collabAgent.agent_id);
          if (!agent) continue;

          const reviewContext: AgentContext = {
            ...task.context,
            metadata: {
              ...task.context.metadata,
              collaboration_role: 'reviewer',
              primary_result: primaryResult,
              contribution: collabAgent.contribution
            }
          };

          const reviewResult = await agent.execute(reviewContext);
          results.push(reviewResult);
        }
      }

      collaboration.status = 'completed';
      collaboration.completed_at = new Date().toISOString();

      logger.info(`Collaboration ${collaborationId} completed with ${results.length} results`);
      return results;
    } catch (error) {
      collaboration.status = 'failed';
      logger.error(`Collaboration ${collaborationId} failed:`, error);
      throw error;
    }
  }

  public async handoffTask(
    taskId: string,
    targetAgentId: string,
    handoffReason: string
  ): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const targetAgent = this.registry.getAgent(targetAgentId);
    if (!targetAgent) {
      throw new Error(`Target agent not found: ${targetAgentId}`);
    }

    // Check if target agent can handle the task
    if (!task.capabilities_required.every(cap => targetAgent.capabilities.includes(cap))) {
      throw new Error(`Target agent ${targetAgentId} does not have required capabilities`);
    }

    if (targetAgent.availability.current_task_count >= targetAgent.availability.max_concurrent_tasks) {
      throw new Error(`Target agent ${targetAgentId} is at capacity`);
    }

    // Release current agent
    if (task.assigned_agent_id) {
      const currentAgent = this.registry.getAgent(task.assigned_agent_id);
      if (currentAgent) {
        currentAgent.availability.current_task_count--;
        if (currentAgent.availability.current_task_count < 0) {
          currentAgent.availability.current_task_count = 0;
        }
      }
    }

    // Assign to target agent
    task.assigned_agent_id = targetAgentId;
    task.updated_at = new Date().toISOString();
    task.metadata = {
      ...task.metadata,
      handoff_reason: handoffReason,
      handoff_timestamp: new Date().toISOString()
    };

    targetAgent.availability.current_task_count++;
    targetAgent.current_core_object_id = task.core_object_id;

    logger.info(`Handed off task ${taskId} from ${task.assigned_agent_id} to ${targetAgentId}: ${handoffReason}`);
    return true;
  }

  public getTask(taskId: string): OrchestrationTask | null {
    return this.tasks.get(taskId) || null;
  }

  public getTasksByStatus(status: OrchestrationTask['status']): OrchestrationTask[] {
    return Array.from(this.tasks.values()).filter(task => task.status === status);
  }

  public getTasksByAgent(agentId: string): OrchestrationTask[] {
    return Array.from(this.tasks.values()).filter(task => task.assigned_agent_id === agentId);
  }

  public getTasksByCompany(companyId: string): OrchestrationTask[] {
    return Array.from(this.tasks.values()).filter(task => task.company_id === companyId);
  }

  public getTaskQueue(): OrchestrationTask[] {
    return this.taskQueue.map(taskId => this.tasks.get(taskId)).filter(Boolean) as OrchestrationTask[];
  }

  public getCollaboration(collaborationId: string): AgentCollaboration | null {
    return this.collaborations.get(collaborationId) || null;
  }

  public getCollaborationsByTask(taskId: string): AgentCollaboration[] {
    return Array.from(this.collaborations.values()).filter(collab => collab.task_id === taskId);
  }

  public getOrchestratorStats(): {
    total_tasks: number;
    tasks_by_status: Record<string, number>;
    tasks_by_priority: Record<string, number>;
    active_collaborations: number;
    average_task_completion_time_hours: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const totalTasks = tasks.length;
    
    const tasksByStatus: Record<string, number> = {};
    const tasksByPriority: Record<string, number> = {};
    
    tasks.forEach(task => {
      tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
      tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
    });

    const activeCollaborations = Array.from(this.collaborations.values())
      .filter(collab => collab.status === 'active').length;

    const completedTasks = tasks.filter(task => task.status === 'completed' && task.completed_at);
    const averageCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          const created = new Date(task.created_at).getTime();
          const completed = new Date(task.completed_at!).getTime();
          return sum + (completed - created) / (1000 * 60 * 60); // Convert to hours
        }, 0) / completedTasks.length
      : 0;

    return {
      total_tasks: totalTasks,
      tasks_by_status: tasksByStatus,
      tasks_by_priority: tasksByPriority,
      active_collaborations: activeCollaborations,
      average_task_completion_time_hours: averageCompletionTime
    };
  }

  // Helper to get phase id as string
  private getPhaseId(phase: string | { id: string }): string {
    if (typeof phase === 'string') return phase;
    if (phase && typeof (phase as any).id === 'string') return (phase as any).id;
    return '';
  }

  /**
   * Execute a specific phase within a meta box
   * @param metaBoxId - The meta box ID
   * @param phaseId - The phase ID to execute
   * @returns Promise<AgentResult[]> - Results from all agents in the phase
   */
  async executePhase(metaBoxId: string, phaseId: string): Promise<AgentResult[]> {
    const metaBox = getMetaBox(metaBoxId);
    if (!metaBox) {
      logger.error(`Meta box ${metaBoxId} not found`);
      throw new Error(`Meta box ${metaBoxId} not found`);
    }

    const agents = getPhaseAgents(metaBoxId, phaseId);
    if (agents.length === 0) {
      logger.error(`No agents found for phase ${phaseId} in meta box ${metaBoxId}`);
      throw new Error(`No agents found for phase ${phaseId} in meta box ${metaBoxId}`);
    }

    const results: AgentResult[] = [];
    
    for (const agentConfig of agents) {
      try {
        const safePhaseId = String(phaseId ?? '');
        // Find the actual agent instance in the registry
        const agentInstance = this.registry.findAgentsByFilter({
          company_id: (agentConfig as any).company_id || '',
          metabox_id: metaBoxId,
          phase_id: safePhaseId
        }).find(agent => agent.name === String(agentConfig.name ?? ''));

        if (!agentInstance) {
          logger.error(`Agent instance not found for ${String(agentConfig.name ?? '')} (id: ${String(agentConfig.id ?? '')}) in phase ${safePhaseId}, metabox ${metaBoxId}`);
          throw new Error(`Agent instance not found for ${String(agentConfig.name ?? '')}`);
        }

        const result = await agentInstance.execute({
          metabox_id: metaBoxId,
          phase_id: safePhaseId,
          company_id: (agentConfig as any).company_id || '',
          metadata: {
            execution_type: 'phase_execution',
            phase_id: safePhaseId,
            meta_box_id: metaBoxId
          }
        });
        results.push(result);
      } catch (error) {
        const safePhaseId = String(phaseId ?? '');
        logger.error(`Agent execution error for agent ${String(agentConfig.name ?? '')} (id: ${String(agentConfig.id ?? '')}) in phase ${safePhaseId}, metabox ${metaBoxId}:`, error);
        results.push({
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            agent_id: String(agentConfig.id ?? ''),
            agent_name: String(agentConfig.name ?? ''),
            metabox_id: metaBoxId,
            phase_id: safePhaseId,
            timestamp: new Date().toISOString(),
            execution_type: 'phase_execution'
          }
        });
      }
    }

    return results;
  }

  /**
   * Execute an entire workflow (all phases in a meta box)
   * @param metaBoxId - The meta box ID
   * @returns Promise<Record<string, AgentResult[]>> - Results organized by phase
   */
  async executeWorkflow(metaBoxId: string): Promise<Record<string, AgentResult[]>> {
    const metaBox = getMetaBox(metaBoxId);
    if (!metaBox) {
      throw new Error(`Meta box ${metaBoxId} not found`);
    }

    const results: Record<string, AgentResult[]> = {};
    
    for (const phase of metaBox.phases) {
      try {
        const phaseId = this.getPhaseId(phase) || '';
        results[phaseId] = await this.executePhase(metaBoxId, phaseId);
      } catch (error) {
        const phaseId = this.getPhaseId(phase) || '';
        logger.error(`Phase execution error for ${phaseId} in metabox ${metaBoxId}:`, error);
        results[phaseId] = [{
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            metabox_id: metaBoxId,
            phase_id: phaseId,
            timestamp: new Date().toISOString(),
            execution_type: 'workflow_execution'
          }
        }];
      }
    }

    return results;
  }

  /**
   * Execute multiple phases in parallel
   * @param metaBoxId - The meta box ID
   * @param phaseIds - Array of phase IDs to execute in parallel
   * @returns Promise<Record<string, AgentResult[]>> - Results organized by phase
   */
  async executeParallelPhases(metaBoxId: string, phaseIds: string[]): Promise<Record<string, AgentResult[]>> {
    if (phaseIds.length === 0) {
      return {};
    }

    if (phaseIds.length === 1) {
      const results = await this.executePhase(metaBoxId, phaseIds[0]);
      return { [phaseIds[0]]: results };
    }

    const phasePromises = phaseIds.map(async (phaseIdRaw) => {
      const phaseId = String(phaseIdRaw ?? '');
      try {
        const results = await this.executePhase(metaBoxId, phaseId);
        return { phaseId, results };
      } catch (error) {
        logger.error(`Parallel phase execution error for ${phaseId} in metabox ${metaBoxId}:`, error);
        return {
          phaseId,
          results: [{
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              metabox_id: metaBoxId,
              phase_id: phaseId,
              timestamp: new Date().toISOString(),
              execution_type: 'parallel_phase_execution'
            }
          }]
        };
      }
    });
    const phaseResults = await Promise.all(phasePromises);
    const results: Record<string, AgentResult[]> = {};
    for (const { phaseId, results: phaseResult } of phaseResults) {
      const safePhaseId = String(phaseId ?? '');
      if (safePhaseId) {
        results[safePhaseId] = phaseResult;
      }
    }

    return results;
  }
} 