import { describe, it, expect } from 'vitest';
import { rgbToHsl, hexToHsl } from './hsl';

describe('hsl', () => {
  it('pure red → hsl(0,100,50)', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });
  it('white → l=100, s=0', () => {
    const { s, l } = rgbToHsl({ r: 255, g: 255, b: 255 });
    expect([s, l]).toEqual([0, 100]);
  });
  it('hexToHsl parses #0000ff → h≈240', () => {
    expect(hexToHsl('#0000ff').h).toBe(240);
  });
});
