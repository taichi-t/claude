---
name: design-review
description: テックリードの観点で設計書をレビューし、アーキテクチャ整合性・過剰設計・スコープ逸脱を確認する
argument-hint: "[.claude/temp/designs/[機能名].md] [レビュー対象の設計書ファイルパス]"
user-invocable: false
---

対象: $ARGUMENTS

## Step 1: コンテキストの収集

- `docs/ARCHITECTURE.md` `docs/CODING_GUIDELINES.md` を読む
- 対応するエピックファイル（`.claude/epics/epic_[機能名].md`）があれば読む
- `.claude/temp/specs/[機能名].md` があれば読む

## Step 2: レビュー

以下の観点でテックリードの視点からレビューし、問題点があれば具体的に指摘して修正案を提示する。問題がなければ「レビュー完了：指摘事項なし」と報告する。

- アーキテクチャ整合性（既存方針・依存方向との矛盾）
- スコープの妥当性（仕様書のスコープを超えた過剰設計でないか）
- 実装リスク（技術的困難・不確実な箇所、既存コードへの影響範囲）
