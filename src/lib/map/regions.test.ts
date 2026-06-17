import { describe, it, expect } from 'vitest';
import { buildRegions } from './regions';

describe('buildRegions', () => {
  it('produces the requested region count, deterministically', () => {
    const a = buildRegions(40, 600, 400);
    const b = buildRegions(40, 600, 400);
    expect(a).toHaveLength(40);
    expect(a.map((r) => r.path)).toEqual(b.map((r) => r.path));
  });
  it('each region has an SVG path and an in-bounds centroid', () => {
    const [r] = buildRegions(40, 600, 400);
    expect(r.path.startsWith('M')).toBe(true);
    expect(r.cx).toBeGreaterThanOrEqual(0);
    expect(r.cx).toBeLessThanOrEqual(600);
  });
});
