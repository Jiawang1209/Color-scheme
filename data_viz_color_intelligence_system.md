# Data Visualization Color Intelligence System（设计草案）

## 1. 项目定位

本项目不是传统配色工具，而是一个：

> 面向数据科学的数据可视化配色与视觉编码决策系统

核心目标：
- 将“数据 → 可视化配色选择”过程部分自动化
- 将配色从“审美选择”提升为“数据驱动决策”
- 覆盖科研绘图、数据分析、GIS、BI等场景

---

## 2. 核心问题定义

传统配色工具的问题：
- 只提供 palette，不理解数据
- 用户需自行判断色彩映射方式
- 缺乏对数据分布与语义的感知

本系统目标：
> 输入不仅是“颜色需求”，而是“数据语义 + 数据结构”

---

## 3. 系统核心思想

### 三层结构

#### Layer 1：Color Layer（颜色层）
- palette（sequential / diverging / categorical）
- perceptual uniformity
- colorblind-safe design

#### Layer 2：Encoding Layer（编码层）
- 数值 → 颜色映射方式
- 是否需要中心值
- 是否非线性映射
- 是否强调对比 / 趋势 / 分类

#### Layer 3：Data Semantics Layer（语义层）
- 数据类型（continuous / categorical / ordinal）
- 分布特征（skewed / normal / multimodal）
- 任务类型（comparison / trend / classification）
- 领域语义（temperature / abundance / risk / gene expression）

---

## 4. 系统输入设计

### 模式A：语义输入
Soil carbon visualization

### 模式B：结构化数据摘要
{
  "type": "continuous",
  "distribution": "skewed",
  "range": [-2.5, 8.3],
  "zero_meaning": true,
  "task": "comparison",
  "context": "soil carbon"
}

### 模式C：原始数据
CSV / dataframe / JSON

---

## 5. 图像输入功能（新增）

### Image Color Extraction Module

功能：
- 提取主色
- 聚类颜色分布
- 生成 palette
- 转换为可视化配色方案

输出：
- dominant colors
- palette suggestion
- perceptual optimization
- colorblind-safe version

---

## 6. 输出系统

- palette recommendation
- encoding recommendation
- explanation (why this palette)
- code export (ggplot / matplotlib / plotly / GIS)

---

## 7. 系统架构

User Input
→ Input Parser
→ Data Understanding Engine
→ Encoding Decision Engine
→ Palette Recommendation Engine
→ Renderer / Export Layer

---

## 8. MVP路线

### v1
- palette库
- preview

### v2
- data profile input
- rule-based recommendation

### v3
- image palette extraction
- scientific figure mode

### v4
- AI visualization assistant

---

## 9. 产品本质

A data-aware color intelligence system for scientific visualization design.
