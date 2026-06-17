# SciColor — Scientific Color-Palette Picker

A ColorBrewer-style color-palette tool for data visualization, featuring perceptually-uniform colormaps and live color-blindness simulation.

科学数据可视化配色选择器，支持感知均匀色图与实时色觉模拟。

---

## What it is / 功能简介

- **4 palette collections**: Sequential, Diverging, Qualitative, Perceptually Uniform (Viridis family, Crameri scientific colormaps, journal-friendly schemes)
- **Live CVD simulation**: Deuteranopia, Protanopia, Tritanopia previewed in real time
- **Export formats**: HEX, RGB, CSS, SCSS, Python list, R vector
- **URL state sync**: share any palette configuration via URL

---

## Quick Start / 快速开始

```bash
npm install
npm run dev      # local dev server at http://localhost:5173/
npm run test     # run Vitest unit tests
npm run build    # production build → dist/
```

---

## Palette Collections / 配色方案集合

| Collection | Description |
|------------|-------------|
| Sequential | Single-hue ramps for ordered data |
| Diverging | Bi-polar scales with a neutral midpoint |
| Qualitative | Categorical palettes for nominal data |
| Perceptually Uniform | Viridis, Plasma, Crameri, journal schemes |

---

## Deployment / 部署

Live site: **https://jiawang1209.github.io/Color-scheme/**

Deployment is automated via GitHub Actions (`.github/workflows/pages.yml`) — every push to `main` triggers a build and deploy to GitHub Pages.

**One-time setup**: in the repo Settings → Pages, set Source to **"GitHub Actions"**.
