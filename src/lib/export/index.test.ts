import { describe, it, expect } from 'vitest';
import { exportCode, ExportFormat } from './index';

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
    const fmts: ExportFormat[] = ['hex', 'rgb', 'matplotlib', 'ggplot', 'plotly', 'r'];
    for (const f of fmts) expect(exportCode(f, colors, 'BuGn').length).toBeGreaterThan(0);
  });
});
