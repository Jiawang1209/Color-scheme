import chroma from 'chroma-js';

// Even-spaced sample of n colors across control points, interpolated in Lab.
export function sampleColors(controlPoints: string[], n: number): string[] {
  if (n <= 1) return [controlPoints[0]];
  return chroma.scale(controlPoints).mode('lab').colors(n);
}
