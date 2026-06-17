import { describe, it, expect } from 'vitest';
import { medianCut } from './extract';
import type { Rgb } from './convert';

const px = (r: number, g: number, b: number): Rgb => ({ r, g, b });

describe('medianCut', () => {
  it('returns exactly n colors', () => {
    const pixels = [px(255,0,0), px(250,5,5), px(0,255,0), px(5,250,5), px(0,0,255), px(5,5,250)];
    expect(medianCut(pixels, 3)).toHaveLength(3);
  });
  it('a single-color image yields that color', () => {
    const pixels = Array.from({ length: 10 }, () => px(33, 102, 172));
    const out = medianCut(pixels, 3);
    expect(out[0].toLowerCase()).toBe('#2166ac');
  });
  it('outputs valid hex', () => {
    const pixels = [px(10,20,30), px(200,100,50), px(123,222,99)];
    for (const c of medianCut(pixels, 2)) expect(c).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('empty input yields empty output', () => {
    expect(medianCut([], 5)).toEqual([]);
  });
});
