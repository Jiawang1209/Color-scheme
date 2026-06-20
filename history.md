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
| 00:13 | 学术严谨风重塑：密度/细边框/等宽数字/地图图例 (styles.css) | `bfc272f` |
| 00:23 | 地图改为美国县级 choropleth + 州界 (us-atlas, geoAlbersUsa) | `a07ab37` |
| 00:42 | 布局再平衡：大色带/小地图/宽导出 + 地图 hover 取色提示 | `2c9adf5` |
| 07:46 | 地图 hover 性能优化：county 路径 memo 化 + 事件委托 (MapPreview) | `56a5c5a` |
| 16:59 | 地图预览放大到约占一半面积（去掉尺寸上限+加宽中列）| `8275db4` |
| 17:02 | 导出/复制框移到地图上方，改两栏布局 | `f396338` |
| 17:10 | 全面前端重做：Stripe/Linear 高级设计系统（Inter+token+分段控件+阴影+微交互）| `be54b35` |
| 17:20 | 放大字号+层次更自信+色带改薄（提升「给力」感）| `3a68448` |
| 17:34 | 左侧栏改为贯穿整页高度的固定面板，配色列表填满剩余空间 | `43cb4de` |
| 17:41 | 地图改用 canvas 渲染（取代 3142 个 SVG 节点）+ 离屏 pick canvas 命中检测 hover | `a2e7a7f` |

## 2026-06-19

| 时间 | 改动 / 功能 | commit |
|------|-------------|--------|
| 21:17 | 取色器/图片取色页面居中重构（标题+两栏+填满）| `3df4075` |
| 21:44 | 重做配色大色带：更薄的色块+hex 移到下方+hover 抬升 (SwatchStrip) | `39cf92b` |

## 2026-06-20

| 时间 | 改动 / 功能 | commit |
|------|-------------|--------|
| 07:28 | 颜色分析工具：CIELAB 亮度曲线 + 感知灰度 (lib/color/analysis) | `7005bef` |
| 07:31 | 新增「分析」预览：L* 亮度曲线 + 灰度/打印预览 (AnalysisPanel + PreviewSwitch) | `f580ea5` |
| 07:40 | 新增导出格式 CSS/D3/Tailwind/MATLAB (lib/export + ExportPanel) | `69650c4` |
| 07:45 | 下载功能：色带 PNG/SVG + 地图 PNG (lib/download + LibraryView) | `340ce06` |
| 07:49 | 全局复制 toast 反馈（色块/取色器/导出）(lib/clipboard + Toaster) | `a2e8adc` |
| 09:44 | gitignore .omc/ 本地工具目录 | `83423ec` |
