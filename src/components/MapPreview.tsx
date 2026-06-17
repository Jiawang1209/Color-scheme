import { useMemo, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { usCounties, usStatesMesh } from '../lib/map/geo';
import { classIndex } from '../lib/map/field';
import { simulateCvd } from '../lib/color/cvd';
import type { CvdMode } from '../lib/color/cvd';
import type { PaletteType } from '../data/types';

const W = 640;
const H = 400;

export function MapPreview({ colors, cvd, type }: { colors: string[]; cvd: CvdMode; type: PaletteType }) {
  const counties = usCounties();
  const statesMesh = usStatesMesh();
  const [hover, setHover] = useState<{ hex: string; x: number; y: number } | null>(null);

  const { path, statesPath } = useMemo(() => {
    const projection = geoAlbersUsa().fitSize([W, H], { type: 'FeatureCollection', features: counties } as never);
    const p = geoPath(projection);
    return { path: p, statesPath: p(statesMesh as never) ?? '' };
  }, [counties, statesMesh]);

  return (
    <div className="map-wrap" style={{ position: 'relative' }} onMouseLeave={() => setHover(null)}>
      <svg data-testid="map" className="map-preview" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {colors.length > 0 &&
          counties.map((f, i) => {
            const d = path(f as never);
            if (!d) return null;
            const c = path.centroid(f as never);
            if (!c || Number.isNaN(c[0])) return null; // AlbersUsa returns NaN for points outside the US clip
            const idx = classIndex(type, c[0], c[1], W, H, colors.length);
            const hex = colors[idx];
            return (
              <path
                key={i}
                className="map-country"
                d={d}
                fill={simulateCvd(hex, cvd)}
                stroke="#ffffff"
                strokeWidth={0.15}
                onMouseMove={(e) => setHover({ hex, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
              />
            );
          })}
        <path className="map-states" d={statesPath} fill="none" stroke="#ffffff" strokeWidth={0.6} />
      </svg>
      {hover && (
        <div className="map-tooltip" style={{ left: hover.x + 12, top: hover.y + 12 }}>
          <span className="map-tooltip-chip" style={{ background: hover.hex }} />
          <span className="map-tooltip-hex">{hover.hex}</span>
        </div>
      )}
    </div>
  );
}
