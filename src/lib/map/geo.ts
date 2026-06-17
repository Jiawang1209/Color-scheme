import { feature, mesh } from 'topojson-client';
import us from 'us-atlas/counties-10m.json';
import type { Feature, Geometry, MultiLineString } from 'geojson';

let countiesCache: Feature<Geometry>[] | null = null;
let statesMeshCache: MultiLineString | null = null;

export function usCounties(): Feature<Geometry>[] {
  if (countiesCache) return countiesCache;
  const fc = feature(us as never, (us as never as { objects: { counties: never } }).objects.counties) as unknown as {
    features: Feature<Geometry>[];
  };
  countiesCache = fc.features;
  return countiesCache;
}

export function usStatesMesh(): MultiLineString {
  if (statesMeshCache) return statesMeshCache;
  const m = mesh(us as never, (us as never as { objects: { states: never } }).objects.states, (a: unknown, b: unknown) => a !== b) as unknown as MultiLineString;
  statesMeshCache = m;
  return statesMeshCache;
}
