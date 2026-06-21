import { DEFAULT_STATE } from '../../state/types';
import type { AppState } from '../../state/types';
import type { PaletteType, Collection } from '../../data/types';
import type { CvdMode } from '../color/cvd';
import type { ExportFormat } from '../export';

const TYPES: readonly PaletteType[] = ['sequential', 'diverging', 'qualitative'];
const COLLECTIONS: readonly Collection[] = ['colorbrewer', 'viridis', 'crameri', 'journal'];
const CVDS: readonly CvdMode[] = ['normal', 'protan', 'deutan', 'tritan'];
const FORMATS: readonly ExportFormat[] = [
  'hex', 'rgb', 'matplotlib', 'ggplot', 'plotly', 'r', 'css', 'd3', 'tailwind', 'matlab',
];

function oneOf<T extends string>(allowed: readonly T[], v: string | null, fallback: T): T {
  return allowed.includes(v as T) ? (v as T) : fallback;
}

export function encodeState(s: AppState): string {
  const p = new URLSearchParams();
  p.set('type', s.type);
  p.set('cols', s.collections.join(','));
  p.set('id', s.paletteId);
  p.set('n', String(s.n));
  p.set('cvd', s.cvd);
  p.set('fmt', s.exportFormat);
  return p.toString();
}

export function decodeState(query: string): AppState {
  const p = new URLSearchParams(query);
  const s: AppState = { ...DEFAULT_STATE, collections: [...DEFAULT_STATE.collections] };
  if (p.get('type')) s.type = oneOf(TYPES, p.get('type'), DEFAULT_STATE.type);
  if (p.get('cols')) {
    const cols = p.get('cols')!.split(',').filter((c): c is Collection =>
      COLLECTIONS.includes(c as Collection)
    );
    if (cols.length) s.collections = cols;
  }
  if (p.get('id')) s.paletteId = p.get('id')!;
  if (p.get('n')) {
    const n = Number(p.get('n'));
    if (Number.isInteger(n) && n >= 1 && n <= 99) s.n = n;
  }
  if (p.get('cvd')) s.cvd = oneOf(CVDS, p.get('cvd'), DEFAULT_STATE.cvd);
  if (p.get('fmt')) s.exportFormat = oneOf(FORMATS, p.get('fmt'), DEFAULT_STATE.exportFormat);
  return s;
}
