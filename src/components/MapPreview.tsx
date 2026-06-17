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

  // Memoized county paths: keyed on colors/cvd/type/counties/path.
  // Hover state is excluded, so changing hover does NOT rebuild or reconcile these 3142 elements.
  const countryEls = useMemo(() => {
    if (!colors.length) return null;
    return counties.map((f, i) => {
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
          data-hex={hex}
          stroke="#fff"
          strokeWidth={0.15}
        />
      );
    });
  }, [colors, cvd, type, counties, path]);

  // Single delegated handler on the wrapper — reads data-hex from the target element.
  const onMove = (e: React.MouseEvent) => {
    const el = e.target as Element;
    const hex = el instanceof SVGPathElement ? el.getAttribute('data-hex') : null;
    if (hex) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setHover({ hex, x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      setHover(null);
    }
  };

  return (
    <div className="map-wrap" style={{ position: 'relative' }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg data-testid="map" className="map-preview" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {countryEls}
        <path className="map-states" d={statesPath} fill="none" stroke="#fff" strokeWidth={0.6} pointerEvents="none" />
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
