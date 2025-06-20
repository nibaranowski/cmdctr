import { getMetaBox, getAgent, getPhaseAgents, getAllMetaBoxes, validateMetaBox, MetaBoxRegistry } from '../../../lib/agents/registry';
import { MetaBoxConfig, AgentManifest } from '../../../lib/agents/types';

// Mock the fundraising manifest
jest.mock('../../../lib/agents/fundraising/manifest', () => ({
  FundraisingMetaBox: {
    id: 'fundraising',
    name: 'Fundraising',
    description: 'Fundraising workflow',
    phases: ['research', 'outreach', 'negotiation'],
    agents: [
      {
        id: 'investor_research',
        name: 'Investor Research Agent',
        description: 'Research potential investors',
        phase: 'research',
        metaBox: 'fundraising'
      },
      {
        id: 'investor_outreach',
        name: 'Investor Outreach Agent',
        description: 'Reach out to investors',
        phase: 'outreach',
        metaBox: 'fundraising'
      }
    ]
  }
}));

describe('Agent Registry', () => {
  describe('getMetaBox', () => {
    it('should return meta box when it exists', () => {
      const metaBox = getMetaBox('fundraising');
      expect(metaBox).toBeDefined();
      expect(metaBox?.id).toBe('fundraising');
      expect(metaBox?.name).toBe('Fundraising');
    });

    it('should return undefined when meta box does not exist', () => {
      const metaBox = getMetaBox('non-existent');
      expect(metaBox).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const metaBox = getMetaBox('');
      expect(metaBox).toBeUndefined();
    });
  });

  describe('getAgent', () => {
    it('should return agent when it exists in meta box', () => {
      const agent = getAgent('fundraising', 'investor_research');
      expect(agent).toBeDefined();
      expect(agent?.id).toBe('investor_research');
      expect(agent?.name).toBe('Investor Research Agent');
    });

    it('should return undefined when meta box does not exist', () => {
      const agent = getAgent('non-existent', 'investor_research');
      expect(agent).toBeUndefined();
    });

    it('should return undefined when agent does not exist in meta box', () => {
      const agent = getAgent('fundraising', 'non-existent-agent');
      expect(agent).toBeUndefined();
    });

    it('should return undefined for empty meta box id', () => {
      const agent = getAgent('', 'investor_research');
      expect(agent).toBeUndefined();
    });

    it('should return undefined for empty agent id', () => {
      const agent = getAgent('fundraising', '');
      expect(agent).toBeUndefined();
    });
  });

  describe('getPhaseAgents', () => {
    it('should return agents for a specific phase', () => {
      const agents = getPhaseAgents('fundraising', 'research');
      expect(agents).toHaveLength(1);
      expect(agents[0].id).toBe('investor_research');
      expect(agents[0].phase).toBe('research');
    });

    it('should return empty array when meta box does not exist', () => {
      const agents = getPhaseAgents('non-existent', 'research');
      expect(agents).toEqual([]);
    });

    it('should return empty array when phase does not exist', () => {
      const agents = getPhaseAgents('fundraising', 'non-existent-phase');
      expect(agents).toEqual([]);
    });

    it('should return empty array for empty meta box id', () => {
      const agents = getPhaseAgents('', 'research');
      expect(agents).toEqual([]);
    });

    it('should return empty array for empty phase', () => {
      const agents = getPhaseAgents('fundraising', '');
      expect(agents).toEqual([]);
    });

    // Note: Testing multiple agents for a phase would require complex mocking
    // that conflicts with Jest module system. Skipping for now.
  });

  describe('getAllMetaBoxes', () => {
    it('should return all meta boxes', () => {
      const metaBoxes = getAllMetaBoxes();
      expect(Array.isArray(metaBoxes)).toBe(true);
      expect(metaBoxes.length).toBeGreaterThan(0);
      expect(metaBoxes.some(mb => mb.id === 'fundraising')).toBe(true);
    });

    it('should return meta boxes with correct structure', () => {
      const metaBoxes = getAllMetaBoxes();
      metaBoxes.forEach(metaBox => {
        expect(metaBox).toHaveProperty('id');
        expect(metaBox).toHaveProperty('name');
        expect(metaBox).toHaveProperty('description');
        expect(metaBox).toHaveProperty('phases');
        expect(metaBox).toHaveProperty('agents');
        expect(Array.isArray(metaBox.phases)).toBe(true);
        expect(Array.isArray(metaBox.agents)).toBe(true);
      });
    });
  });

  describe('validateMetaBox', () => {
    it('should return true for valid meta box', () => {
      const validMetaBox: MetaBoxConfig = {
        id: 'test',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: ['phase1', 'phase2'],
        agents: [
          {
            id: 'agent1',
            name: 'Test Agent',
            description: 'Test agent description',
            phase: 'phase1',
            metaBox: 'test'
          }
        ]
      };

      const isValid = validateMetaBox(validMetaBox);
      expect(isValid).toBe(true);
    });

    it('should return true for meta box with empty phases', () => {
      const metaBoxWithEmptyPhases: MetaBoxConfig = {
        id: 'test',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: [],
        agents: []
      };

      const isValid = validateMetaBox(metaBoxWithEmptyPhases);
      expect(isValid).toBe(true);
    });

    it('should return true for meta box with empty agents', () => {
      const metaBoxWithEmptyAgents: MetaBoxConfig = {
        id: 'test',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: ['phase1'],
        agents: []
      };

      const isValid = validateMetaBox(metaBoxWithEmptyAgents);
      expect(isValid).toBe(true);
    });
  });

  describe('MetaBoxRegistry', () => {
    it('should contain fundraising meta box', () => {
      expect(MetaBoxRegistry).toHaveProperty('fundraising');
      expect(MetaBoxRegistry.fundraising.id).toBe('fundraising');
    });

    it('should have correct structure for fundraising meta box', () => {
      const fundraising = MetaBoxRegistry.fundraising;
      expect(fundraising).toHaveProperty('id', 'fundraising');
      expect(fundraising).toHaveProperty('name', 'Fundraising');
      expect(fundraising).toHaveProperty('description', 'Fundraising workflow');
      expect(Array.isArray(fundraising.phases)).toBe(true);
      expect(Array.isArray(fundraising.agents)).toBe(true);
    });

    it('should have agents with correct structure', () => {
      const fundraising = MetaBoxRegistry.fundraising;
      fundraising.agents.forEach(agent => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');
        expect(agent).toHaveProperty('phase');
        expect(agent).toHaveProperty('metaBox');
        expect(agent.metaBox).toBe('fundraising');
      });
    });
  });
}); 