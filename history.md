# 开发历史 · History

> **硬约束**：项目的任何变动都必须在此追加一条记录，包含：① 日期时间；② 改动/功能提升说明；③ 对应的 git commit 短哈希（用于追溯）。
>
> 记录流程：先做功能提交 → `git rev-parse --short HEAD` 取哈希 → 在本文件追加条目 → 单独提交一次 `docs(history): ...`。
>
> 条目按时间倒序或正序皆可，本项目采用**正序追加**（新条目加到对应日期下方）。

---

## 2026-06-17

| 时间 | 改动 / 功能 | commit |
|------|-------------|--------|
| 16:52 | 建立设计 spec、实现 plan，确立 history.md 开发硬约束 | `a1914dd` |
| 16:57 | scaffold Vite+React+TS+Vitest project | `9e137e0` |
| 16:59 | restore untracked 设计草案 + track lockfile（脚手架误删后恢复） | `00ef459` |
| 17:01 | hex/rgb conversion helpers (lib/color/convert) | `0449504` |
| 17:03 | continuous colormap sampling in Lab (lib/color/sample) | `32c1855` |
| 17:05 | CVD color-blindness simulation (lib/color/cvd) | `78a49e9` |
| 17:09 | palette registry + getColors + 4 collections (data layer) | `6e90c5b` |
| 22:11 | export code generators, 6 formats (lib/export) | `bc6d9f2` |
| 22:14 | URL <-> AppState encode/decode (state + lib/url) | `b37055d` |
| 22:19 | 9 presentational components + smoke tests (components) | `2a43c7c` |
| 22:24 | assemble App: three-column layout + URL sync + styling | `98bb9b7` |
| 22:34 | expand palette library to 54 schemes (full ColorBrewer set + more viridis/crameri/journal) | `7dc2dff` |
| 22:41 | GitHub Pages deploy config (vite base + Actions workflow + README) | `f8881bc` |
| 23:08 | tools expansion plan: map preview + 取色器 + 图片取色 | `6036819` |
| 23:10 | rgb/hsl conversion (lib/color/hsl) | `9f1d1e9` |
| 23:13 | perceptual distance + nearest palette color (lib/color/nearest) | `3a5480f` |
| 23:14 | nearest scientific palette for a color set (lib/color/nearest) | `550b26d` |
| 23:17 | median-cut dominant color extraction (lib/color/extract) | `97a4b3c` |
| 23:21 | app shell + 3 tabs + LibraryView extraction (App/AppTabs/views) | `b941fc1` |
| 23:25 | deterministic Voronoi region geometry (lib/map/regions) | `1fd2f23` |
| 23:25 | scalar field → palette class assignment (lib/map/field) | `b186785` |
| 23:28 | abstract choropleth map preview + preview switch (MapPreview/PreviewSwitch) | `fc3c7e7` |
| 23:33 | color picker view: spectrum + eyedropper + nearest library color (views/PickerView) | `184d904` |
| 23:37 | image color extraction view: upload → median-cut → nearest palette (views/ImageView) | `6ef5f42` |
| 23:40 | polish app shell nav + tabs + view styling (styles.css) | `ee30062` |

## 2026-06-18

| 时间 | 改动 / 功能 | commit |
|------|-------------|--------|
| 00:04 | real-map + 学术风重塑 计划 | `1344676` |
| 00:06 | world geo features from topojson (lib/map/geo) | `f827dbf` |
| 00:08 | real geographic world choropleth map preview (MapPreview + d3-geo) | `ec3b80a` |
