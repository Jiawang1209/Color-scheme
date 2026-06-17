import { Delaunay } from 'd3-delaunay';

export interface Region { path: string; cx: number; cy: number; }

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildRegions(count: number, w: number, h: number): Region[] {
  const rand = mulberry32(20260617); // fixed seed → deterministic map
  const pts: [number, number][] = Array.from({ length: count }, () => [rand() * w, rand() * h]);
  const delaunay = Delaunay.from(pts);
  const voronoi = delaunay.voronoi([0, 0, w, h]);
  const regions: Region[] = [];
  for (let i = 0; i < count; i++) {
    const path = voronoi.renderCell(i);
    if (!path) continue;
    regions.push({ path, cx: pts[i][0], cy: pts[i][1] });
  }
  return regions;
}
