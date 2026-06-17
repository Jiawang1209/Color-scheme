# SciColor Tools Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three features to SciColor — a ColorBrewer-style abstract choropleth map preview, a color picker (spectrum + screen eyedropper with nearest-library match), and an image color extractor (dominant colors + nearest scientific palette recommendation) — behind a three-tab top navigation.

**Architecture:** Extend the existing Vite + React + TS SPA. New pure-logic lives under `src/lib/color` and `src/lib/map` (fully Vitest-tested). The app shell gains a top-level view switch (配色库 / 取色器 / 图片取色); the current single-page UI is extracted into `src/views/LibraryView.tsx`, and two new views are added. Map geometry is a deterministic Voronoi tessellation (d3-delaunay) over fixed seed points — no geographic data, no real-map dependency.

**Tech Stack:** existing (React 18, TS, Vitest, chroma-js) + two small libs: `react-colorful` (HSV picker UI), `d3-delaunay` (Voronoi geometry). Median-cut extraction is implemented in-repo (no dep) for testability.

---

## Development hard constraint: history.md (applies to EVERY task)

After each task's feature commit(s): get `git rev-parse --short HEAD` and `date "+%H:%M"`, append a row `| <time> | <feature summary> | \`<hash>\` |` under today's `## YYYY-MM-DD` heading in `history.md` (add the heading if absent), then commit separately `docs(history): record <feature>`. A task is NOT done until its history.md row is committed. Also stated in `CLAUDE.md`. Never add a `Co-Authored-By` trailer; never `git push`.

---

## File Structure

New pure logic:
- `src/lib/color/hsl.ts` — rgb↔hsl conversion.
- `src/lib/color/nearest.ts` — `nearestPaletteColor(hex)`, `nearestPalette(colors)`, perceptual distance.
- `src/lib/color/extract.ts` — `medianCut(pixels, n)` dominant-color extraction.
- `src/lib/map/regions.ts` — deterministic Voronoi region polygons.
- `src/lib/map/field.ts` — scalar-field → class-index assignment per palette type.

App shell + views:
- `src/state/view.ts` — `AppView` type + URL view param helpers.
- `src/views/LibraryView.tsx` — the existing three-column palette UI (extracted from App.tsx).
- `src/views/PickerView.tsx` — color picker.
- `src/views/ImageView.tsx` — image extractor.
- `src/components/AppTabs.tsx` — top nav tabs.
- `src/components/MapPreview.tsx` — abstract choropleth SVG.
- `src/components/PreviewSwitch.tsx` — 地图 / 图表 segmented control.
- `src/App.tsx` — becomes a shell: holds active view, renders AppTabs + active view.

---

## Phase A — Shared color logic (TDD)

### Task A1: rgb↔hsl conversion

**Files:** Create `src/lib/color/hsl.ts`; Test `src/lib/color/hsl.test.ts`.

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { rgbToHsl, hexToHsl } from './hsl';

describe('hsl', () => {
  it('pure red → hsl(0,100,50)', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });
  it('white → l=100, s=0', () => {
    const { s, l } = rgbToHsl({ r: 255, g: 255, b: 255 });
    expect([s, l]).toEqual([0, 100]);
  });
  it('hexToHsl parses #0000ff → h≈240', () => {
    expect(hexToHsl('#0000ff').h).toBe(240);
  });
});
```
- [ ] **Step 2: Run** `npx vitest run src/lib/color/hsl.test.ts` → FAIL.
- [ ] **Step 3: Implement**
```ts
import { hexToRgb, Rgb } from './convert';

export interface Hsl { h: number; s: number; l: number; }

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex));
}
```
(Confirm `convert.ts` exports `Rgb`; it does.)
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit + history**
```bash
git add src/lib/color/hsl.ts src/lib/color/hsl.test.ts && git commit -m "feat: rgb/hsl conversion"
```
then history row `rgb/hsl conversion (lib/color/hsl)` + `docs(history)` commit.

### Task A2: perceptual distance + nearest palette color

**Files:** Create `src/lib/color/nearest.ts`; Test `src/lib/color/nearest.test.ts`.

`nearestPaletteColor(hex)` scans every color of every palette in the registry and returns the closest one by CIE Lab ΔE (via chroma-js).

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { colorDistance, nearestPaletteColor } from './nearest';

describe('nearest', () => {
  it('distance of identical colors is 0', () => {
    expect(colorDistance('#2166ac', '#2166ac')).toBe(0);
  });
  it('distance is symmetric and positive for different colors', () => {
    expect(colorDistance('#000000', '#ffffff')).toBeGreaterThan(0);
  });
  it('nearestPaletteColor returns a hex from some palette + its source', () => {
    const r = nearestPaletteColor('#2ca25f');
    expect(r.hex).toMatch(/^#[0-9a-f]{6}$/i);
    expect(typeof r.paletteId).toBe('string');
  });
  it('an exact palette color maps to itself (distance ~0)', () => {
    const r = nearestPaletteColor('#e5f5f9'); // BuGn[3][0]
    expect(r.distance).toBeLessThan(1);
  });
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**
```ts
import chroma from 'chroma-js';
import { palettes } from '../../data/index';
import { getColors } from '../../data/index';

export function colorDistance(a: string, b: string): number {
  return chroma.deltaE(a, b); // CIE ΔE; 0 when identical
}

export interface NearestColor { hex: string; paletteId: string; distance: number; }

// Representative colors per palette: discrete sets get their largest set;
// continuous palettes get a 7-sample.
function paletteSwatches(id: string): string[] {
  return getColors(id, 7);
}

export function nearestPaletteColor(target: string): NearestColor {
  let best: NearestColor = { hex: '#000000', paletteId: '', distance: Infinity };
  for (const p of palettes) {
    for (const c of paletteSwatches(p.id)) {
      const d = colorDistance(target, c);
      if (d < best.distance) best = { hex: c, paletteId: p.id, distance: d };
    }
  }
  return best;
}
```
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit + history** (`perceptual distance + nearest palette color (lib/color/nearest)`).

### Task A3: nearest scientific palette for a set of colors

**Files:** Modify `src/lib/color/nearest.ts`; extend `src/lib/color/nearest.test.ts`.

`nearestPalette(colors)` ranks built-in palettes by how well they cover the input colors (sum of each input's nearest-distance to the palette's sampled colors) and returns the best.

- [ ] **Step 1: Add failing test**
```ts
import { nearestPalette } from './nearest';
it('greens map closest to a green-ish palette', () => {
  const r = nearestPalette(['#e5f5f9', '#99d8c9', '#2ca25f']);
  expect(typeof r.paletteId).toBe('string');
  expect(r.score).toBeGreaterThanOrEqual(0);
});
```
Run → FAIL.
- [ ] **Step 2: Implement (append to nearest.ts)**
```ts
export interface NearestPalette { paletteId: string; score: number; }

export function nearestPalette(colors: string[], n = 7): NearestPalette {
  let best: NearestPalette = { paletteId: '', score: Infinity };
  for (const p of palettes) {
    const swatches = getColors(p.id, n);
    let total = 0;
    for (const c of colors) {
      let min = Infinity;
      for (const s of swatches) min = Math.min(min, colorDistance(c, s));
      total += min;
    }
    const score = total / colors.length;
    if (score < best.score) best = { paletteId: p.id, score };
  }
  return best;
}
```
- [ ] **Step 3: Run** → PASS. **Commit + history** (`nearest scientific palette for a color set (lib/color/nearest)`).

### Task A4: median-cut dominant color extraction

**Files:** Create `src/lib/color/extract.ts`; Test `src/lib/color/extract.test.ts`.

Pure function over an array of RGB pixels. The component (Task E1) supplies pixels from a canvas.

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { medianCut } from './extract';
import type { Rgb } from './convert';

const px = (r: number, g: number, b: number): Rgb => ({ r, g, b });

describe('medianCut', () => {
  it('returns exactly n colors', () => {
    const pixels = [px(255,0,0), px(250,5,5), px(0,255,0), px(5,250,5), px(0,0,255), px(5,5,250)];
    expect(medianCut(pixels, 3)).toHaveLength(3);
  });
  it('a single-color image yields that color', () => {
    const pixels = Array.from({ length: 10 }, () => px(33, 102, 172));
    const out = medianCut(pixels, 3);
    expect(out[0].toLowerCase()).toBe('#2166ac');
  });
  it('outputs valid hex', () => {
    const pixels = [px(10,20,30), px(200,100,50), px(123,222,99)];
    for (const c of medianCut(pixels, 2)) expect(c).toMatch(/^#[0-9a-f]{6}$/);
  });
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — standard median-cut: start with one bucket of all pixels; repeatedly split the bucket with the greatest channel range along that channel at the median, until n buckets (or no more splittable); each bucket's average is a color.
```ts
import type { Rgb } from './convert';
import { rgbToHex } from './convert';

function channelRanges(px: Rgb[]) {
  const lo = { r: 255, g: 255, b: 255 }, hi = { r: 0, g: 0, b: 0 };
  for (const p of px) {
    lo.r = Math.min(lo.r, p.r); hi.r = Math.max(hi.r, p.r);
    lo.g = Math.min(lo.g, p.g); hi.g = Math.max(hi.g, p.g);
    lo.b = Math.min(lo.b, p.b); hi.b = Math.max(hi.b, p.b);
  }
  return { r: hi.r - lo.r, g: hi.g - lo.g, b: hi.b - lo.b };
}

function average(px: Rgb[]): Rgb {
  const s = px.reduce((a, p) => ({ r: a.r + p.r, g: a.g + p.g, b: a.b + p.b }), { r: 0, g: 0, b: 0 });
  return { r: s.r / px.length, g: s.g / px.length, b: s.b / px.length };
}

export function medianCut(pixels: Rgb[], n: number): string[] {
  if (pixels.length === 0) return [];
  let buckets: Rgb[][] = [pixels];
  while (buckets.length < n) {
    // pick bucket with largest single-channel range
    let bi = -1, bestRange = -1, bestChan: 'r' | 'g' | 'b' = 'r';
    buckets.forEach((b, i) => {
      if (b.length < 2) return;
      const rng = channelRanges(b);
      (['r', 'g', 'b'] as const).forEach((ch) => {
        if (rng[ch] > bestRange) { bestRange = rng[ch]; bi = i; bestChan = ch; }
      });
    });
    if (bi === -1) break; // nothing splittable
    const b = buckets[bi].slice().sort((p, q) => p[bestChan] - q[bestChan]);
    const mid = Math.floor(b.length / 2);
    buckets.splice(bi, 1, b.slice(0, mid), b.slice(mid));
  }
  return buckets.map((b) => rgbToHex(average(b)));
}
```
- [ ] **Step 4: Run** → PASS. **Commit + history** (`median-cut dominant color extraction (lib/color/extract)`).

---

## Phase B — App shell + tab navigation

### Task B1: extract LibraryView, add tabs and view routing

**Files:** Create `src/state/view.ts`, `src/components/AppTabs.tsx`, `src/views/LibraryView.tsx`; rewrite `src/App.tsx`; update/move `src/App.test.tsx`; Test `src/components/AppTabs.test.tsx`.

- [ ] **Step 1: View type + URL helper** `src/state/view.ts`
```ts
export type AppView = 'library' | 'picker' | 'image';
export const DEFAULT_VIEW: AppView = 'library';

export function readView(search: string): AppView {
  const v = new URLSearchParams(search).get('view');
  return v === 'picker' || v === 'image' ? v : 'library';
}
export function writeView(search: string, view: AppView): string {
  const p = new URLSearchParams(search);
  p.set('view', view);
  return p.toString();
}
```
- [ ] **Step 2: AppTabs failing test** `src/components/AppTabs.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppTabs } from './AppTabs';
describe('AppTabs', () => {
  it('fires onChange with the clicked view', () => {
    const onChange = vi.fn();
    render(<AppTabs value="library" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '取色器' }));
    expect(onChange).toHaveBeenCalledWith('picker');
  });
});
```
Run → FAIL.
- [ ] **Step 3: Implement AppTabs** — three buttons: library→"配色库", picker→"取色器", image→"图片取色"; active gets className "active"; props `{ value: AppView; onChange: (v: AppView) => void }`.
- [ ] **Step 4: Extract LibraryView** — move the ENTIRE current body of `src/App.tsx` (the three-column library: state, URL sync via encodeState/decodeState, header TypeTabs/search/CvdToggle, sidebar, center, export) verbatim into `src/views/LibraryView.tsx` as `export function LibraryView()`. The library's own URL params (type/id/n/cvd/fmt) keep working unchanged; they coexist with the new `view` param.
- [ ] **Step 5: New App shell** `src/App.tsx`
```tsx
import { useState, useEffect } from 'react';
import { AppTabs } from './components/AppTabs';
import { LibraryView } from './views/LibraryView';
import { PickerView } from './views/PickerView';
import { ImageView } from './views/ImageView';
import { readView, writeView, type AppView } from './state/view';

export default function App() {
  const [view, setView] = useState<AppView>(() => readView(window.location.search));
  useEffect(() => {
    history.replaceState(null, '', '?' + writeView(window.location.search.slice(1), view));
  }, [view]);
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <span className="app-title">SciColor</span>
        <AppTabs value={view} onChange={setView} />
      </nav>
      {view === 'library' && <LibraryView />}
      {view === 'picker' && <PickerView />}
      {view === 'image' && <ImageView />}
    </div>
  );
}
```
NOTE: LibraryView still renders its own header (TypeTabs/search/CvdToggle). To avoid a duplicate "SciColor" title, remove the `app-title` span from LibraryView's header during extraction (the shell now owns the title). Keep LibraryView's TypeTabs/search/CvdToggle.
- [ ] **Step 6: Stub the two new views** so the app compiles now: create minimal `src/views/PickerView.tsx` and `src/views/ImageView.tsx` each returning `<div className="view-stub">即将到来</div>` (real impls in Phase D/E).
- [ ] **Step 7: Update App.test.tsx**
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
describe('App shell', () => {
  it('starts on the library view with swatches', () => {
    render(<App />);
    expect(screen.getAllByTestId('swatch').length).toBeGreaterThan(0);
  });
  it('switches to the picker view', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '取色器' }));
    expect(screen.getByText('即将到来')).toBeInTheDocument();
  });
});
```
- [ ] **Step 8: Run** `npx vitest run` → all pass; `npm run build` → succeeds. **Commit + history** (`app shell with library/picker/image tabs + LibraryView extraction`).

---

## Phase C — Abstract choropleth map preview

### Task C1: deterministic Voronoi region geometry

**Files:** `npm install d3-delaunay`; Create `src/lib/map/regions.ts`; Test `src/lib/map/regions.test.ts`.

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { buildRegions } from './regions';

describe('buildRegions', () => {
  it('produces the requested region count, deterministically', () => {
    const a = buildRegions(40, 600, 400);
    const b = buildRegions(40, 600, 400);
    expect(a).toHaveLength(40);
    expect(a.map((r) => r.path)).toEqual(b.map((r) => r.path)); // deterministic
  });
  it('each region has an SVG path and a centroid in-bounds', () => {
    const [r] = buildRegions(40, 600, 400);
    expect(r.path.startsWith('M')).toBe(true);
    expect(r.cx).toBeGreaterThanOrEqual(0);
    expect(r.cx).toBeLessThanOrEqual(600);
  });
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — deterministic seeded PRNG (mulberry32 with a FIXED seed constant, NOT Math.random) to scatter `count` points in [0,w]×[0,h]; build a Voronoi via `d3-delaunay`'s `Delaunay.from(points).voronoi([0,0,w,h])`; for each cell read `voronoi.renderCell(i)` as the SVG path and compute centroid from the polygon.
```ts
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
  const pts: number[][] = Array.from({ length: count }, () => [rand() * w, rand() * h]);
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
```
- [ ] **Step 4: Run** → PASS. **Commit + history** (`deterministic Voronoi region geometry (lib/map/regions)`).

### Task C2: scalar field → class assignment

**Files:** Create `src/lib/map/field.ts`; Test `src/lib/map/field.test.ts`.

Maps a region centroid to a color index so sequential palettes show a smooth spatial gradient, diverging a center, qualitative pseudo-random categories.

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { classIndex } from './field';

describe('classIndex', () => {
  it('returns an index in [0, n)', () => {
    for (let i = 0; i < 20; i++) {
      const idx = classIndex('sequential', i * 30, 100, 600, 400, 5);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(5);
    }
  });
  it('is deterministic for the same inputs', () => {
    expect(classIndex('diverging', 300, 200, 600, 400, 7))
      .toBe(classIndex('diverging', 300, 200, 600, 400, 7));
  });
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**
```ts
import type { PaletteType } from '../../data/types';

// smooth 0..1 field from position; sequential ramps left→right with a vertical wobble,
// diverging is symmetric around the horizontal center.
function field(x: number, y: number, w: number, h: number): number {
  const fx = x / w, fy = y / h;
  return Math.min(1, Math.max(0, 0.5 * fx + 0.5 * (0.5 + 0.5 * Math.sin(fy * Math.PI * 1.5 + fx * 3))));
}

export function classIndex(
  type: PaletteType, x: number, y: number, w: number, h: number, n: number,
): number {
  if (type === 'qualitative') {
    // stable pseudo-random category from quantized position
    const key = (Math.round(x) * 73856093) ^ (Math.round(y) * 19349663);
    return Math.abs(key) % n;
  }
  let f = field(x, y, w, h);
  if (type === 'diverging') f = Math.abs(f - 0.5) * 2; // center emphasis
  return Math.min(n - 1, Math.floor(f * n));
}
```
- [ ] **Step 4: Run** → PASS. **Commit + history** (`scalar field → palette class assignment (lib/map/field)`).

### Task C3: MapPreview component + preview switch in LibraryView

**Files:** Create `src/components/MapPreview.tsx`, `src/components/PreviewSwitch.tsx`; Modify `src/views/LibraryView.tsx`; Tests `src/components/MapPreview.test.tsx`, `src/components/PreviewSwitch.test.tsx`.

- [ ] **Step 1: MapPreview failing test**
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MapPreview } from './MapPreview';
describe('MapPreview', () => {
  it('renders one filled region per Voronoi cell', () => {
    const { container } = render(
      <MapPreview colors={['#e5f5f9','#99d8c9','#2ca25f']} cvd="normal" type="sequential" />,
    );
    expect(container.querySelectorAll('path').length).toBeGreaterThan(10);
  });
});
```
Run → FAIL.
- [ ] **Step 2: Implement MapPreview** — props `{ colors: string[]; cvd: CvdMode; type: PaletteType }`. `const W=620,H=380; const regions = useMemo(()=>buildRegions(48, W, H), []);` render `<svg data-testid="map" viewBox={\`0 0 ${W} ${H}\`}>` with one `<path d={r.path} fill={simulateCvd(colors[classIndex(type, r.cx, r.cy, W, H, colors.length)], cvd)} stroke="#fff" strokeWidth={0.75}/>` per region. Guard empty colors.
- [ ] **Step 3: PreviewSwitch** — props `{ value: 'map'|'chart'; onChange }`; two buttons 地图 / 图表; active className. Smoke test: click 图表 → onChange('chart').
- [ ] **Step 4: Wire into LibraryView** — add local `const [preview, setPreview] = useState<'map'|'chart'>('map');` Render `<PreviewSwitch value={preview} onChange={setPreview}/>` above the preview area; show `<MapPreview .../>` when 'map' else the existing `<PreviewFigure .../>`. Default 'map' (user preference).
- [ ] **Step 5: Run** `npx vitest run` → pass; `npm run build` → ok. **Commit + history** (`abstract choropleth map preview + preview switch (components/MapPreview)`).
- [ ] **Step 6: VISUAL CHECKPOINT (controller)** — controller runs the dev server and screenshots the library view in map mode for sequential, diverging, and qualitative palettes; confirm it looks good before continuing.

---

## Phase D — Color picker view

### Task D1: PickerView (spectrum + eyedropper + nearest match)

**Files:** `npm install react-colorful`; Rewrite `src/views/PickerView.tsx`; Test `src/views/PickerView.test.tsx`.

- [ ] **Step 1: Failing test**
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PickerView } from './PickerView';
describe('PickerView', () => {
  it('shows the current color hex and a nearest-library swatch', () => {
    render(<PickerView />);
    expect(screen.getByTestId('picker-hex').textContent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(screen.getByTestId('nearest-swatch')).toBeInTheDocument();
  });
});
```
Run → FAIL.
- [ ] **Step 2: Implement PickerView**
  - `import { HexColorPicker } from 'react-colorful';`
  - State `const [hex, setHex] = useState('#2166ac');`
  - Render `<HexColorPicker color={hex} onChange={setHex} />`.
  - Show codes: `<div data-testid="picker-hex">{hex}</div>`, plus rgb (via `hexToRgb`) and hsl (via `hexToHsl`), each with a copy button.
  - Eyedropper: feature-detect `'EyeDropper' in window`; if present render a "屏幕吸管" button that does `const eye = new (window as any).EyeDropper(); const { sRGBHex } = await eye.open(); setHex(sRGBHex);`. If absent, render the button disabled with title "当前浏览器不支持（试试 Chrome/Edge）".
  - Nearest library color: `const near = nearestPaletteColor(hex);` render `<div data-testid="nearest-swatch" style={{background: near.hex}} />` with text `最接近：${near.paletteId} · ${near.hex}` and a note of ΔE. (Optionally a button "在配色库中打开" that sets `?view=library&id=<paletteId>` and reloads — nice-to-have, keep simple: a link to `?view=library&id=${near.paletteId}`.)
- [ ] **Step 3: Run** `npx vitest run` → pass; `npm run build` → ok. **Commit + history** (`color picker view: spectrum + eyedropper + nearest library color (views/PickerView)`).

---

## Phase E — Image color extraction view

### Task E1: ImageView (upload → extract → recommend)

**Files:** Rewrite `src/views/ImageView.tsx`; Test `src/views/ImageView.test.tsx`.

- [ ] **Step 1: Failing test** (render + control presence; canvas pixel reading isn't exercised in jsdom)
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageView } from './ImageView';
describe('ImageView', () => {
  it('renders an upload control and a color-count slider', () => {
    render(<ImageView />);
    expect(screen.getByLabelText('上传图片')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});
```
Run → FAIL.
- [ ] **Step 2: Implement ImageView**
  - State: `const [colors, setColors] = useState<string[]>([]); const [n, setN] = useState(6);`
  - Upload: a `<label>上传图片<input type="file" accept="image/*" aria-label="上传图片" onChange={onFile} hidden/></label>` plus a drop zone (`onDrop`/`onDragOver`). Also keep the visible `<input>` accessible (the test uses getByLabelText '上传图片').
  - Slider: `<input role="slider" type="range" min={3} max={10} value={n} onChange={e=>setN(+e.target.value)} aria-label="提取颜色数"/>`.
  - `onFile`/drop handler: read the File via `createImageBitmap`/`<img>` + `onload`, draw onto an offscreen `<canvas>` downsampled to ≤100px on the long side, `ctx.getImageData` → build `Rgb[]` (skip fully-transparent pixels, sample every pixel of the downsampled image), call `medianCut(pixels, n)` → `setColors`.
  - Output: show extracted swatches using `SwatchStrip` (cvd="normal"); show the source image thumbnail; reuse `ExportPanel` (format state local, name "extracted") for code export; and a recommendation: `const rec = colors.length ? nearestPalette(colors) : null;` render "最接近的科研配色：<rec.paletteId>" with a link `?view=library&id=${rec.paletteId}`.
  - Re-extract when `n` changes if an image is loaded (store the last downsampled `Rgb[]` in a ref and re-run `medianCut` on slider change without re-reading the file).
- [ ] **Step 3: Run** `npx vitest run` → pass; `npm run build` → ok. **Commit + history** (`image color extraction view: upload → median-cut → nearest palette (views/ImageView)`).
- [ ] **Step 4: VISUAL CHECKPOINT (controller)** — controller loads the picker and image views, exercises the picker, uploads a sample image, screenshots both; confirm they work and look good.

---

## Phase F — Styling polish + final verification

### Task F1: style the new views/tabs + final pass

**Files:** Modify `src/styles.css`; (no logic change).

- [ ] **Step 1:** Style `.app-shell`, `.app-nav` (top bar with title + tabs), `.app-tabs button`/active state (consistent with existing accent `#2166ac`), `.map` svg sizing, `PreviewSwitch`, PickerView layout (picker left, codes + nearest right), ImageView layout (drop zone, thumbnail, swatches, recommendation). Keep the neutral light theme; the new chrome must stay quiet.
- [ ] **Step 2:** `npx vitest run` → all pass; `npm run build` → succeeds.
- [ ] **Step 3:** Commit + history (`style new tabs/views (map, picker, image)`).
- [ ] **Step 4: FINAL VISUAL CHECKPOINT (controller)** — screenshot all three tabs; confirm cohesive look. Then finishing-a-development-branch.

---

## Self-Review

- **Coverage:** map preview → C1/C2/C3 (+ switch in LibraryView); color picker (spectrum + eyedropper + nearest) → D1 (uses A1 hsl, A2 nearest); image extraction (dominant + recommend) → E1 (uses A4 extract, A3 nearestPalette); three-tab nav → B1; styling → F1.
- **Types/signatures:** `Rgb` (convert.ts) reused by hsl.ts/extract.ts; `nearestPaletteColor`/`nearestPalette` defined in A2/A3 and consumed by D1/E1; `buildRegions`/`classIndex` defined in C1/C2 and consumed by C3; `AppView` defined in B1 and consumed by App/AppTabs.
- **Deps added:** `d3-delaunay` (C1), `react-colorful` (D1). Median-cut is in-repo (A4).
- **Deferred/notes:** real geographic map is out of scope (abstract Voronoi chosen); "open in library" cross-links are simple `?view=library&id=` URLs (full deep-link restore already works via existing URL state). EyeDropper is Chromium-only — gracefully disabled elsewhere.
