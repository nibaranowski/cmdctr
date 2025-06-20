import { PhaseSchema } from '../../models/Phase';

describe('Phase Model', () => {
  const validPhase = {
    id: 'phase-1',
    name: 'Development',
    order: 1,
    metabox_id: 'metabox-1',
    agent_id: 'agent-1',
    description: 'Development phase',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  };

  it('validates a correct Phase object', () => {
    expect(PhaseSchema.parse(validPhase)).toEqual(validPhase);
  });

  it('accepts missing optional description', () => {
    const { description, ...rest } = validPhase;
    expect(PhaseSchema.parse(rest)).toEqual({ ...rest });
  });

  it('rejects missing required fields', () => {
    const { id, ...invalidPhase } = validPhase;
    expect(() => PhaseSchema.parse(invalidPhase)).toThrow();
  });

  it('rejects invalid order (negative)', () => {
    const invalidPhase = { ...validPhase, order: -1 };
    expect(() => PhaseSchema.parse(invalidPhase)).toThrow();
  });

  it('rejects invalid order (non-integer)', () => {
    const invalidPhase = { ...validPhase, order: 1.5 };
    expect(() => PhaseSchema.parse(invalidPhase)).toThrow();
  });

  it('accepts valid datetime strings', () => {
    const phaseWithDates = {
      ...validPhase,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z'
    };
    const result = PhaseSchema.parse(phaseWithDates);
    expect(result.created_at).toBe('2024-01-01T00:00:00Z');
    expect(result.updated_at).toBe('2024-01-02T00:00:00Z');
  });

  it('rejects invalid datetime strings', () => {
    const invalidPhase = {
      ...validPhase,
      created_at: 'invalid-date',
      updated_at: '2024-01-02T00:00:00Z'
    };
    expect(() => PhaseSchema.parse(invalidPhase)).toThrow();
  });

  it('accepts optional agent_id', () => {
    const { agent_id, ...phaseWithoutAgent } = validPhase;
    expect(PhaseSchema.parse(phaseWithoutAgent)).toEqual(phaseWithoutAgent);
  });
}); 