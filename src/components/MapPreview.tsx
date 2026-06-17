import { useMemo } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import type { Feature, Geometry } from 'geojson';
import { worldFeatures } from '../lib/map/geo';
import { classIndex } from '../lib/map/field';
import { simulateCvd } from '../lib/color/cvd';
import type { CvdMode } from '../lib/color/cvd';
import type { PaletteType } from '../data/types';

const W = 640;
const H = 360;

export function MapPreview({ colors, cvd, type }: { colors: string[]; cvd: CvdMode; type: PaletteType }) {
  const features = worldFeatures();
  const { path, sphere, graticule } = useMemo(() => {
    const projection = geoNaturalEarth1().fitSize([W, H], { type: 'FeatureCollection', features: features as Feature<Geometry>[] });
    const p = geoPath(projection);
    return {
      path: p,
      sphere: p({ type: 'Sphere' }) ?? '',
      graticule: p(geoGraticule10()) ?? '',
    };
  }, [features]);

  return (
    <svg data-testid="map" className="map-preview" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <path className="map-sphere" d={sphere} fill="#f0f3f6" />
      <path className="map-graticule" d={graticule} fill="none" stroke="#dfe4ea" strokeWidth={0.3} />
      {colors.length > 0 &&
        features.map((f, i) => {
          const d = path(f);
          if (!d) return null;
          const [cx, cy] = path.centroid(f);
          const idx = classIndex(type, cx, cy, W, H, colors.length);
          return (
            <path
              key={i}
              className="map-country"
              d={d}
              fill={simulateCvd(colors[idx], cvd)}
              stroke="#ffffff"
              strokeWidth={0.4}
            />
          );
        })}
    </svg>
  );
}
