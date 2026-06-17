import type { PaletteType, Collection } from '../data/types';
import type { CvdMode } from '../lib/color/cvd';
import type { ExportFormat } from '../lib/export';

export interface AppState {
  type: PaletteType;
  collections: Collection[];
  paletteId: string;
  n: number;
  cvd: CvdMode;
  exportFormat: ExportFormat;
}

export const DEFAULT_STATE: AppState = {
  type: 'sequential',
  collections: ['colorbrewer', 'viridis', 'crameri', 'journal'],
  paletteId: 'BuGn',
  n: 5,
  cvd: 'normal',
  exportFormat: 'matplotlib',
};
