import { describe, it, expect } from 'vitest';
import { encodeState, decodeState } from './state';
import { DEFAULT_STATE } from '../../state/types';

describe('url state', () => {
  it('round-trips state through a query string', () => {
    const s = { ...DEFAULT_STATE, paletteId: 'viridis', n: 7, cvd: 'deutan' as const };
    expect(decodeState(encodeState(s))).toEqual(s);
  });
  it('falls back to defaults on empty query', () => {
    expect(decodeState('')).toEqual(DEFAULT_STATE);
  });
  it('ignores unknown keys', () => {
    expect(decodeState('foo=bar').paletteId).toBe(DEFAULT_STATE.paletteId);
  });

  it('falls back to default n when n is not a valid number', () => {
    expect(decodeState('n=abc').n).toBe(DEFAULT_STATE.n);
  });
  it('rejects out-of-range and non-integer n', () => {
    expect(decodeState('n=0').n).toBe(DEFAULT_STATE.n);
    expect(decodeState('n=-3').n).toBe(DEFAULT_STATE.n);
    expect(decodeState('n=5.5').n).toBe(DEFAULT_STATE.n);
  });
  it('falls back to default type/cvd/fmt on invalid values', () => {
    expect(decodeState('type=garbage').type).toBe(DEFAULT_STATE.type);
    expect(decodeState('cvd=xxx').cvd).toBe(DEFAULT_STATE.cvd);
    expect(decodeState('fmt=bogus').exportFormat).toBe(DEFAULT_STATE.exportFormat);
  });
  it('keeps only valid collections, falling back when none are valid', () => {
    expect(decodeState('cols=viridis,bogus').collections).toEqual(['viridis']);
    expect(decodeState('cols=foo,bar').collections).toEqual(DEFAULT_STATE.collections);
  });
});
