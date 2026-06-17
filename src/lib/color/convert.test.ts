import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex } from './convert';

describe('convert', () => {
  it('hexToRgb parses #rrggbb', () => {
    expect(hexToRgb('#2166ac')).toEqual({ r: 33, g: 102, b: 172 });
  });
  it('rgbToHex round-trips', () => {
    expect(rgbToHex({ r: 33, g: 102, b: 172 })).toBe('#2166ac');
  });
  it('rgbToHex clamps and pads', () => {
    expect(rgbToHex({ r: 0, g: 5, b: 300 })).toBe('#0005ff');
  });
});
