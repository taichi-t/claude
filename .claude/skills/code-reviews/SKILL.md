---
name: code-reviews
description: 仕様適合・規約／アーキテクチャの2観点を並列エージェントでレビューする
argument-hint: "[.claude/temp/specs/機能名.md] [.claude/temp/designs/機能名.md] [.claude/temp/plans/機能名.md] [レビュー対象ファイル...]"
user-invocable: true
---

引数: $ARGUMENTS

## Step 1: コンテキストの収集

- `.claude/temp/specs/` で始まるパス → 仕様書
- `.claude/temp/designs/` で始まるパス → 設計書
- `.claude/temp/plans/` で始まるパス → 実装方針
- その他のパス → レビュー対象ファイル
- レビュー対象ファイルの指定がない場合 → `git diff` を取得する

## Step 2: 並列レビュー

以下の2エージェントを同時に起動する。

### Agent A — 仕様適合レビュー

- 渡された仕様書・設計書・実装方針を読む
- 渡されていない場合は `.claude/temp/specs/` `.claude/temp/designs/` `.claude/temp/plans/` を glob して関連するものを読む
- 参照できるドキュメントが何もない場合はユーザーに仕様書・設計書のパスを尋ねる
- レビュー対象コードが仕様・設計の意図を満たしているか確認し、問題点をファイル名・行番号とともに指摘する

### Agent B — 規約・方針レビュー

- `docs/CODING_GUIDELINES.md` `docs/ARCHITECTURE.md` `docs/CONTRIBUTING.md` を読む
- レビュー対象コードが各ドキュメントの基準に準拠しているか確認し、問題点をファイル名・行番号とともに指摘する

## Step 3: 統合

```
## 仕様適合レビュー
（Agent A の結果）

## 規約・方針レビュー
（Agent B の結果）
```
