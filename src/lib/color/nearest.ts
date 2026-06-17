import chroma from 'chroma-js';
import { palettes, getColors } from '../../data/index';

export function colorDistance(a: string, b: string): number {
  return chroma.deltaE(a, b); // CIE ΔE; 0 when identical
}

export interface NearestColor { hex: string; paletteId: string; distance: number; }

function paletteSwatches(id: string, p: (typeof palettes)[number]): string[] {
  if (p.discrete) {
    // collect every swatch across all available step counts
    const all = new Set<string>();
    for (const key of Object.keys(p.discrete)) {
      for (const c of p.discrete[Number(key)]) all.add(c);
    }
    return Array.from(all);
  }
  return getColors(id, 7);
}

export function nearestPaletteColor(target: string): NearestColor {
  let best: NearestColor = { hex: '#000000', paletteId: '', distance: Infinity };
  for (const p of palettes) {
    for (const c of paletteSwatches(p.id, p)) {
      const d = colorDistance(target, c);
      if (d < best.distance) best = { hex: c, paletteId: p.id, distance: d };
    }
  }
  return best;
}

export interface NearestPalette { paletteId: string; score: number; }

export function nearestPalette(colors: string[], n = 7): NearestPalette {
  let best: NearestPalette = { paletteId: '', score: Infinity };
  for (const p of palettes) {
    const swatches = getColors(p.id, n);
    let total = 0;
    for (const c of colors) {
      let min = Infinity;
      for (const s of swatches) min = Math.min(min, colorDistance(c, s));
      total += min;
    }
    const score = total / colors.length;
    if (score < best.score) best = { paletteId: p.id, score };
  }
  return best;
}
