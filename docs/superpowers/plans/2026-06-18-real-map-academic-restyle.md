# Real Map + Academic Restyle Plan

> Subagent-driven, TDD for logic, history.md logged per task. NO push; no Co-Authored-By.

**Goal:** Replace the crude abstract Voronoi map with a real geographic world choropleth (d3-geo + world-atlas), and restyle the whole app toward a rigorous scientific/academic data-tool aesthetic (precise grid, high density, refined typography, hairline borders, monospace for numerics).

**Why:** User feedback — the map and overall look feel "粗糙" (crude). User chose: real geographic map + 科研/学术严谨风.

---

## Task 1 — Geo features (TDD)
Install: `d3-geo topojson-client world-atlas` + dev `@types/d3-geo @types/topojson-client`.
- Create `src/lib/map/geo.ts`: `worldFeatures()` decodes `world-atlas/countries-110m.json` via `topojson-client.feature(...)` → GeoJSON `Feature[]`.
- Test `src/lib/map/geo.test.ts`: returns >100 features; each has a `geometry`.
- Commit `feat: world geo features from topojson` + history row.

## Task 2 — MapPreview rewrite (real choropleth)
- Rewrite `src/components/MapPreview.tsx`: props unchanged `{ colors, cvd, type }`. Use `geoNaturalEarth1()` projection `.fitSize([W,H], { type:'FeatureCollection', features })`, `geoPath(projection)`. For each feature: `d = path(f)`, centroid `[cx,cy] = path.centroid(f)`, `idx = classIndex(type, cx, cy, W, H, colors.length)` (reuse existing tested `src/lib/map/field.ts`), `fill = simulateCvd(colors[idx], cvd)`. Render an ocean/sphere backdrop `<path d={path({type:'Sphere'})}/>` with a light fill + hairline graticule optional. White hairline strokes between countries.
- Remove the now-unused `src/lib/map/regions.ts` + `regions.test.ts`; uninstall `d3-delaunay` + `@types/d3-delaunay`.
- Update `src/components/MapPreview.test.tsx`: assert `container.querySelectorAll('path').length > 50` for a 3-color sequential palette.
- Verify tests + build. Commit `feat: real geographic world choropleth map` + history row.

## Task 3 — Academic restyle (designer, CSS)
- Overhaul `src/styles.css` toward 科研/学术严谨风: precise spacing scale, hairline 1px borders, minimal elevation, refined type hierarchy, monospace (`ui-monospace, 'SF Mono', Menlo, monospace`) for hex/rgb/code/numeric, small uppercase letter-spaced section labels, compact density. Add a horizontal colorbar legend + caption under the map. Balance the picker/image views (constrain max-width, remove dead vertical space). Keep the single restrained accent. No logic changes; tests stay green.
- Commit `style: academic/scientific restyle` + history row.

## Then
Controller visual checkpoint (screenshot all three tabs + map for seq/div/qual), iterate, then finishing-a-development-branch.
