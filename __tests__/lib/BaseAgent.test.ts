import { BaseAgent } from '../../lib/agents/BaseAgent';

describe('BaseAgent', () => {
  it('should be properly imported', () => {
    expect(BaseAgent).toBeDefined();
  });

  it('should have expected structure', () => {
    expect(typeof BaseAgent).toBe('function');
  });

  it('should handle basic operations', () => {
    // Test that BaseAgent is a class that can be extended
    class TestAgent extends BaseAgent {
      async execute(context: any) {
        return this.createResult({ test: 'data' });
      }
    }
    
    const agent = new TestAgent('TestAgent', 'Test Description', 'test', 'test-box');
    expect(agent.name).toBe('TestAgent');
    expect(agent.description).toBe('Test Description');
  });
});
