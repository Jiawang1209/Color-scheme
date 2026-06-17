import type { PaletteType } from '../../data/types';

function field(x: number, y: number, w: number, h: number): number {
  const fx = x / w, fy = y / h;
  return Math.min(1, Math.max(0, 0.5 * fx + 0.5 * (0.5 + 0.5 * Math.sin(fy * Math.PI * 1.5 + fx * 3))));
}

export function classIndex(
  type: PaletteType, x: number, y: number, w: number, h: number, n: number,
): number {
  if (n <= 1) return 0;
  if (type === 'qualitative') {
    const key = (Math.round(x) * 73856093) ^ (Math.round(y) * 19349663);
    return Math.abs(key) % n;
  }
  let f = field(x, y, w, h);
  if (type === 'diverging') f = Math.abs(f - 0.5) * 2;
  return Math.min(n - 1, Math.floor(f * n));
}
