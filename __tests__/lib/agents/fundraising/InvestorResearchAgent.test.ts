import { AgentContext } from '../../../../lib/agents/BaseAgent';
import { InvestorResearchAgent } from '../../../../lib/agents/fundraising/InvestorResearchAgent';
import { Agent } from '../../../../models/Agent';
import { MetaBox } from '../../../../models/MetaBox';
import { Phase } from '../../../../models/Phase';

describe('InvestorResearchAgent', () => {
  let agent: InvestorResearchAgent;
  let mockAgent: Agent;
  let mockContext: AgentContext;
  let mockMetaBox: MetaBox;
  let mockPhase: Phase;

  beforeEach(() => {
    mockMetaBox = {
      id: 'metabox_1',
      name: 'Fundraising MetaBox',
      type: 'fundraising',
      company_id: 'company_1',
      settings: {
        phases: ['phase_1'],
        default_agents: {},
        permissions: {
          can_edit: [],
          can_view: [],
          can_manage: []
        },
        integrations: [],
        notifications: {
          email_notifications: false
        }
      },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockPhase = {
      id: 'phase_1',
      name: 'Target List',
      description: 'Initial investor research phase',
      metabox_id: 'metabox_1',
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockAgent = {
      id: 'agent_1',
      name: 'Investor Research Agent',
      description: 'Identifies and researches potential investors that match company criteria',
      company_id: 'company_1',
      metabox_id: 'metabox_1',
      phase_id: 'phase_1',
      agent_type: 'ai',
      status: 'idle',
      capabilities: ['investor_research', 'network_analysis', 'financial_analysis'],
      skills: [
        {
          name: 'Investor Research',
          level: 'expert',
          description: 'Deep research on investors, their portfolio, and investment thesis'
        }
      ],
      performance_metrics: {
        tasks_completed: 0,
        tasks_failed: 0,
        average_completion_time_hours: 1,
        success_rate: 100,
        last_activity: new Date().toISOString()
      },
      availability: {
        is_available: true,
        max_concurrent_tasks: 1,
        current_task_count: 0
      },
      configuration: {},
      permissions: {
        can_create_tasks: true,
        can_assign_tasks: false,
        can_access_projects: true,
        can_manage_other_agents: false,
        can_access_company_data: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockContext = {
      metabox: mockMetaBox,
      phase: mockPhase,
      coreObjects: [],
      userInput: 'Research Series A investors in B2B SaaS',
      metadata: { 
        company_stage: 'Series A',
        industry: 'B2B SaaS',
        target_amount: '$5M'
      }
    };

    agent = new InvestorResearchAgent(mockAgent, mockContext);
  });

  it('should create an investor research agent instance', () => {
    expect(agent).toBeInstanceOf(InvestorResearchAgent);
    expect(mockAgent.name).toBe('Investor Research Agent');
    expect(mockAgent.description).toBe('Identifies and researches potential investors that match company criteria');
    expect(mockAgent.phase_id).toBe('phase_1');
    expect(mockAgent.metabox_id).toBe('metabox_1');
  });

  it('should execute investor research', async () => {
    const result = await agent.execute();
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('Successfully researched');
    expect(result.coreObjects).toBeDefined();
    expect(result.coreObjects?.length).toBeGreaterThan(0);
    expect(result.nextActions).toBeDefined();
    expect(result.nextActions?.length).toBeGreaterThan(0);
  });

  it('should return research data', async () => {
    const result = await agent.execute();
    
    expect(result.coreObjects).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.research_date).toBeDefined();
    expect(result.metadata?.total_investors_found).toBeGreaterThan(0);
    expect(result.metadata?.metabox_id).toBe(mockMetaBox.id);
    expect(result.metadata?.phase_id).toBe(mockPhase.id);
  });

  it('should handle research errors gracefully', async () => {
    // Create a context that will cause validation to fail
    const invalidContext: AgentContext = {
      metabox: null as any,
      phase: mockPhase,
      coreObjects: [],
      userInput: 'test input',
      metadata: {}
    };
    
    const invalidAgent = new InvestorResearchAgent(mockAgent, invalidContext);
    const result = await invalidAgent.execute();
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid context');
  });

  it('should include proper metadata in results', async () => {
    const result = await agent.execute();
    
    expect(result.metadata).toBeDefined();
    if (result.metadata) {
      expect(result.metadata.research_date).toBeDefined();
      expect(result.metadata.total_investors_found).toBeGreaterThan(0);
      expect(result.metadata.metabox_id).toBe(mockMetaBox.id);
      expect(result.metadata.phase_id).toBe(mockPhase.id);
    }
  });

  it('has error handling in execute method', async () => {
    // Test that the agent can handle errors during execution
    const originalPerformResearch = (agent as any).performResearch;
    
    // Mock performResearch to throw an error
    (agent as any).performResearch = jest.fn().mockRejectedValue(new Error('Research failed'));
    
    const result = await agent.execute();
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Research failed');
    
    // Restore original method
    (agent as any).performResearch = originalPerformResearch;
  });

  it('should create core objects for each investor found', async () => {
    const result = await agent.execute();
    
    expect(result.coreObjects).toBeDefined();
    if (result.coreObjects && result.coreObjects.length > 0) {
      const coreObject = result.coreObjects[0];
      if (coreObject) {
        expect(coreObject.title).toContain('Investor:');
        expect(coreObject.metabox_id).toBe(mockMetaBox.id);
        expect(coreObject.phase_id).toBe(mockPhase.id);
        expect(coreObject.agent_id).toBe(mockAgent.id);
        expect(coreObject.data).toBeDefined();
        expect(coreObject.metadata).toBeDefined();
      }
    }
  });

  it('should provide actionable next steps', async () => {
    const result = await agent.execute();
    
    expect(result.nextActions).toBeDefined();
    if (result.nextActions) {
      expect(result.nextActions.length).toBeGreaterThan(0);
      expect(result.nextActions).toContain('Review investor profiles for fit');
      expect(result.nextActions).toContain('Prioritize outreach list');
    }
  });
}); 