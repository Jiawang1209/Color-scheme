import type { Rgb } from './convert';
import { rgbToHex } from './convert';

function channelRanges(px: Rgb[]) {
  const lo = { r: 255, g: 255, b: 255 }, hi = { r: 0, g: 0, b: 0 };
  for (const p of px) {
    lo.r = Math.min(lo.r, p.r); hi.r = Math.max(hi.r, p.r);
    lo.g = Math.min(lo.g, p.g); hi.g = Math.max(hi.g, p.g);
    lo.b = Math.min(lo.b, p.b); hi.b = Math.max(hi.b, p.b);
  }
  return { r: hi.r - lo.r, g: hi.g - lo.g, b: hi.b - lo.b };
}

function average(px: Rgb[]): Rgb {
  const s = px.reduce((a, p) => ({ r: a.r + p.r, g: a.g + p.g, b: a.b + p.b }), { r: 0, g: 0, b: 0 });
  return { r: s.r / px.length, g: s.g / px.length, b: s.b / px.length };
}

export function medianCut(pixels: Rgb[], n: number): string[] {
  if (pixels.length === 0) return [];
  const buckets: Rgb[][] = [pixels];
  while (buckets.length < n) {
    let bi = -1, bestRange = -1, bestChan: 'r' | 'g' | 'b' = 'r';
    buckets.forEach((b, i) => {
      if (b.length < 2) return;
      const rng = channelRanges(b);
      (['r', 'g', 'b'] as const).forEach((ch) => {
        if (rng[ch] > bestRange) { bestRange = rng[ch]; bi = i; bestChan = ch; }
      });
    });
    if (bi === -1) break;
    const b = buckets[bi].slice().sort((p, q) => p[bestChan] - q[bestChan]);
    const mid = Math.floor(b.length / 2);
    buckets.splice(bi, 1, b.slice(0, mid), b.slice(mid));
  }
  return buckets.map((b) => rgbToHex(average(b)));
}
