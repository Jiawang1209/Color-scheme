import type { Palette } from './types';
import { sampleColors } from '../lib/color/sample';
import colorbrewer from './colorbrewer.json';
import viridis from './viridis.json';
import crameri from './crameri.json';
import journal from './journal.json';

export const palettes: Palette[] = [
  ...(colorbrewer as Palette[]),
  ...(viridis as Palette[]),
  ...(crameri as Palette[]),
  ...(journal as Palette[]),
];

export function getColors(id: string, n: number): string[] {
  const p = palettes.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown palette: ${id}`);
  if (p.discrete) {
    const exact = p.discrete[n];
    if (exact) return exact;
    const keys = Object.keys(p.discrete).map(Number).sort((a, b) => a - b);
    const nearest = keys.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
    return p.discrete[nearest].slice(0, n);
  }
  if (p.controlPoints) return sampleColors(p.controlPoints, n);
  throw new Error(`Palette ${id} has no colors`);
}
