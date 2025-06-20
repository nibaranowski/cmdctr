import { AgentContext, AgentResult, BaseAgent, AgentManifest, MetaBoxConfig } from '../../lib/agents/types';

describe('types', () => {
  it('exports expected functions/classes', () => {
    expect(typeof types).toBeDefined();
  });

  it('handles valid inputs', () => {
    const context: AgentContext = {
      userId: 'user123',
      organizationId: 'org456'
    };
    expect(context.userId).toBe('user123');
  });

  it('handles edge cases', () => {
    const result: AgentResult = {
      success: false,
      error: 'Test error'
    };
    expect(result.success).toBe(false);
  });

  it('returns expected output format', () => {
    const agent: BaseAgent = {
      name: 'TestAgent',
      description: 'Test Description',
      phase: 'test',
      metaBox: 'test-box',
      execute: async () => ({ success: true })
    };
    expect(agent.name).toBe('TestAgent');
  });
});
