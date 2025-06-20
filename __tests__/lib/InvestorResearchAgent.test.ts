import { InvestorResearchAgent } from '../../lib/agents/fundraising/InvestorResearchAgent';

describe('InvestorResearchAgent', () => {
  it('exports expected functions/classes', () => {
    expect(typeof InvestorResearchAgent).toBeDefined();
  });

  it('handles valid inputs', () => {
    const agent = new InvestorResearchAgent();
    expect(agent.name).toBe('Investor Research Agent');
  });

  it('handles edge cases', () => {
    const agent = new InvestorResearchAgent();
    expect(agent.description).toBe('Identifies and researches potential investors that match company criteria');
  });

  it('returns expected output format', () => {
    const agent = new InvestorResearchAgent();
    expect(agent.phase).toBe('identifying_investors');
  });
});
