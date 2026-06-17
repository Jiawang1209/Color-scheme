# SciColor — 科研配色工具 MVP 设计

日期：2026-06-17
状态：已与用户确认，准备进入实现计划

## 1. 项目定位

一个纯前端、可静态部署的**科研数据可视化配色选择器**，操作习惯对标
[colorbrewer2.org](https://colorbrewer2.org)，但在两点上更贴科研：

1. 内置感知均匀（perceptually-uniform）的现代科研配色库（viridis 家族、Crameri 科学色图），而不仅是制图用的 ColorBrewer。
2. 内置**色盲（CVD）实时模拟**：把当前配色和预览图实时转成色盲视角。

本设计是更大愿景（见 `data_viz_color_intelligence_system.md`）的**第一层地基**。
数据感知推荐（v2）、图片取色 / AI 助手（v3/v4）不在本次范围，作为后续各自独立的
设计 → 计划 → 实现循环。

### 非目标（本次明确不做）

- 无后端、无登录、无数据库、无数据上传。
- 不做交互式「自定义配色编辑器」（用户拖拽调色）。期刊/品牌色只作为**预置数据**提供。
- 不做数据画像输入与规则推荐（属于后续 B 层）。

## 2. 范围与成功标准

MVP 完成的标准：用户能在一屏内完成「选类型 → 选方案 → 调色级数 → 看科研图预览
→（可选）切色盲视角 → 复制目标语言代码」的完整流程，并可静态部署分享。

## 3. 配色库（内置为 JSON 数据）

四个来源，统一成同一种数据结构。配色按生成方式分两类，由统一接口屏蔽差异：

- **离散型（ColorBrewer）**：每个色级数 n（3–9，部分到 11/12）有官方预定义颜色。
- **连续型（Viridis 家族、Crameri 科学色图）**：存控制点，按 n 等距采样 + 插值。
- **分类型（期刊/品牌色）**：固定几组定性色（Nature / Science / Cell 风格），离散。

### 数据结构

```ts
type PaletteType = 'sequential' | 'diverging' | 'qualitative';
type Collection = 'colorbrewer' | 'viridis' | 'crameri' | 'journal';

interface Palette {
  id: string;            // e.g. "BuGn", "viridis", "batlow"
  name: string;
  collection: Collection;
  type: PaletteType;
  // 离散型：按 n 预定义；连续型：null（用 controlPoints 采样）
  discrete?: Record<number, string[]>;   // { 3: [...], 4: [...], ... }
  controlPoints?: string[];              // 连续型的等距控制点（hex）
  meta: {
    colorblindSafe: boolean | 'partial';
    printFriendly: boolean;
    photocopySafe: boolean;
  };
}
```

统一取色接口：

```ts
getColors(paletteId: string, n: number): string[]
// 离散型：查 discrete[n]；连续型：在 controlPoints 上等距采样并在感知空间插值。
```

数据来源：ColorBrewer 官方 JSON；viridis/magma/inferno/plasma/cividis 控制点；
Crameri scientific colour maps（batlow / vik / roma 等）；期刊色手工整理。全部 vendored 为本地 JSON。

## 4. 界面（三栏，对标 ColorBrewer）

- **顶栏**：类型 tab（连续 / 发散 / 分类）+ 搜索框 + 色盲视角开关。
- **左栏**：
  - 色级数 n 选择（3–9）
  - 来源筛选（ColorBrewer / Viridis / Crameri / 期刊，可多选）
  - 安全过滤（色盲安全 / 打印友好 / 灰度安全）
  - 方案列表（缩略色带，点击选中）
- **中栏**：
  - 当前配色大色块 + 每块 hex 标签，点击复制单色
  - 科研图预览：热图 + 散点/折线示例，随配色与 n 实时更新
- **右栏**：导出面板。格式 tab：matplotlib / ggplot2 / plotly / R(base) / HEX / RGB。
  代码块 + 一键复制。

### URL 可分享状态（轻量加分项）

把「类型 / 方案 id / n / 色盲模式」编码进 URL query，便于分享与复现当前选择。
实现成本低，纳入 MVP。

## 5. 色盲实时模拟

顶部开关：正常 / 红色盲(protanopia) / 绿色盲(deuteranopia) / 蓝色盲(tritanopia)。
开启后用色彩矩阵法（Machado 2009 或 Viénot 1999）实时变换**色块与预览图**的每个颜色。
同时保留官方 `colorblindSafe` 标注做交叉验证（模拟是「看效果」，标注是「权威结论」）。

## 6. 模块划分

- `src/data/` — 各配色库 JSON + 加载器，输出统一 `Palette[]`。
- `src/lib/color/` — hex↔rgb 转换、连续色图等距采样与感知空间插值（用 culori 或 chroma.js）、CVD 变换矩阵。
- `src/lib/export/` — 各导出格式的代码生成器（输入 colors + 元信息，输出代码字符串）。
- `src/components/` — TypeTabs、CvdToggle、Sidebar（NSelector / CollectionFilter / SafetyFilter / PaletteList）、SwatchStrip、PreviewFigure、ExportPanel。
- `src/App.tsx` — 顶层状态：选中类型 / 来源筛选 / 安全过滤 / n / CVD 模式 / 选中配色；与 URL 双向同步。

每个模块单一职责、接口清晰、可独立测试。

## 7. 技术栈与部署

- Vite + React + TypeScript。
- 构建产物为纯静态文件，部署到 GitHub Pages 或 Vercel。
- 颜色处理库：culori 或 chroma.js（实现阶段定）。

## 8. 测试

用 Vitest 覆盖纯逻辑：

- 连续色图按 n 采样的正确性（端点、间距、单调性）。
- CVD 变换矩阵对已知颜色的输出。
- 各导出格式代码生成的快照。
- `getColors` 在离散/连续两类上的行为。

组件做冒烟测试（渲染、关键交互）。

## 9. 视觉基调

站点本身用中性浅色（白 / 浅灰 + 一个克制的强调色），把「颜色」完全留给配色本身，
避免界面配色干扰用户对方案的视觉判断。

## 10. 后续路线图（不在本次范围）

- B 层：数据画像输入 + 规则推荐（草案 v2）。
- C 层：图片取色、科研图模式、AI 可视化助手（草案 v3/v4）。
- 交互式自定义配色编辑器。
