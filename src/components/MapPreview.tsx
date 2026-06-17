import { useMemo } from 'react';
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
  const { path, statesPath } = useMemo(() => {
    const projection = geoAlbersUsa().fitSize([W, H], { type: 'FeatureCollection', features: counties } as never);
    const p = geoPath(projection);
    return { path: p, statesPath: p(statesMesh as never) ?? '' };
  }, [counties, statesMesh]);

  return (
    <svg data-testid="map" className="map-preview" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {colors.length > 0 &&
        counties.map((f, i) => {
          const d = path(f as never);
          if (!d) return null;
          const c = path.centroid(f as never);
          if (!c || Number.isNaN(c[0])) return null; // AlbersUsa returns NaN for points outside the US clip
          const idx = classIndex(type, c[0], c[1], W, H, colors.length);
          return <path key={i} className="map-country" d={d} fill={simulateCvd(colors[idx], cvd)} stroke="#ffffff" strokeWidth={0.15} />;
        })}
      <path className="map-states" d={statesPath} fill="none" stroke="#ffffff" strokeWidth={0.6} />
    </svg>
  );
}
