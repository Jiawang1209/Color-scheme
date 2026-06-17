import { describe, it, expect } from 'vitest';
import { simulateCvd, CvdMode } from './cvd';

describe('simulateCvd', () => {
  it('normal mode returns input unchanged', () => {
    expect(simulateCvd('#2166ac', 'normal')).toBe('#2166ac');
  });
  it('returns a valid hex for each mode', () => {
    for (const m of ['protan', 'deutan', 'tritan'] as CvdMode[]) {
      expect(simulateCvd('#2166ac', m)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
  it('grey stays approximately grey under deutan', () => {
    expect(simulateCvd('#808080', 'deutan')).toMatch(/^#7f7f|#8080/);
  });
});
