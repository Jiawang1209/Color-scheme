import { describe, it, expect } from 'vitest';
import { colorDistance, nearestPaletteColor } from './nearest';

describe('nearest', () => {
  it('distance of identical colors is 0', () => {
    expect(colorDistance('#2166ac', '#2166ac')).toBe(0);
  });
  it('distance is positive for different colors', () => {
    expect(colorDistance('#000000', '#ffffff')).toBeGreaterThan(0);
  });
  it('nearestPaletteColor returns a hex from some palette + its source', () => {
    const r = nearestPaletteColor('#2ca25f');
    expect(r.hex).toMatch(/^#[0-9a-f]{6}$/i);
    expect(typeof r.paletteId).toBe('string');
  });
  it('an exact palette color maps to itself (distance ~0)', () => {
    const r = nearestPaletteColor('#e5f5f9'); // BuGn[3][0]
    expect(r.distance).toBeLessThan(1);
  });
});
