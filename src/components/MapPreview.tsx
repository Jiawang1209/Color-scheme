import { useRef, useEffect, useMemo, useState } from 'react';
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

  const { path, centroids } = useMemo(() => {
    const projection = geoAlbersUsa().fitSize([W, H], { type: 'FeatureCollection', features: counties } as never);
    const p = geoPath(projection);
    const cents = counties.map((f) => p.centroid(f as never));
    return { path: p, centroids: cents };
  }, [counties, statesMesh]);

  const mainRef = useRef<HTMLCanvasElement>(null);
  const pickRef = useRef<HTMLCanvasElement | null>(null);
  const classRef = useRef<number[]>([]);

  // Build pick canvas once per [counties, path] — independent of colors
  useEffect(() => {
    const pick = document.createElement('canvas');
    pick.width = W;
    pick.height = H;
    const ctx = pick.getContext('2d');
    if (!ctx) { pickRef.current = null; return; }
    ctx.clearRect(0, 0, W, H);
    path.context(ctx);
    counties.forEach((f, i) => {
      const id = i + 1;
      ctx.fillStyle = `rgb(${id & 255},${(id >> 8) & 255},${(id >> 16) & 255})`;
      ctx.beginPath();
      path(f as never);
      ctx.fill();
    });
    path.context(null as never);
    pickRef.current = pick;
  }, [counties, path]);

  // Main draw — on [colors, cvd, type, path]
  useEffect(() => {
    const canvas = mainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // jsdom: no 2d context — guard so tests don't crash
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!colors.length) { classRef.current = []; return; }
    const cls: number[] = [];
    path.context(ctx);
    counties.forEach((f, i) => {
      const c = centroids[i];
      const idx = (!c || Number.isNaN(c[0])) ? 0 : classIndex(type, c[0], c[1], W, H, colors.length);
      cls[i] = idx;
      ctx.fillStyle = simulateCvd(colors[idx], cvd);
      ctx.beginPath();
      path(f as never);
      ctx.fill();
    });
    // state borders
    ctx.beginPath();
    path(statesMesh as never);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.6;
    ctx.stroke();
    path.context(null as never);
    classRef.current = cls;
  }, [colors, cvd, type, path, counties, centroids, statesMesh]);

  const [hover, setHover] = useState<{ hex: string; x: number; y: number } | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const canvas = mainRef.current;
    const pick = pickRef.current;
    if (!canvas || !pick) return;
    const rect = canvas.getBoundingClientRect();
    const px = Math.floor((e.clientX - rect.left) / rect.width * W);
    const py = Math.floor((e.clientY - rect.top) / rect.height * H);
    const pctx = pick.getContext('2d');
    if (!pctx) return;
    const d = pctx.getImageData(px, py, 1, 1).data;
    const id = d[0] + (d[1] << 8) + (d[2] << 16);
    if (id === 0) { setHover(null); return; }
    const i = id - 1;
    const idx = classRef.current[i];
    if (idx == null || !colors[idx]) { setHover(null); return; }
    setHover({ hex: colors[idx], x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="map-wrap" style={{ position: 'relative' }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <canvas
        ref={mainRef}
        data-testid="map"
        className="map-preview"
        style={{ width: '100%', height: 'auto', aspectRatio: `${W} / ${H}`, display: 'block' }}
      />
      {hover && (
        <div className="map-tooltip" style={{ left: hover.x + 12, top: hover.y + 12 }}>
          <span className="map-tooltip-chip" style={{ background: hover.hex }} />
          <span className="map-tooltip-hex">{hover.hex}</span>
        </div>
      )}
    </div>
  );
}
