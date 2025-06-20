import { AgentContext, AgentResult, BaseAgent, AgentManifest, MetaBoxConfig, AgentManifestSchema, MetaBoxSchema } from '../../../lib/agents/types';

describe('Agent Types', () => {
  describe('AgentContext', () => {
    it('should have correct structure', () => {
      const context: AgentContext = {
        userId: 'user123',
        organizationId: 'org456',
        metadata: { sessionId: 'session789' }
      };
      
      expect(context.userId).toBe('user123');
      expect(context.organizationId).toBe('org456');
      expect(context.metadata).toEqual({ sessionId: 'session789' });
    });

    it('should handle optional metadata', () => {
      const context: AgentContext = {
        userId: 'user123',
        organizationId: 'org456'
      };
      
      expect(context.userId).toBe('user123');
      expect(context.organizationId).toBe('org456');
      expect(context.metadata).toBeUndefined();
    });
  });

  describe('AgentResult', () => {
    it('should have correct structure for success result', () => {
      const successResult: AgentResult = {
        success: true,
        data: { message: 'Success' },
        metadata: { timestamp: new Date().toISOString() }
      };
      
      expect(successResult.success).toBe(true);
      expect(successResult.data).toEqual({ message: 'Success' });
      expect(successResult.metadata).toBeDefined();
    });

    it('should have correct structure for error result', () => {
      const errorResult: AgentResult = {
        success: false,
        error: 'Something went wrong',
        metadata: { timestamp: new Date().toISOString() }
      };
      
      expect(errorResult.success).toBe(false);
      expect(errorResult.error).toBe('Something went wrong');
      expect(errorResult.metadata).toBeDefined();
    });

    it('should handle generic types', () => {
      const typedResult: AgentResult<{ id: number; name: string }> = {
        success: true,
        data: { id: 1, name: 'Test' }
      };
      
      expect(typedResult.data?.id).toBe(1);
      expect(typedResult.data?.name).toBe('Test');
    });
  });

  describe('BaseAgent', () => {
    it('should have correct structure', () => {
      const agent: BaseAgent = {
        name: 'test-agent',
        description: 'Test agent description',
        phase: 'test-phase',
        metaBox: 'test-meta-box',
        execute: jest.fn().mockResolvedValue({ success: true })
      };
      
      expect(agent.name).toBe('test-agent');
      expect(agent.description).toBe('Test agent description');
      expect(agent.phase).toBe('test-phase');
      expect(agent.metaBox).toBe('test-meta-box');
      expect(typeof agent.execute).toBe('function');
    });
  });

  describe('AgentManifest', () => {
    it('should have correct structure', () => {
      const manifest: AgentManifest = {
        id: 'agent-123',
        name: 'Test Agent',
        description: 'Test agent description',
        phase: 'test-phase',
        metaBox: 'test-meta-box',
        config: { timeout: 5000 }
      };
      
      expect(manifest.id).toBe('agent-123');
      expect(manifest.name).toBe('Test Agent');
      expect(manifest.description).toBe('Test agent description');
      expect(manifest.phase).toBe('test-phase');
      expect(manifest.metaBox).toBe('test-meta-box');
      expect(manifest.config).toEqual({ timeout: 5000 });
    });

    it('should handle optional config', () => {
      const manifest: AgentManifest = {
        id: 'agent-123',
        name: 'Test Agent',
        description: 'Test agent description',
        phase: 'test-phase',
        metaBox: 'test-meta-box'
      };
      
      expect(manifest.config).toBeUndefined();
    });
  });

  describe('MetaBoxConfig', () => {
    it('should have correct structure', () => {
      const metaBox: MetaBoxConfig = {
        id: 'meta-box-123',
        name: 'Test Meta Box',
        description: 'Test meta box description',
        phases: ['phase1', 'phase2'],
        agents: [
          {
            id: 'agent-1',
            name: 'Agent 1',
            description: 'First agent',
            phase: 'phase1',
            metaBox: 'meta-box-123'
          }
        ]
      };
      
      expect(metaBox.id).toBe('meta-box-123');
      expect(metaBox.name).toBe('Test Meta Box');
      expect(metaBox.description).toBe('Test meta box description');
      expect(metaBox.phases).toEqual(['phase1', 'phase2']);
      expect(metaBox.agents).toHaveLength(1);
    });
  });

  describe('Zod Schemas', () => {
    it('should validate AgentManifestSchema', () => {
      const validManifest = {
        id: 'agent-123',
        name: 'Test Agent',
        description: 'Test description',
        phase: 'test-phase',
        metaBox: 'test-meta-box'
      };
      
      const result = AgentManifestSchema.safeParse(validManifest);
      expect(result.success).toBe(true);
    });

    it('should validate MetaBoxSchema', () => {
      const validMetaBox = {
        id: 'meta-box-123',
        name: 'Test Meta Box',
        description: 'Test description',
        phases: ['phase1'],
        agents: []
      };
      
      const result = MetaBoxSchema.safeParse(validMetaBox);
      expect(result.success).toBe(true);
    });

    it('should reject invalid AgentManifest', () => {
      const invalidManifest = {
        id: 'agent-123',
        // missing required fields
      };
      
      const result = AgentManifestSchema.safeParse(invalidManifest);
      expect(result.success).toBe(false);
    });

    it('should reject invalid MetaBox', () => {
      const invalidMetaBox = {
        id: 'meta-box-123',
        // missing required fields
      };
      
      const result = MetaBoxSchema.safeParse(invalidMetaBox);
      expect(result.success).toBe(false);
    });
  });

  describe('Type compatibility', () => {
    it('should allow AgentResult to be used in arrays', () => {
      const results: AgentResult[] = [
        { success: true, data: { id: 1 } },
        { success: false, error: 'Error occurred' }
      ];
      
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
    });

    it('should allow BaseAgent to be implemented', () => {
      class TestAgent implements BaseAgent {
        name = 'test-agent';
        description = 'Test agent';
        phase = 'test-phase';
        metaBox = 'test-meta-box';
        
        async execute(context: AgentContext): Promise<AgentResult> {
          return { success: true, data: { message: 'Success' } };
        }
      }
      
      const agent = new TestAgent();
      expect(agent.name).toBe('test-agent');
      expect(typeof agent.execute).toBe('function');
    });
  });
}); 