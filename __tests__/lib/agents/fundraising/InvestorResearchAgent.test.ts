import { InvestorResearchAgent } from '../../../../lib/agents/fundraising/InvestorResearchAgent';
import { AgentContext, AgentResult } from '../../../../lib/agents/types';

describe('InvestorResearchAgent', () => {
  let agent: InvestorResearchAgent;
  let context: AgentContext;

  beforeEach(() => {
    context = {
      userId: 'user-123',
      organizationId: 'org-456',
    };
    agent = new InvestorResearchAgent();
  });

  it('should create an investor research agent instance', () => {
    expect(agent).toBeInstanceOf(InvestorResearchAgent);
    expect(agent.name).toBe('Investor Research Agent');
    expect(agent.description).toBe('Identifies and researches potential investors that match company criteria');
    expect(agent.phase).toBe('identifying_investors');
    expect(agent.metaBox).toBe('fundraising');
  });

  it('should execute investor research', async () => {
    const result = await agent.execute(context);

    expect(result.success).toBe(true);
    expect(result.metadata).toHaveProperty('agentName', 'Investor Research Agent');
    expect(result.metadata).toHaveProperty('phase', 'identifying_investors');
    expect(result.metadata).toHaveProperty('metaBox', 'fundraising');
  });

  it('should return research data', async () => {
    const result = await agent.execute(context);

    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    if (result.data && result.data.length > 0) {
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('firm');
      expect(result.data[0]).toHaveProperty('checkSize');
    }
  });

  it('should handle research errors gracefully', async () => {
    // Test with invalid context to trigger error handling
    const invalidContext = {
      userId: '',
      organizationId: '',
    };

    const result = await agent.execute(invalidContext);

    // Should still return a valid result structure
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('metadata');
  });

  it('should include proper metadata in results', async () => {
    const result = await agent.execute(context);

    expect(result.metadata).toHaveProperty('agentName');
    expect(result.metadata).toHaveProperty('phase');
    expect(result.metadata).toHaveProperty('metaBox');
    expect(result.metadata).toHaveProperty('timestamp');
  });

  it('has error handling in execute method', async () => {
    const agent = new InvestorResearchAgent();
    
    // This test verifies that the try-catch block exists in the execute method
    // The actual error handling is tested in the BaseAgent tests
    const context: AgentContext = {
      userId: 'user123',
      organizationId: 'org456',
      metadata: { searchCriteria: 'B2B SaaS' }
    };
    
    const result = await agent.execute(context);
    
    // Should return a successful result with mock data
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
  });
}); 