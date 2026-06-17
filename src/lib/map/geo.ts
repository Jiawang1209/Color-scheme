import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import type { Feature, Geometry } from 'geojson';

let cache: Feature<Geometry>[] | null = null;

export function worldFeatures(): Feature<Geometry>[] {
  if (cache) return cache;
  // world-atlas countries-110m has objects.countries and objects.land
  const fc = feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as {
    features: Feature<Geometry>[];
  };
  cache = fc.features;
  return cache;
}
