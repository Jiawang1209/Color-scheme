import { describe, it, expect } from 'vitest';
import { usCounties, usStatesMesh } from './geo';

describe('us geo', () => {
  it('returns many county features', () => {
    expect(usCounties().length).toBeGreaterThan(1000);
  });
  it('each county has a geometry', () => {
    expect(usCounties().every((f) => f.geometry != null)).toBe(true);
  });
  it('state mesh is a MultiLineString', () => {
    expect(usStatesMesh().type).toBe('MultiLineString');
  });
  it('counties are memoized', () => {
    expect(usCounties()).toBe(usCounties());
  });
});
