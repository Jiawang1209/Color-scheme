import { describe, it, expect } from 'vitest';
import { sampleColors } from './sample';

const cp = ['#000000', '#ffffff']; // black → white control points

describe('sampleColors', () => {
  it('returns exactly n colors', () => {
    expect(sampleColors(cp, 5)).toHaveLength(5);
  });
  it('includes both endpoints', () => {
    const out = sampleColors(cp, 3);
    expect(out[0].toLowerCase()).toBe('#000000');
    expect(out[2].toLowerCase()).toBe('#ffffff');
  });
  it('n=1 returns the first control point', () => {
    expect(sampleColors(cp, 1)[0].toLowerCase()).toBe('#000000');
  });
});
