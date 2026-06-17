import { describe, it, expect } from 'vitest';
import { worldFeatures } from './geo';

describe('worldFeatures', () => {
  it('returns many country features', () => {
    expect(worldFeatures().length).toBeGreaterThan(100);
  });
  it('each feature has a geometry', () => {
    expect(worldFeatures().every((f) => f.geometry != null)).toBe(true);
  });
  it('is memoized (same array reference)', () => {
    expect(worldFeatures()).toBe(worldFeatures());
  });
});
