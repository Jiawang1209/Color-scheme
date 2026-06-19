import { describe, it, expect } from 'vitest';
import { lightness, lightnessProfile, toGrayscale } from './analysis';

describe('analysis', () => {
  it('white ~100, black ~0 on the L* scale', () => {
    expect(lightness('#ffffff')).toBeGreaterThan(99);
    expect(lightness('#000000')).toBeLessThan(1);
  });
  it('lightnessProfile returns one L* per color, ordered', () => {
    const p = lightnessProfile(['#000000', '#777777', '#ffffff']);
    expect(p).toHaveLength(3);
    expect(p[0]).toBeLessThan(p[1]);
    expect(p[1]).toBeLessThan(p[2]);
  });
  it('toGrayscale returns a neutral gray (r≈g≈b)', () => {
    const g = toGrayscale('#2166ac');
    const r = parseInt(g.slice(1, 3), 16), gg = parseInt(g.slice(3, 5), 16), b = parseInt(g.slice(5, 7), 16);
    expect(Math.abs(r - gg)).toBeLessThanOrEqual(2);
    expect(Math.abs(gg - b)).toBeLessThanOrEqual(2);
  });
  it('grayscale preserves lightness ordering (light stays lighter)', () => {
    expect(lightness(toGrayscale('#ffffb2'))).toBeGreaterThan(lightness(toGrayscale('#b10026')));
  });
});
