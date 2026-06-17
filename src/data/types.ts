export type PaletteType = 'sequential' | 'diverging' | 'qualitative';
export type Collection = 'colorbrewer' | 'viridis' | 'crameri' | 'journal';

export interface PaletteMeta {
  colorblindSafe: boolean | 'partial';
  printFriendly: boolean;
  photocopySafe: boolean;
}

export interface Palette {
  id: string;
  name: string;
  collection: Collection;
  type: PaletteType;
  discrete?: Record<number, string[]>;
  controlPoints?: string[];
  meta: PaletteMeta;
}
