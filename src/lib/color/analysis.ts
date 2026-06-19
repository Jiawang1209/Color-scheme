import chroma from 'chroma-js';

/** CIELAB L* lightness (0 = black, 100 = white). */
export function lightness(hex: string): number {
  return chroma(hex).lab()[0];
}

/** L* for each color in a ramp — used to chart perceptual uniformity. */
export function lightnessProfile(colors: string[]): number[] {
  return colors.map(lightness);
}

/** Perceptual grayscale: same CIELAB lightness, zero chroma. */
export function toGrayscale(hex: string): string {
  return chroma.lab(lightness(hex), 0, 0).hex();
}
