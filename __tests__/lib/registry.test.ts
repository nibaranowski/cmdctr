import { getMetaBox, getAgent, getPhaseAgents, getAllMetaBoxes, validateMetaBox } from '../../lib/agents/registry';

describe('registry', () => {
  it('exports expected functions/classes', () => {
    expect(typeof getMetaBox).toBeDefined();
    expect(typeof getAgent).toBeDefined();
    expect(typeof getPhaseAgents).toBeDefined();
    expect(typeof getAllMetaBoxes).toBeDefined();
    expect(typeof validateMetaBox).toBeDefined();
  });

  it('handles valid inputs', () => {
    const metaBox = getMetaBox('fundraising');
    expect(metaBox).toBeDefined();
  });

  it('handles edge cases', () => {
    const metaBox = getMetaBox('nonexistent');
    expect(metaBox).toBeUndefined();
  });

  it('returns expected output format', () => {
    const allMetaBoxes = getAllMetaBoxes();
    expect(Array.isArray(allMetaBoxes)).toBe(true);
  });
});
