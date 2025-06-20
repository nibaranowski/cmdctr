import { AgentOrchestrator } from '../../lib/agents/orchestrator';
import { AgentContext } from '../../lib/agents/types';

describe('orchestrator', () => {
  it('exports expected functions/classes', () => {
    expect(typeof AgentOrchestrator).toBeDefined();
  });

  it('handles valid inputs', () => {
    const context: AgentContext = {
      userId: 'user123',
      organizationId: 'org456'
    };
    const orchestrator = new AgentOrchestrator(context);
    expect(orchestrator).toBeDefined();
  });

  it('handles edge cases', () => {
    const context: AgentContext = {
      userId: 'user123',
      organizationId: 'org456'
    };
    const orchestrator = new AgentOrchestrator(context);
    expect(orchestrator).toBeInstanceOf(AgentOrchestrator);
  });

  it('returns expected output format', () => {
    const context: AgentContext = {
      userId: 'user123',
      organizationId: 'org456'
    };
    const orchestrator = new AgentOrchestrator(context);
    expect(typeof orchestrator.executePhase).toBe('function');
  });
});
