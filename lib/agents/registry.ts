import { Agent, AgentCreateInput, AgentFilter } from '../../models/Agent';

import { BaseAgent } from './BaseAgent';
import { AIOutreachAgent } from './fundraising/AIOutreachAgent';
import { InvestorResearchAgent } from './fundraising/InvestorResearchAgent';
import { FundraisingMetaBox } from './fundraising/manifest';
import { logger } from './logger';
import { MetaBoxConfig } from './types';

export const MetaBoxRegistry: Record<string, MetaBoxConfig> = {
  fundraising: FundraisingMetaBox,
  // TODO: Add other meta boxes as they are implemented:
  // hiring: HiringMetaBox,
  // selling: SellingMetaBox,
  // product: ProductMetaBox,
  // marketing: MarketingMetaBox,
  // reporting: ReportingMetaBox,
  // support: SupportMetaBox,
  // legal: LegalMetaBox,
  // finance: FinanceMetaBox,
  // it: ITMetaBox,
  // procurement: ProcurementMetaBox,
  // knowledge: KnowledgeMetaBox,
  // facilities: FacilitiesMetaBox,
  // strategy: StrategyMetaBox,
  // partners: PartnersMetaBox,
  // community: CommunityMetaBox,
};

export function getMetaBox(id: string): MetaBoxConfig | undefined {
  return MetaBoxRegistry[id];
}

export function getAgent(metaBoxId: string, agentId: string) {
  const metaBox = getMetaBox(metaBoxId);
  if (!metaBox) return undefined;
  return metaBox.agents.find(agent => agent.id === agentId);
}

export function getPhaseAgents(metaBoxId: string, phase: string) {
  const metaBox = getMetaBox(metaBoxId);
  if (!metaBox) return [];
  return metaBox.agents.filter(agent => agent.phase === phase);
}

export function getAllMetaBoxes(): MetaBoxConfig[] {
  return Object.values(MetaBoxRegistry);
}

export function validateMetaBox(config: MetaBoxConfig): boolean {
  // TODO: Implement validation logic
  // 1. Check all required fields
  // 2. Validate phase consistency
  // 3. Check agent configurations
  // 4. Validate dependencies
  return true;
}

export interface AgentRegistryEntry {
  agent: BaseAgent;
  metadata: {
    created_at: string;
    last_updated: string;
    usage_count: number;
    average_performance: number;
  };
}

export interface AgentCapability {
  name: string;
  description: string;
  required_skills: string[];
  supported_phases: string[];
  supported_metaboxes: string[];
}

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentRegistryEntry> = new Map();
  private capabilities: Map<string, AgentCapability> = new Map();

  private constructor() {
    this.initializeCapabilities();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private initializeCapabilities(): void {
    // Fundraising capabilities
    this.capabilities.set('investor_research', {
      name: 'Investor Research',
      description: 'Deep research on investors, their portfolio, and investment thesis',
      required_skills: ['market_research', 'financial_analysis', 'network_analysis'],
      supported_phases: ['fundraising'],
      supported_metaboxes: ['fundraising']
    });

    this.capabilities.set('personalized_outreach', {
      name: 'Personalized Outreach',
      description: 'Creating and sending personalized outreach messages',
      required_skills: ['communication', 'personalization', 'email_automation'],
      supported_phases: ['fundraising', 'sales', 'marketing'],
      supported_metaboxes: ['fundraising', 'sales', 'marketing']
    });

    this.capabilities.set('deal_flow_analysis', {
      name: 'Deal Flow Analysis',
      description: 'Analyzing deal flow patterns and investor behavior',
      required_skills: ['data_analysis', 'pattern_recognition', 'financial_modeling'],
      supported_phases: ['fundraising'],
      supported_metaboxes: ['fundraising']
    });

    this.capabilities.set('network_analysis', {
      name: 'Network Analysis',
      description: 'Mapping and analyzing investor networks and connections',
      required_skills: ['network_analysis', 'graph_theory', 'relationship_mapping'],
      supported_phases: ['fundraising', 'sales'],
      supported_metaboxes: ['fundraising', 'sales']
    });

    this.capabilities.set('financial_analysis', {
      name: 'Financial Analysis',
      description: 'Analyzing financial data and investment patterns',
      required_skills: ['financial_modeling', 'data_analysis', 'valuation'],
      supported_phases: ['fundraising', 'finance'],
      supported_metaboxes: ['fundraising', 'finance']
    });

    // Marketing capabilities
    this.capabilities.set('content_creation', {
      name: 'Content Creation',
      description: 'Creating marketing content and materials',
      required_skills: ['copywriting', 'design', 'brand_strategy'],
      supported_phases: ['marketing'],
      supported_metaboxes: ['marketing']
    });

    this.capabilities.set('campaign_management', {
      name: 'Campaign Management',
      description: 'Managing marketing campaigns and automation',
      required_skills: ['project_management', 'automation', 'analytics'],
      supported_phases: ['marketing'],
      supported_metaboxes: ['marketing']
    });

    // Sales capabilities
    this.capabilities.set('lead_generation', {
      name: 'Lead Generation',
      description: 'Identifying and qualifying sales leads',
      required_skills: ['prospecting', 'qualification', 'research'],
      supported_phases: ['sales'],
      supported_metaboxes: ['sales']
    });

    this.capabilities.set('sales_automation', {
      name: 'Sales Automation',
      description: 'Automating sales processes and follow-ups',
      required_skills: ['automation', 'crm_management', 'process_optimization'],
      supported_phases: ['sales'],
      supported_metaboxes: ['sales']
    });

    // Product capabilities
    this.capabilities.set('feature_prioritization', {
      name: 'Feature Prioritization',
      description: 'Prioritizing product features based on user feedback and business goals',
      required_skills: ['product_management', 'data_analysis', 'user_research'],
      supported_phases: ['product'],
      supported_metaboxes: ['product']
    });

    this.capabilities.set('user_research', {
      name: 'User Research',
      description: 'Conducting user research and gathering feedback',
      required_skills: ['research_methods', 'data_analysis', 'user_empathy'],
      supported_phases: ['product'],
      supported_metaboxes: ['product']
    });
  }

  public registerAgent(agent: BaseAgent): void {
    const entry: AgentRegistryEntry = {
      agent,
      metadata: {
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        usage_count: 0,
        average_performance: 0
      }
    };

    this.agents.set(agent.id, entry);
    logger.info(`Registered agent: ${agent.name} (${agent.id})`);
  }

  public unregisterAgent(agentId: string): boolean {
    const removed = this.agents.delete(agentId);
    if (removed) {
      logger.info(`Unregistered agent: ${agentId}`);
    } else {
      logger.warn(`Attempted to unregister non-existent agent: ${agentId}`);
    }
    return removed;
  }

  public getAgent(agentId: string): BaseAgent | null {
    const entry = this.agents.get(agentId);
    if (!entry) {
      logger.warn(`Agent not found: ${agentId}`);
    }
    return entry ? entry.agent : null;
  }

  public getAllAgents(): BaseAgent[] {
    logger.info('Fetching all registered agents');
    return Array.from(this.agents.values()).map(entry => entry.agent);
  }

  public findAgentsByCapability(capability: string): BaseAgent[] {
    return this.getAllAgents().filter(agent => 
      agent.capabilities.includes(capability)
    );
  }

  public findAgentsByPhase(phaseId: string): BaseAgent[] {
    return this.getAllAgents().filter(agent => 
      agent.phase_id === phaseId
    );
  }

  public findAgentsByMetabox(metaboxId: string): BaseAgent[] {
    return this.getAllAgents().filter(agent => 
      agent.metabox_id === metaboxId
    );
  }

  public findAgentsByFilter(filter: AgentFilter): BaseAgent[] {
    return this.getAllAgents().filter(agent => {
      // Company filter
      if (agent.company_id !== filter.company_id) {
        return false;
      }

      // Metabox filter
      if (filter.metabox_id && agent.metabox_id !== filter.metabox_id) {
        return false;
      }

      // Phase filter
      if (filter.phase_id && agent.phase_id !== filter.phase_id) {
        return false;
      }

      // Agent type filter
      if (filter.agent_type && !filter.agent_type.includes(agent.agent_type)) {
        return false;
      }

      // Status filter
      if (filter.status && !filter.status.includes(agent.status)) {
        return false;
      }

      // Capabilities filter
      if (filter.capabilities && !filter.capabilities.some(cap => agent.capabilities.includes(cap))) {
        return false;
      }

      // Availability filter
      if (filter.is_available !== undefined && agent.availability.is_available !== filter.is_available) {
        return false;
      }

      // Core object filter
      if (filter.current_core_object_id && agent.current_core_object_id !== filter.current_core_object_id) {
        return false;
      }

      // Date filters
      if (filter.created_at_before && agent.created_at > filter.created_at_before) {
        return false;
      }

      if (filter.created_at_after && agent.created_at < filter.created_at_after) {
        return false;
      }

      return true;
    });
  }

  public findBestAgentForTask(
    capabilities: string[],
    companyId: string,
    phaseId?: string,
    metaboxId?: string
  ): BaseAgent | null {
    const candidates = this.getAllAgents().filter(agent => {
      // Must match company
      if (agent.company_id !== companyId) {
        return false;
      }

      // Must have required capabilities
      if (!capabilities.every(cap => agent.capabilities.includes(cap))) {
        return false;
      }

      // Must be available
      if (!agent.availability.is_available) {
        return false;
      }

      // Must not be at capacity
      if (agent.availability.current_task_count >= agent.availability.max_concurrent_tasks) {
        return false;
      }

      // Optional phase match
      if (phaseId && agent.phase_id && agent.phase_id !== phaseId) {
        return false;
      }

      // Optional metabox match
      if (metaboxId && agent.metabox_id && agent.metabox_id !== metaboxId) {
        return false;
      }

      return true;
    });

    if (candidates.length === 0) {
      return null;
    }

    // Score candidates based on multiple factors
    const scoredCandidates = candidates.map(agent => {
      const entry = this.agents.get(agent.id);
      if (!entry) return { agent, score: 0 };

      let score = 0;

      // Performance score (40% weight)
      score += entry.metadata.average_performance * 0.4;

      // Availability score (30% weight)
      const availabilityScore = 100 - (agent.availability.current_task_count / agent.availability.max_concurrent_tasks) * 100;
      score += availabilityScore * 0.3;

      // Success rate score (20% weight)
      score += agent.performance_metrics.success_rate * 0.2;

      // Recency score (10% weight)
      const daysSinceLastActivity = (Date.now() - new Date(agent.performance_metrics.last_activity).getTime()) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 100 - daysSinceLastActivity * 10);
      score += recencyScore * 0.1;

      return { agent, score };
    });

    // Return the highest scoring agent
    scoredCandidates.sort((a, b) => b.score - a.score);
    return scoredCandidates[0]?.agent || null;
  }

  public getCapabilities(): AgentCapability[] {
    return Array.from(this.capabilities.values());
  }

  public getCapability(name: string): AgentCapability | null {
    return this.capabilities.get(name) || null;
  }

  public updateAgentPerformance(agentId: string, performance: number): void {
    const entry = this.agents.get(agentId);
    if (entry) {
      entry.metadata.usage_count++;
      entry.metadata.last_updated = new Date().toISOString();
      // Update average performance
      const currentAvg = entry.metadata.average_performance;
      const usageCount = entry.metadata.usage_count;
      entry.metadata.average_performance = (currentAvg * (usageCount - 1) + performance) / usageCount;
      logger.info(`Updated performance for agent ${agentId}: new avg=${entry.metadata.average_performance}`);
    } else {
      logger.warn(`Attempted to update performance for non-existent agent: ${agentId}`);
    }
  }

  public createAgentFromTemplate(
    template: string,
    agentData: AgentCreateInput
  ): BaseAgent | null {
    switch (template) {
      case 'investor_research':
        logger.info('Creating InvestorResearchAgent from template');
        return new InvestorResearchAgent(agentData);
      case 'ai_outreach':
        logger.info('Creating AIOutreachAgent from template');
        return new AIOutreachAgent(agentData);
      default:
        logger.warn(`Unknown agent template: ${template}`);
        return null;
    }
  }

  public getAgentTemplates(): Array<{
    name: string;
    description: string;
    capabilities: string[];
    supported_phases: string[];
    supported_metaboxes: string[];
  }> {
    return [
      {
        name: 'investor_research',
        description: 'AI agent specialized in investor research and analysis',
        capabilities: ['investor_research', 'network_analysis', 'financial_analysis'],
        supported_phases: ['fundraising'],
        supported_metaboxes: ['fundraising']
      },
      {
        name: 'ai_outreach',
        description: 'AI agent specialized in personalized investor outreach',
        capabilities: ['personalized_outreach', 'email_automation', 'follow_up_sequences'],
        supported_phases: ['fundraising', 'sales', 'marketing'],
        supported_metaboxes: ['fundraising', 'sales', 'marketing']
      }
    ];
  }

  public getAgentStats(): {
    total_agents: number;
    active_agents: number;
    agents_by_type: Record<string, number>;
    agents_by_status: Record<string, number>;
    average_performance: number;
  } {
    const agents = this.getAllAgents();
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'active').length;
    
    const agentsByType: Record<string, number> = {};
    const agentsByStatus: Record<string, number> = {};
    
    agents.forEach(agent => {
      agentsByType[agent.agent_type] = (agentsByType[agent.agent_type] || 0) + 1;
      agentsByStatus[agent.status] = (agentsByStatus[agent.status] || 0) + 1;
    });

    const totalPerformance = agents.reduce((sum, agent) => sum + agent.performance_metrics.success_rate, 0);
    const averagePerformance = totalAgents > 0 ? totalPerformance / totalAgents : 0;

    return {
      total_agents: totalAgents,
      active_agents: activeAgents,
      agents_by_type: agentsByType,
      agents_by_status: agentsByStatus,
      average_performance: averagePerformance
    };
  }
} 