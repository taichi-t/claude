---
name: develop
description: 開発サイクルのオーケストレーター。CLAUDE.md の開発サイクルに従い、spec-agent → design-agent → build-agent を順番に起動して機能開発を完了させる。仕様策定から実装・PR作成まで一貫して進めたい場合に使う。
argument-hint: "[機能説明 or .claude/epics/epic_〇〇.md]"
user-invocable: true
---

機能・エピック: $ARGUMENTS

## オーケストレーション構成

| Phase | 担当 agent | 使用 skill | 入力 | 出力 |
|-------|-----------|-----------|------|------|
| 1: 仕様策定（任意） | `spec-agent` | `/spec` | 機能の説明 or `.claude/epics/epic_〇〇.md` | `.claude/temp/specs/機能名.md` |
| 1.5: 詳細設計（任意） | `design-agent` | `/design` | `.claude/temp/specs/機能名.md` or 設計対象の説明 | `.claude/temp/designs/機能名.md` |
| 2: 実装 | `build-agent` | `/build` | `.claude/temp/specs/機能名.md` + `.claude/temp/designs/機能名.md`（任意） | PR |

## 概要

`CLAUDE.md` の開発サイクルに従い、各フェーズを順番に実行する。

各フェーズ完了後は必ずユーザーの承認を得てから次のフェーズに進む。フェーズ間のコンテキストは渡さず、`.claude/temp/` の成果物ファイルで引き継ぐ。

## Phase 1: 仕様策定

`spec-agent` を起動し、`/spec` skill を使って仕様策定を行う。

```
入力: $ARGUMENTS
出力: .claude/temp/specs/機能名.md
```

完了後、仕様書の内容をユーザーに提示して承認を求める。承認が得られるまでこのフェーズを繰り返す。

## Phase 1.5: 詳細設計（任意）

ユーザーに詳細設計が必要か確認する。必要な場合のみ `design-agent` を起動し、`/design` skill を使って設計を行う。

```
入力: .claude/temp/specs/機能名.md
出力: .claude/temp/designs/機能名.md
```

完了後、設計書の内容をユーザーに提示して承認を求める。承認が得られるまでこのフェーズを繰り返す。

## Phase 2: 実装

`build-agent` を起動し、`/build` skill を使って実装・PR作成を行う。

```
入力: .claude/temp/specs/機能名.md（+ .claude/temp/designs/機能名.md があれば）
出力: PR
```

完了後、PR の内容をユーザーに提示して承認を求める。

## 完了

全フェーズが承認されたら開発サイクル完了を報告する。
