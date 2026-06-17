export interface Rgb { r: number; g: number; b: number; }

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

export function rgbToHex({ r, g, b }: Rgb): string {
  const c = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
