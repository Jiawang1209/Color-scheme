import { describe, it, expect } from 'vitest';
import { classIndex } from './field';

describe('classIndex', () => {
  it('returns an index in [0, n)', () => {
    for (let i = 0; i < 20; i++) {
      const idx = classIndex('sequential', i * 30, 100, 600, 400, 5);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(5);
    }
  });
  it('is deterministic for the same inputs', () => {
    expect(classIndex('diverging', 300, 200, 600, 400, 7))
      .toBe(classIndex('diverging', 300, 200, 600, 400, 7));
  });
  it('qualitative spreads across categories', () => {
    const seen = new Set<number>();
    for (let x = 0; x < 600; x += 25) for (let y = 0; y < 400; y += 25) seen.add(classIndex('qualitative', x, y, 600, 400, 4));
    expect(seen.size).toBeGreaterThan(1);
  });
});
