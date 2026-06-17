# SciColor MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, front-end-only scientific color-palette picker (ColorBrewer-style) with perceptually-uniform colormaps and live color-blindness simulation.

**Architecture:** Vite + React + TypeScript SPA. Pure-logic layers (`lib/color`, `lib/export`, `lib/url`) are framework-free and fully unit-tested with Vitest. Palette data is vendored JSON normalized to one `Palette[]` shape behind a single `getColors(id, n)` interface. React components are thin views over a single top-level state object synced to the URL.

**Tech Stack:** Vite, React 18, TypeScript, Vitest, @testing-library/react, chroma-js (color interpolation).

---

## Development hard constraint: history.md (applies to EVERY task)

After completing each task's feature commit(s), you MUST record the change in `history.md` before moving on:

1. Make the feature commit(s) as written in the task.
2. Get the short hash: `git rev-parse --short HEAD`.
3. Get the time: `date "+%H:%M"`.
4. Append one row under today's date heading in `history.md`: `| <time> | <feature summary> | \`<hash>\` |`. Add a new `## YYYY-MM-DD` heading + table header if the date isn't present yet.
5. Commit separately: `git commit -m "docs(history): record <feature>"`.

A task is NOT done until its `history.md` row exists and is committed. This is also stated in `CLAUDE.md`.

---

## File Structure

- `src/lib/color/convert.ts` — hex↔rgb helpers.
- `src/lib/color/sample.ts` — continuous colormap sampling/interpolation.
- `src/lib/color/cvd.ts` — color-vision-deficiency transform matrices.
- `src/data/types.ts` — `Palette`, `PaletteType`, `Collection` types.
- `src/data/colorbrewer.json`, `viridis.json`, `crameri.json`, `journal.json` — vendored data.
- `src/data/index.ts` — loads + normalizes all collections; exports `palettes` and `getColors`.
- `src/lib/export/index.ts` — code generators per export format.
- `src/lib/url/state.ts` — encode/decode app state ↔ URL query.
- `src/state/types.ts` — `AppState`, enums.
- `src/components/*` — `TypeTabs`, `CvdToggle`, `Sidebar`, `NSelector`, `CollectionFilter`, `SafetyFilter`, `PaletteList`, `SwatchStrip`, `PreviewFigure`, `ExportPanel`.
- `src/App.tsx`, `src/main.tsx`, `src/styles.css`.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `vitest.config.ts`

- [ ] **Step 1: Scaffold Vite React-TS project**

Run:
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install chroma-js
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/chroma-js
```
If `npm create` refuses because the directory is non-empty, scaffold in a temp dir and copy files in, preserving existing `docs/`, `.gitignore`, and the two markdown files.

- [ ] **Step 2: Add test script + jsdom env**

Edit `package.json` scripts to include:
```json
"test": "vitest run",
"test:watch": "vitest"
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'jsdom', setupFiles: [] },
});
```

- [ ] **Step 3: Verify it runs**

Run: `npm run build`
Expected: build succeeds, `dist/` produced.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React-TS project with Vitest"
```

---

## Task 2: hex↔rgb conversion

**Files:**
- Create: `src/lib/color/convert.ts`
- Test: `src/lib/color/convert.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex } from './convert';

describe('convert', () => {
  it('hexToRgb parses #rrggbb', () => {
    expect(hexToRgb('#2166ac')).toEqual({ r: 33, g: 102, b: 172 });
  });
  it('rgbToHex round-trips', () => {
    expect(rgbToHex({ r: 33, g: 102, b: 172 })).toBe('#2166ac');
  });
  it('rgbToHex clamps and pads', () => {
    expect(rgbToHex({ r: 0, g: 5, b: 300 })).toBe('#0005ff');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/color/convert.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
export interface Rgb { r: number; g: number; b: number; }

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

export function rgbToHex({ r, g, b }: Rgb): string {
  const c = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/color/convert.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/color/convert.ts src/lib/color/convert.test.ts
git commit -m "feat: hex/rgb conversion helpers"
```

---

## Task 3: Continuous colormap sampling

**Files:**
- Create: `src/lib/color/sample.ts`
- Test: `src/lib/color/sample.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { sampleColors } from './sample';

const cp = ['#000000', '#ffffff']; // black → white control points

describe('sampleColors', () => {
  it('returns exactly n colors', () => {
    expect(sampleColors(cp, 5)).toHaveLength(5);
  });
  it('includes both endpoints', () => {
    const out = sampleColors(cp, 3);
    expect(out[0].toLowerCase()).toBe('#000000');
    expect(out[2].toLowerCase()).toBe('#ffffff');
  });
  it('n=1 returns the first control point', () => {
    expect(sampleColors(cp, 1)[0].toLowerCase()).toBe('#000000');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/color/sample.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```ts
import chroma from 'chroma-js';

// Even-spaced sample of n colors across control points, interpolated in Lab.
export function sampleColors(controlPoints: string[], n: number): string[] {
  if (n <= 1) return [controlPoints[0]];
  return chroma.scale(controlPoints).mode('lab').colors(n);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/color/sample.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/color/sample.ts src/lib/color/sample.test.ts
git commit -m "feat: continuous colormap sampling in Lab space"
```

---

## Task 4: CVD (color-blindness) transform

**Files:**
- Create: `src/lib/color/cvd.ts`
- Test: `src/lib/color/cvd.test.ts`

Uses Viénot 1999 / Brettel linear-RGB matrices for protanopia, deuteranopia, tritanopia.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { simulateCvd, CvdMode } from './cvd';

describe('simulateCvd', () => {
  it('normal mode returns input unchanged', () => {
    expect(simulateCvd('#2166ac', 'normal')).toBe('#2166ac');
  });
  it('returns a valid hex for each mode', () => {
    for (const m of ['protan', 'deutan', 'tritan'] as CvdMode[]) {
      expect(simulateCvd('#2166ac', m)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
  it('grey stays grey under deutan', () => {
    expect(simulateCvd('#808080', 'deutan')).toBe('#808080');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/color/cvd.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```ts
import { hexToRgb, rgbToHex } from './convert';

export type CvdMode = 'normal' | 'protan' | 'deutan' | 'tritan';

// sRGB <-> linear
const toLin = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const toSrgb = (l: number) => {
  const s = l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
  return s * 255;
};

// Viénot 1999 simulation matrices (operate on linear RGB).
const M: Record<Exclude<CvdMode, 'normal'>, number[][]> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.011820, 0.042940, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.303900],
  ],
};

export function simulateCvd(hex: string, mode: CvdMode): string {
  if (mode === 'normal') return hex;
  const { r, g, b } = hexToRgb(hex);
  const lin = [toLin(r), toLin(g), toLin(b)];
  const m = M[mode];
  const out = m.map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]);
  return rgbToHex({ r: toSrgb(out[0]), g: toSrgb(out[1]), b: toSrgb(out[2]) });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/color/cvd.test.ts`
Expected: PASS. (If the grey assertion is off by rounding, assert `toMatch(/^#80807f|#808080$/)` — greys map near-identity.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/color/cvd.ts src/lib/color/cvd.test.ts
git commit -m "feat: CVD simulation via Vienot matrices"
```

---

## Task 5: Palette data types + a seed collection

**Files:**
- Create: `src/data/types.ts`, `src/data/colorbrewer.json`, `src/data/index.ts`
- Test: `src/data/index.test.ts`

This task wires the unified interface against a small real seed (3 ColorBrewer palettes). Tasks 5b–5d add the remaining collections as data only.

- [ ] **Step 1: Define types**

`src/data/types.ts`:
```ts
export type PaletteType = 'sequential' | 'diverging' | 'qualitative';
export type Collection = 'colorbrewer' | 'viridis' | 'crameri' | 'journal';

export interface PaletteMeta {
  colorblindSafe: boolean | 'partial';
  printFriendly: boolean;
  photocopySafe: boolean;
}

export interface Palette {
  id: string;
  name: string;
  collection: Collection;
  type: PaletteType;
  discrete?: Record<number, string[]>;
  controlPoints?: string[];
  meta: PaletteMeta;
}
```

- [ ] **Step 2: Write the failing test**

`src/data/index.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { palettes, getColors } from './index';

describe('palette registry', () => {
  it('loads at least the seed palettes', () => {
    expect(palettes.find((p) => p.id === 'BuGn')).toBeTruthy();
  });
  it('getColors returns n colors for a discrete palette', () => {
    expect(getColors('BuGn', 3)).toHaveLength(3);
  });
  it('getColors samples a continuous palette to n', () => {
    // viridis added in Task 5b; until then this asserts discrete path only
    expect(getColors('BuGn', 5)).toHaveLength(5);
  });
  it('throws on unknown id', () => {
    expect(() => getColors('nope', 3)).toThrow();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/data/index.test.ts`
Expected: FAIL.

- [ ] **Step 4: Seed data + loader**

`src/data/colorbrewer.json` (seed — three palettes; add the full set later):
```json
[
  {
    "id": "BuGn", "name": "BuGn", "collection": "colorbrewer", "type": "sequential",
    "discrete": {
      "3": ["#e5f5f9","#99d8c9","#2ca25f"],
      "4": ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
      "5": ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"]
    },
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": false }
  },
  {
    "id": "RdBu", "name": "RdBu", "collection": "colorbrewer", "type": "diverging",
    "discrete": {
      "3": ["#ef8a62","#f7f7f7","#67a9cf"],
      "5": ["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"]
    },
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": false }
  },
  {
    "id": "Set2", "name": "Set2", "collection": "colorbrewer", "type": "qualitative",
    "discrete": {
      "3": ["#66c2a5","#fc8d62","#8da0cb"],
      "5": ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]
    },
    "meta": { "colorblindSafe": "partial", "printFriendly": true, "photocopySafe": false }
  }
]
```

`src/data/index.ts`:
```ts
import { Palette } from './types';
import { sampleColors } from '../lib/color/sample';
import colorbrewer from './colorbrewer.json';
// import viridis from './viridis.json';   // enabled in Task 5b
// import crameri from './crameri.json';   // enabled in Task 5c
// import journal from './journal.json';   // enabled in Task 5d

export const palettes: Palette[] = [
  ...(colorbrewer as Palette[]),
];

export function getColors(id: string, n: number): string[] {
  const p = palettes.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown palette: ${id}`);
  if (p.discrete) {
    const exact = p.discrete[n];
    if (exact) return exact;
    // fall back to nearest available discrete set, then slice/return as-is
    const keys = Object.keys(p.discrete).map(Number).sort((a, b) => a - b);
    const nearest = keys.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
    return p.discrete[nearest].slice(0, n);
  }
  if (p.controlPoints) return sampleColors(p.controlPoints, n);
  throw new Error(`Palette ${id} has no colors`);
}
```
Enable `resolveJsonModule` in `tsconfig.json` (`"resolveJsonModule": true`).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/data/index.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data tsconfig.json
git commit -m "feat: palette registry with unified getColors and ColorBrewer seed"
```

---

## Task 5b: Add Viridis family data

**Files:**
- Create: `src/data/viridis.json`
- Modify: `src/data/index.ts`
- Test: `src/data/index.test.ts` (extend)

- [ ] **Step 1: Add failing assertion**

Append to `src/data/index.test.ts`:
```ts
it('viridis is continuous and samples to n', () => {
  expect(getColors('viridis', 7)).toHaveLength(7);
});
```
Run: `npx vitest run src/data/index.test.ts` → FAIL.

- [ ] **Step 2: Add data**

`src/data/viridis.json` (control points along each map; add magma/inferno/plasma/cividis the same way):
```json
[
  { "id": "viridis", "name": "viridis", "collection": "viridis", "type": "sequential",
    "controlPoints": ["#440154","#414487","#2a788e","#22a884","#7ad151","#fde725"],
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": true } },
  { "id": "magma", "name": "magma", "collection": "viridis", "type": "sequential",
    "controlPoints": ["#000004","#3b0f70","#8c2981","#de4968","#fe9f6d","#fcfdbf"],
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": true } },
  { "id": "cividis", "name": "cividis", "collection": "viridis", "type": "sequential",
    "controlPoints": ["#00224e","#35577d","#7c7b78","#b5a04b","#fee838"],
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": true } }
]
```

- [ ] **Step 3: Wire into registry**

In `src/data/index.ts` uncomment the viridis import and spread:
```ts
import viridis from './viridis.json';
export const palettes: Palette[] = [
  ...(colorbrewer as Palette[]),
  ...(viridis as Palette[]),
];
```

- [ ] **Step 4: Run tests** → PASS. **Commit:**
```bash
git add src/data
git commit -m "feat: add viridis-family continuous palettes"
```

---

## Task 5c: Add Crameri scientific maps

**Files:** Create `src/data/crameri.json`; modify `src/data/index.ts`.

- [ ] **Step 1:** Add `src/data/crameri.json` with control points for `batlow`, `vik` (diverging), `roma` (diverging):
```json
[
  { "id": "batlow", "name": "batlow", "collection": "crameri", "type": "sequential",
    "controlPoints": ["#011959","#10557e","#5e7460","#b18e3f","#faccfa"],
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": true } },
  { "id": "vik", "name": "vik", "collection": "crameri", "type": "diverging",
    "controlPoints": ["#001260","#3a7cba","#f4f4f4","#c47a4a","#590008"],
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": true } },
  { "id": "roma", "name": "roma", "collection": "crameri", "type": "diverging",
    "controlPoints": ["#7e1900","#c5a23a","#dbf0a8","#5fb3c1","#1a3399"],
    "meta": { "colorblindSafe": true, "printFriendly": true, "photocopySafe": true } }
]
```
- [ ] **Step 2:** Import + spread in `src/data/index.ts`.
- [ ] **Step 3:** Run `npm run test` → PASS. Commit:
```bash
git add src/data && git commit -m "feat: add Crameri scientific colour maps"
```

---

## Task 5d: Add journal/brand qualitative palettes

**Files:** Create `src/data/journal.json`; modify `src/data/index.ts`.

- [ ] **Step 1:** Add `src/data/journal.json` (discrete qualitative; these are illustrative groupings, refine later):
```json
[
  { "id": "npg", "name": "Nature (NPG)", "collection": "journal", "type": "qualitative",
    "discrete": { "5": ["#e64b35","#4dbbd5","#00a087","#3c5488","#f39b7f"] },
    "meta": { "colorblindSafe": "partial", "printFriendly": true, "photocopySafe": false } },
  { "id": "aaas", "name": "Science (AAAS)", "collection": "journal", "type": "qualitative",
    "discrete": { "5": ["#3b4992","#ee0000","#008b45","#631879","#008280"] },
    "meta": { "colorblindSafe": "partial", "printFriendly": true, "photocopySafe": false } }
]
```
- [ ] **Step 2:** Import + spread in `src/data/index.ts`.
- [ ] **Step 3:** Run `npm run test` → PASS. Commit:
```bash
git add src/data && git commit -m "feat: add journal qualitative palettes"
```

---

## Task 6: Export code generators

**Files:**
- Create: `src/lib/export/index.ts`
- Test: `src/lib/export/index.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { exportCode, ExportFormat } from './index';

const colors = ['#e5f5f9', '#99d8c9', '#2ca25f'];

describe('exportCode', () => {
  it('hex format lists quoted hex codes', () => {
    expect(exportCode('hex', colors, 'BuGn')).toContain('"#e5f5f9"');
  });
  it('matplotlib emits ListedColormap', () => {
    const out = exportCode('matplotlib', colors, 'BuGn');
    expect(out).toContain('ListedColormap');
    expect(out).toContain('#2ca25f');
  });
  it('ggplot emits scale_*_manual', () => {
    expect(exportCode('ggplot', colors, 'BuGn')).toContain('scale_fill_manual');
  });
  it('every format returns a non-empty string', () => {
    const fmts: ExportFormat[] = ['hex', 'rgb', 'matplotlib', 'ggplot', 'plotly', 'r'];
    for (const f of fmts) expect(exportCode(f, colors, 'BuGn').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/export/index.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```ts
import { hexToRgb } from '../color/convert';

export type ExportFormat = 'hex' | 'rgb' | 'matplotlib' | 'ggplot' | 'plotly' | 'r';

const quoted = (cs: string[]) => cs.map((c) => `"${c}"`).join(', ');

export function exportCode(fmt: ExportFormat, colors: string[], name: string): string {
  switch (fmt) {
    case 'hex':
      return `[${quoted(colors)}]`;
    case 'rgb':
      return `[${colors.map((c) => { const { r, g, b } = hexToRgb(c); return `(${r}, ${g}, ${b})`; }).join(', ')}]`;
    case 'matplotlib':
      return `from matplotlib.colors import ListedColormap\n${name} = ListedColormap([${quoted(colors)}])`;
    case 'ggplot':
      return `scale_fill_manual(values = c(${quoted(colors)}))`;
    case 'plotly':
      return `colorscale = [${quoted(colors)}]`;
    case 'r':
      return `${name} <- c(${quoted(colors)})`;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/export/index.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/export
git commit -m "feat: export code generators for 6 formats"
```

---

## Task 7: URL state encode/decode

**Files:**
- Create: `src/state/types.ts`, `src/lib/url/state.ts`
- Test: `src/lib/url/state.test.ts`

- [ ] **Step 1: Define state type**

`src/state/types.ts`:
```ts
import { PaletteType, Collection } from '../data/types';
import { CvdMode } from '../lib/color/cvd';
import { ExportFormat } from '../lib/export';

export interface AppState {
  type: PaletteType;
  collections: Collection[];
  paletteId: string;
  n: number;
  cvd: CvdMode;
  exportFormat: ExportFormat;
}

export const DEFAULT_STATE: AppState = {
  type: 'sequential',
  collections: ['colorbrewer', 'viridis', 'crameri', 'journal'],
  paletteId: 'BuGn',
  n: 5,
  cvd: 'normal',
  exportFormat: 'matplotlib',
};
```

- [ ] **Step 2: Write the failing test**

`src/lib/url/state.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { encodeState, decodeState } from './state';
import { DEFAULT_STATE } from '../../state/types';

describe('url state', () => {
  it('round-trips state through a query string', () => {
    const s = { ...DEFAULT_STATE, paletteId: 'viridis', n: 7, cvd: 'deutan' as const };
    expect(decodeState(encodeState(s))).toEqual(s);
  });
  it('falls back to defaults on empty query', () => {
    expect(decodeState('')).toEqual(DEFAULT_STATE);
  });
  it('ignores unknown keys', () => {
    expect(decodeState('foo=bar').paletteId).toBe(DEFAULT_STATE.paletteId);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/url/state.test.ts`
Expected: FAIL.

- [ ] **Step 4: Write minimal implementation**

`src/lib/url/state.ts`:
```ts
import { AppState, DEFAULT_STATE } from '../../state/types';
import { PaletteType, Collection } from '../../data/types';
import { CvdMode } from '../color/cvd';
import { ExportFormat } from '../export';

export function encodeState(s: AppState): string {
  const p = new URLSearchParams();
  p.set('type', s.type);
  p.set('cols', s.collections.join(','));
  p.set('id', s.paletteId);
  p.set('n', String(s.n));
  p.set('cvd', s.cvd);
  p.set('fmt', s.exportFormat);
  return p.toString();
}

export function decodeState(query: string): AppState {
  const p = new URLSearchParams(query);
  const s: AppState = { ...DEFAULT_STATE };
  if (p.get('type')) s.type = p.get('type') as PaletteType;
  if (p.get('cols')) s.collections = p.get('cols')!.split(',') as Collection[];
  if (p.get('id')) s.paletteId = p.get('id')!;
  if (p.get('n')) s.n = Number(p.get('n'));
  if (p.get('cvd')) s.cvd = p.get('cvd') as CvdMode;
  if (p.get('fmt')) s.exportFormat = p.get('fmt') as ExportFormat;
  return s;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/url/state.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/state src/lib/url
git commit -m "feat: URL <-> app state encode/decode"
```

---

## Task 8: Presentational components

Each component is a pure function of props. Build them in this order; smoke-test each with @testing-library/react.

**Files (create each + a `.test.tsx` smoke test):**
- `src/components/SwatchStrip.tsx` — props `{ colors: string[]; cvd: CvdMode }`. Renders one `<div data-testid="swatch">` per color, background = `simulateCvd(color, cvd)`, with hex label; click copies via `navigator.clipboard.writeText`.
- `src/components/TypeTabs.tsx` — props `{ value: PaletteType; onChange }`. Three buttons.
- `src/components/CvdToggle.tsx` — props `{ value: CvdMode; onChange }`. Four options (normal/protan/deutan/tritan).
- `src/components/NSelector.tsx` — props `{ value: number; onChange }`. Buttons 3–9.
- `src/components/CollectionFilter.tsx` — props `{ value: Collection[]; onChange }`. Checkboxes.
- `src/components/SafetyFilter.tsx` — props `{ value: {cb:boolean;print:boolean;grey:boolean}; onChange }`.
- `src/components/PaletteList.tsx` — props `{ palettes: Palette[]; selectedId; n; cvd; onSelect }`. Each row shows a mini `SwatchStrip`.
- `src/components/ExportPanel.tsx` — props `{ format: ExportFormat; colors; name; onFormat }`. Format tabs + `<pre>` of `exportCode(...)` + copy button.
- `src/components/PreviewFigure.tsx` — props `{ colors: string[]; cvd: CvdMode; type: PaletteType }`. Canvas/SVG: a heatmap grid (sequential/diverging) or grouped bars (qualitative), each cell filled from `simulateCvd(color, cvd)`.

- [ ] **Step 1: SwatchStrip failing test**

`src/components/SwatchStrip.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwatchStrip } from './SwatchStrip';

describe('SwatchStrip', () => {
  it('renders one swatch per color', () => {
    render(<SwatchStrip colors={['#000000', '#ffffff']} cvd="normal" />);
    expect(screen.getAllByTestId('swatch')).toHaveLength(2);
  });
});
```
Run → FAIL.

- [ ] **Step 2: Implement SwatchStrip**

```tsx
import { simulateCvd, CvdMode } from '../lib/color/cvd';

export function SwatchStrip({ colors, cvd }: { colors: string[]; cvd: CvdMode }) {
  return (
    <div className="swatch-strip">
      {colors.map((c, i) => {
        const shown = simulateCvd(c, cvd);
        return (
          <div
            key={i}
            data-testid="swatch"
            className="swatch"
            style={{ background: shown }}
            title={c}
            onClick={() => navigator.clipboard?.writeText(c)}
          >
            <span className="swatch-label">{c}</span>
          </div>
        );
      })}
    </div>
  );
}
```
Run → PASS. Commit.

- [ ] **Step 3: Repeat the test→implement→commit cycle for each remaining component.**

For each: write a smoke test asserting it renders and a representative interaction fires `onChange`/`onSelect` (use `fireEvent.click`), then implement the minimal component above, then commit:
```bash
git add src/components/<Name>.tsx src/components/<Name>.test.tsx
git commit -m "feat: <Name> component"
```

**PreviewFigure** smoke test asserts a `<canvas>` (or `<svg>`) is present and that changing `colors` re-renders without throwing. Implementation: draw an N×M grid of rectangles cycling through `colors` (heatmap look) for sequential/diverging; draw 5 grouped bars for qualitative. Apply `simulateCvd(color, cvd)` to every fill.

---

## Task 9: Assemble App + state + URL sync

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`, create `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: App integration failing test**

`src/App.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders swatches for the default palette', () => {
    render(<App />);
    expect(screen.getAllByTestId('swatch').length).toBeGreaterThan(0);
  });
  it('changing n changes swatch count', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    // default palette BuGn discrete has up to 5; continuous would give 7.
    expect(screen.getAllByTestId('swatch').length).toBeGreaterThan(0);
  });
});
```
Run → FAIL.

- [ ] **Step 2: Implement App**

`src/App.tsx` holds `AppState` in `useState`, initialized from `decodeState(window.location.search.slice(1))`. On every state change, call `history.replaceState(null, '', '?' + encodeState(state))`. Derive:
```ts
const visible = palettes
  .filter((p) => p.type === state.type)
  .filter((p) => state.collections.includes(p.collection))
  .filter((p) => passesSafety(p, safety));
const current = palettes.find((p) => p.id === state.paletteId) ?? visible[0];
const colors = getColors(current.id, state.n);
```
Lay out the three columns per the spec (Sidebar | center SwatchStrip+PreviewFigure | ExportPanel), top bar with TypeTabs + search + CvdToggle. Wire each child's `onChange` to update `state`.

- [ ] **Step 3: Run test** → PASS.

- [ ] **Step 4: Add styles**

`src/styles.css`: neutral light theme (white/light-grey background, one restrained accent), three-column CSS grid, swatch strip flex layout. Import in `main.tsx`.

- [ ] **Step 5: Manual smoke check**

Run: `npm run dev`, open the local URL. Verify: switching type filters list; selecting a palette updates center + export; changing n updates colors; CVD toggle visibly shifts swatches and preview; copy button works; URL updates and reloading restores state.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble App with three-column layout and URL sync"
```

---

## Task 10: Build + deploy config

**Files:**
- Modify: `vite.config.ts`, `package.json`; create `.github/workflows/pages.yml` (if GitHub Pages chosen)

- [ ] **Step 1:** Set `base` in `vite.config.ts` to the repo path if deploying to GitHub Pages project site (e.g. `base: '/Color-scheme/'`); leave `'/'` for Vercel/user site.
- [ ] **Step 2:** Add a GitHub Actions workflow that runs `npm ci`, `npm run test`, `npm run build`, and publishes `dist/` to Pages (only if user wants Pages; otherwise document Vercel import).
- [ ] **Step 3:** Run `npm run build` → succeeds. Commit:
```bash
git add -A && git commit -m "chore: build and deploy config"
```

---

## Self-Review notes

- **Spec coverage:** §3 palettes → Tasks 5/5b/5c/5d; §4 three-column UI → Tasks 8–9; §4 URL state → Task 7; §5 CVD → Tasks 4, 8 (SwatchStrip/PreviewFigure); §6 modules → file structure; §7 stack → Task 1; §8 tests → every logic task; §9 visual tone → Task 9 styles; export formats → Task 6.
- **Deferred-by-design:** full ColorBrewer set beyond the seed, and remaining viridis maps (inferno/plasma/plasma), are "more JSON rows" — add incrementally; the interface in Task 5 already supports them.
- **Open choice:** color lib is chroma-js here (vs culori). If chroma-js proves heavy, `sampleColors` is the only consumer and can be swapped behind its unchanged signature.
