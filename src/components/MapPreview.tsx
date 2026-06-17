import { useMemo } from 'react';
import { buildRegions } from '../lib/map/regions';
import { classIndex } from '../lib/map/field';
import { simulateCvd } from '../lib/color/cvd';
import type { CvdMode } from '../lib/color/cvd';
import type { PaletteType } from '../data/types';

const W = 620;
const H = 380;
const COUNT = 48;

export function MapPreview({ colors, cvd, type }: { colors: string[]; cvd: CvdMode; type: PaletteType }) {
  const regions = useMemo(() => buildRegions(COUNT, W, H), []);
  return (
    <svg data-testid="map" className="map-preview" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {colors.length > 0 &&
        regions.map((r, i) => {
          const idx = classIndex(type, r.cx, r.cy, W, H, colors.length);
          return (
            <path key={i} d={r.path} fill={simulateCvd(colors[idx], cvd)} stroke="#ffffff" strokeWidth={0.75} />
          );
        })}
    </svg>
  );
}
