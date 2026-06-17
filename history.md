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
