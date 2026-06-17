# SciColor — 项目约定

科研数据可视化配色工具（ColorBrewer 式 MVP）。设计见
`docs/superpowers/specs/2026-06-17-scicolor-mvp-design.md`，实现计划见
`docs/superpowers/plans/2026-06-17-scicolor-mvp.md`。

## 开发硬约束：history.md（必须遵守）

项目的**任何变动**都必须在 `history.md` 追加一条记录，包含：
1. 日期时间
2. 改动 / 功能提升说明
3. 对应的 git commit 短哈希（用于追溯）

每个任务的收尾流程：
1. 先完成功能提交（`git commit -m "feat: ..."`）。
2. `git rev-parse --short HEAD` 取得该提交的短哈希。
3. 在 `history.md` 当前日期下追加一行（时间 / 说明 / 该哈希）。用 `date` 取当前时间。
4. 单独提交一次：`git commit -m "docs(history): record <feature>"`。

不允许在不更新 `history.md` 的情况下结束一个功能任务。

## 技术栈

Vite + React + TypeScript，Vitest 测试，chroma-js 处理颜色。纯前端，构建为静态文件部署到 **GitHub Pages**。

## 测试纪律

底层逻辑（`lib/color`、`lib/export`、`lib/url`、`data`）走严格 TDD（先写失败测试）。UI 组件做冒烟测试 + 最小实现。

## Git

- 提交信息**不要**加 `Co-Authored-By` 之类的 Claude/Anthropic 署名。
- **不要** `git push`，由用户自己推送。
