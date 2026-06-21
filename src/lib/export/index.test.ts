import { describe, it, expect } from 'vitest';
import { exportCode } from './index';
import type { ExportFormat } from './index';

const colors = ['#e5f5f9', '#99d8c9', '#2ca25f'];

describe('exportCode', () => {
  it('hex format lists quoted hex codes', () => {
    expect(exportCode('hex', colors, 'BuGn')).toContain('"#e5f5f9"');
  });
  it('matplotlib emits ListedColormap', () => {
    const out = exportCode('matplotlib', colors, 'BuGn');
    expect(out).toContain('ListedColormap');
    expect(out).toContain('#2ca25f');
  });
  it('ggplot emits scale_*_manual', () => {
    expect(exportCode('ggplot', colors, 'BuGn')).toContain('scale_fill_manual');
  });
  it('rgb format emits integer tuples', () => {
    expect(exportCode('rgb', colors, 'BuGn')).toContain('(229, 245, 249)');
  });
  it('every format returns a non-empty string', () => {
    const fmts: ExportFormat[] = ['hex', 'rgb', 'matplotlib', 'ggplot', 'plotly', 'r', 'css', 'd3', 'tailwind', 'matlab'];
    for (const f of fmts) expect(exportCode(f, colors, 'BuGn').length).toBeGreaterThan(0);
  });
  it('css emits custom properties', () => {
    expect(exportCode('css', colors, 'BuGn')).toContain('--BuGn-1: #e5f5f9;');
  });
  it('d3 emits the color array', () => {
    const out = exportCode('d3', colors, 'BuGn');
    expect(out).toContain('#2ca25f');
    expect(out.toLowerCase()).toContain('d3');
  });
  it('tailwind emits shade keys', () => {
    expect(exportCode('tailwind', colors, 'BuGn')).toContain("100:");
  });
  it('matlab emits a normalized matrix', () => {
    const out = exportCode('matlab', colors, 'BuGn');
    expect(out).toContain('BuGn = [');
    expect(out).toContain('];');
  });
  it('falls back to hex output for an unknown format', () => {
    const out = exportCode('bogus' as ExportFormat, colors, 'BuGn');
    expect(out).toContain('"#e5f5f9"');
    expect(out.length).toBeGreaterThan(0);
  });
});
