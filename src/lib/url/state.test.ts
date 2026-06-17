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
});
