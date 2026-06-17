import { DEFAULT_STATE } from '../../state/types';
import type { AppState } from '../../state/types';
import type { PaletteType, Collection } from '../../data/types';
import type { CvdMode } from '../color/cvd';
import type { ExportFormat } from '../export';

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
  if (p.get('type')) s.type = p.get('type') as PaletteType;
  if (p.get('cols')) s.collections = p.get('cols')!.split(',') as Collection[];
  if (p.get('id')) s.paletteId = p.get('id')!;
  if (p.get('n')) s.n = Number(p.get('n'));
  if (p.get('cvd')) s.cvd = p.get('cvd') as CvdMode;
  if (p.get('fmt')) s.exportFormat = p.get('fmt') as ExportFormat;
  return s;
}
