import type { Palette } from '../data/types';
import type { CvdMode } from '../lib/color/cvd';
import { getColors } from '../data/index';
import { SwatchStrip } from './SwatchStrip';

interface PaletteListProps {
  palettes: Palette[];
  selectedId: string;
  n: number;
  cvd: CvdMode;
  onSelect: (id: string) => void;
}

export function PaletteList({ palettes, selectedId, n, cvd, onSelect }: PaletteListProps) {
  return (
    <div className="palette-list">
      {palettes.map((p) => (
        <button
          key={p.id}
          className={'palette-row' + (p.id === selectedId ? ' active' : '')}
          onClick={() => onSelect(p.id)}
        >
          <span className="palette-name">{p.name}</span>
          <SwatchStrip colors={getColors(p.id, n)} cvd={cvd} />
        </button>
      ))}
    </div>
  );
}
