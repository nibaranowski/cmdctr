import { AgentOrchestrator } from '../../../lib/agents/orchestrator';
import { AgentContext, AgentResult, MetaBoxConfig, AgentManifest } from '../../../lib/agents/types';
import * as registry from '../../../lib/agents/registry';
import { AgentRegistry } from '../../../lib/agents/registry';

// Mock the registry module
jest.mock('../../../lib/agents/registry');
const mockRegistry = registry as jest.Mocked<typeof registry>;

// Mock the AgentRegistry class
jest.mock('../../../lib/agents/registry', () => ({
  ...jest.requireActual('../../../lib/agents/registry'),
  AgentRegistry: {
    getInstance: jest.fn()
  },
  getMetaBox: jest.fn(),
  getPhaseAgents: jest.fn()
}));

// Mock dynamic imports
jest.mock('../../../lib/agents/fundraising/InvestorResearchAgent', () => ({
  InvestorResearchAgent: class MockAgent {
    async execute(context: AgentContext): Promise<AgentResult> {
      return {
        success: true,
        data: { message: 'Mock agent executed' },
        metadata: {
          agentName: 'InvestorResearchAgent',
          phase: 'research',
          metaBox: 'fundraising',
          timestamp: new Date().toISOString(),
        }
      };
    }
  }
}));

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;
  let mockContext: AgentContext;
  let mockMetaBox: MetaBoxConfig;
  let mockAgentRegistryInstance: any;

  beforeEach(() => {
    mockContext = {
      userId: 'test-user',
      organizationId: 'test-org',
      metadata: { test: 'data' }
    };

    mockMetaBox = {
      id: 'fundraising',
      name: 'Fundraising',
      description: 'Fundraising workflow',
      phases: ['research', 'outreach', 'negotiation'],
      agents: []
    };

    // Create mock agent registry instance
    mockAgentRegistryInstance = {
      findAgentsByFilter: jest.fn().mockReturnValue([]),
      getAgent: jest.fn(),
      updateAgentPerformance: jest.fn()
    };

    // Mock the singleton getInstance method
    (AgentRegistry.getInstance as jest.Mock).mockReturnValue(mockAgentRegistryInstance);

    // Get the orchestrator instance
    orchestrator = AgentOrchestrator.getInstance();

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('executePhase', () => {
    it('should execute a phase successfully', async () => {
      const mockAgents: AgentManifest[] = [
        {
          id: 'investor_research',
          name: 'Investor Research Agent',
          description: 'Research potential investors',
          phase: 'research',
          metaBox: 'fundraising'
        }
      ];

      // Create a mock agent instance
      const mockAgentInstance = {
        name: 'Investor Research Agent',
        execute: jest.fn().mockResolvedValue({
          success: true,
          data: { message: 'Mock agent executed' },
          metadata: {
            agentName: 'InvestorResearchAgent',
            phase: 'research',
            metaBox: 'fundraising',
            timestamp: new Date().toISOString(),
          }
        })
      };

      mockRegistry.getMetaBox.mockReturnValue(mockMetaBox);
      mockRegistry.getPhaseAgents.mockReturnValue(mockAgents);
      mockAgentRegistryInstance.findAgentsByFilter.mockReturnValue([mockAgentInstance]);

      const results = await orchestrator.executePhase('fundraising', 'research');

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(mockRegistry.getMetaBox).toHaveBeenCalledWith('fundraising');
      expect(mockRegistry.getPhaseAgents).toHaveBeenCalledWith('fundraising', 'research');
    });

    it('should throw error when meta box not found', async () => {
      mockRegistry.getMetaBox.mockReturnValue(undefined);

      await expect(orchestrator.executePhase('non-existent', 'research'))
        .rejects.toThrow('Meta box non-existent not found');
    });

    it('should throw error when no agents found for phase', async () => {
      mockRegistry.getMetaBox.mockReturnValue(mockMetaBox);
      mockRegistry.getPhaseAgents.mockReturnValue([]);

      await expect(orchestrator.executePhase('fundraising', 'non-existent'))
        .rejects.toThrow('No agents found for phase non-existent in meta box fundraising');
    });

    it('should handle agent execution errors gracefully', async () => {
      const mockAgents: AgentManifest[] = [
        {
          id: 'failing_agent',
          name: 'Failing Agent',
          description: 'An agent that fails',
          phase: 'research',
          metaBox: 'fundraising'
        }
      ];

      mockRegistry.getMetaBox.mockReturnValue(mockMetaBox);
      mockRegistry.getPhaseAgents.mockReturnValue(mockAgents);

      const results = await orchestrator.executePhase('fundraising', 'research');

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Agent instance not found for Failing Agent');
      expect(results[0].metadata).toBeDefined();
      if (results[0].metadata) {
        expect(results[0].metadata.agent_id).toBe('failing_agent');
        expect(results[0].metadata.agent_name).toBe('Failing Agent');
        expect(results[0].metadata.phase_id).toBe('research');
        expect(results[0].metadata.metabox_id).toBe('fundraising');
      }
    });

    it('throws error when no agents found for phase', async () => {
      // Mock getMetaBox to return a valid meta box
      (mockRegistry.getMetaBox as jest.Mock).mockReturnValue({
        id: 'test-meta-box',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: ['phase1'],
        agents: []
      });
      
      // Mock getPhaseAgents to return empty array
      (mockRegistry.getPhaseAgents as jest.Mock).mockReturnValue([]);
      
      await expect(orchestrator.executePhase('test-meta-box', 'phase1'))
        .rejects.toThrow('No agents found for phase phase1 in meta box test-meta-box');
    });

    it('handles agent implementation not found error', async () => {
      // Mock getMetaBox to return a valid meta box
      (mockRegistry.getMetaBox as jest.Mock).mockReturnValue({
        id: 'test-meta-box',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: ['phase1'],
        agents: []
      });
      
      // Mock getPhaseAgents to return an agent config
      (mockRegistry.getPhaseAgents as jest.Mock).mockReturnValue([
        {
          id: 'test-agent',
          name: 'Test Agent',
          description: 'Test agent',
          phase: 'phase1',
          metaBox: 'test-meta-box'
        }
      ]);
      
      // Mock findAgentsByFilter to return empty array (no agent instance found)
      mockAgentRegistryInstance.findAgentsByFilter.mockReturnValue([]);
      
      const results = await orchestrator.executePhase('test-meta-box', 'phase1');
      
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Agent instance not found for Test Agent');
    });

    it('handles agent execution errors gracefully', async () => {
      // Mock getMetaBox to return a valid meta box
      (mockRegistry.getMetaBox as jest.Mock).mockReturnValue({
        id: 'test-meta-box',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: ['phase1'],
        agents: []
      });
      
      // Mock getPhaseAgents to return an agent config
      (mockRegistry.getPhaseAgents as jest.Mock).mockReturnValue([
        {
          id: 'test-agent',
          name: 'Test Agent',
          description: 'Test agent',
          phase: 'phase1',
          metaBox: 'test-meta-box'
        }
      ]);
      
      // Mock findAgentsByFilter to return empty array (no agent instance found)
      mockAgentRegistryInstance.findAgentsByFilter.mockReturnValue([]);
      
      const results = await orchestrator.executePhase('test-meta-box', 'phase1');
      
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Agent instance not found for Test Agent');
    });
  });

  describe('executeWorkflow', () => {
    it('should execute entire workflow successfully', async () => {
      const mockAgents: AgentManifest[] = [
        {
          id: 'investor_research',
          name: 'Investor Research Agent',
          description: 'Research potential investors',
          phase: 'research',
          metaBox: 'fundraising'
        }
      ];

      mockRegistry.getMetaBox.mockReturnValue({
        ...mockMetaBox,
        phases: [
          { id: 'research', name: 'Research Phase' },
          { id: 'outreach', name: 'Outreach Phase' },
          { id: 'negotiation', name: 'Negotiation Phase' }
        ]
      });
      mockRegistry.getPhaseAgents.mockReturnValue(mockAgents);

      const results = await orchestrator.executeWorkflow('fundraising');

      expect(results).toHaveProperty('research');
      expect(results).toHaveProperty('outreach');
      expect(results).toHaveProperty('negotiation');
      expect(results.research).toHaveLength(1);
    });

    it('should throw error when meta box not found in workflow', async () => {
      mockRegistry.getMetaBox.mockReturnValue(undefined);

      await expect(orchestrator.executeWorkflow('non-existent'))
        .rejects.toThrow('Meta box non-existent not found');
    });
  });

  describe('executeParallelPhases', () => {
    it('should execute phases in parallel', async () => {
      const mockAgents: AgentManifest[] = [
        {
          id: 'investor_research',
          name: 'Investor Research Agent',
          description: 'Research potential investors',
          phase: 'research',
          metaBox: 'fundraising'
        }
      ];

      mockRegistry.getMetaBox.mockReturnValue(mockMetaBox);
      mockRegistry.getPhaseAgents.mockReturnValue(mockAgents);

      const phases = ['research', 'outreach'];
      const results = await orchestrator.executeParallelPhases('fundraising', phases);

      expect(results).toHaveProperty('research');
      expect(results).toHaveProperty('outreach');
      expect(results.research).toHaveLength(1);
      expect(results.outreach).toHaveLength(1);
    });

    it('should handle empty phases array', async () => {
      const results = await orchestrator.executeParallelPhases('fundraising', []);

      expect(results).toEqual({});
    });

    it('should handle single phase', async () => {
      const mockAgents: AgentManifest[] = [
        {
          id: 'investor_research',
          name: 'Investor Research Agent',
          description: 'Research potential investors',
          phase: 'research',
          metaBox: 'fundraising'
        }
      ];

      mockRegistry.getMetaBox.mockReturnValue(mockMetaBox);
      mockRegistry.getPhaseAgents.mockReturnValue(mockAgents);

      const results = await orchestrator.executeParallelPhases('fundraising', ['research']);

      expect(results).toHaveProperty('research');
      expect(results.research).toHaveLength(1);
    });
  });

  describe('constructor', () => {
    it('should create orchestrator with context', () => {
      expect(orchestrator).toBeInstanceOf(AgentOrchestrator);
    });
  });
}); 