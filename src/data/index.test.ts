import { describe, it, expect } from 'vitest';
import { palettes, getColors } from './index';

describe('palette registry', () => {
  it('loads palettes from all four collections', () => {
    const cols = new Set(palettes.map((p) => p.collection));
    expect(cols).toEqual(new Set(['colorbrewer', 'viridis', 'crameri', 'journal']));
  });
  it('getColors returns n colors for a discrete palette', () => {
    expect(getColors('BuGn', 3)).toHaveLength(3);
  });
  it('getColors samples a continuous palette to n', () => {
    expect(getColors('viridis', 7)).toHaveLength(7);
  });
  it('getColors falls back to nearest discrete set when exact n is absent', () => {
    expect(getColors('BuGn', 2)).toHaveLength(2);
  });
  it('throws on unknown id', () => {
    expect(() => getColors('nope', 3)).toThrow();
  });
});
