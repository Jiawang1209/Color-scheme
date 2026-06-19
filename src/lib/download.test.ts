import { describe, it, expect } from 'vitest';
import { paletteSvg } from './download';

describe('paletteSvg', () => {
  it('returns an svg with a rect + hex text per color', () => {
    const svg = paletteSvg(['#000000', '#ffffff'], 'Test');
    expect(svg).toContain('<svg');
    expect((svg.match(/<rect/g) || []).length).toBeGreaterThanOrEqual(2);
    expect(svg).toContain('#000000');
    expect(svg).toContain('Test');
  });
  it('empty colors still returns a valid svg root', () => {
    expect(paletteSvg([], 'X')).toContain('<svg');
  });
});
