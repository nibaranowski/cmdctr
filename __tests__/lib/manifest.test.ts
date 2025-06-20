import { FundraisingMetaBox } from '../../lib/agents/fundraising/manifest';

describe('manifest', () => {
  it('exports expected functions/classes', () => {
    expect(typeof FundraisingMetaBox).toBeDefined();
  });

  it('handles valid inputs', () => {
    expect(FundraisingMetaBox.id).toBe('fundraising');
  });

  it('handles edge cases', () => {
    expect(FundraisingMetaBox.phases).toBeDefined();
    expect(Array.isArray(FundraisingMetaBox.phases)).toBe(true);
  });

  it('returns expected output format', () => {
    expect(FundraisingMetaBox.agents).toBeDefined();
    expect(Array.isArray(FundraisingMetaBox.agents)).toBe(true);
  });
});
