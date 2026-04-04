---
name: build
description: 仕様書に基づいて機能を実装し、コードレビュー・PR説明文の作成まで行う
argument-hint: "[機能・ストーリーの説明 or .claude/epics/epic_[機能名].md or .claude/temp/specs/機能名.md or .claude/temp/design/機能名.md]"
user-invocable: true
---

対象: $ARGUMENTS

## Step 1: コンテキストの収集

- `docs/CODING_GUIDELINES.md` `docs/ARCHITECTURE.md` `docs/CONTRIBUTING.md` `docs/pull_request_template.md` を読む
- 対応するエピックファイル（`.claude/epics/epic_[機能名].md`）があれば読む
- `.claude/temp/specs/機能名.md`があれば読む
- `.claude/temp/design/機能名.md`があれば読む

## Step 2: 実装方針の作成（プランモード）

プランモードで実装方針を作成し、`.claude/temp/plans/[機能名].md` に保存する。TodoWrite でタスクに分解する。

## Step 3: 承認

ユーザーの承認を待つ。修正が必要な場合は Step 2 に戻る。

## Step 4: 実装

1タスクずつ実装し、完了したら Todo を更新する。受け入れ条件ごとに最低1つのテストを書く。

実装中に仕様書・設計書の判断を変更した場合は、ユーザーに承認を求めたうえで `.claude/temp/specs/[機能名].md` の判断事項テーブルを更新する。

## Step 5: コードレビュー・修正

`code-review-agent` を起動し、仕様書・設計書・実装方針のパスを渡してレビューさせる。指摘事項があれば自律的に修正し、なくなったら Step 6 に進む。

## Step 6: 承認

修正済みのコードをユーザーに提示し、承認を待つ。修正が必要な場合は Step 4 に戻る。

## Step 7: PR 説明文の作成

`docs/CONTRIBUTING.md` `docs/pull_request_template.md` に沿って PR タイトルと説明文を生成し、コードブロックで表示する。

---

## 補足

### 実装方針に含める内容

実装方針の目的はコードを書く前にユーザーが方向を確認すること、および既存コードの事前調査の強制。内容は最小限でよい。

- 変更・作成するファイル一覧（Glob/Grep で既存コードを調査した結果）
- 実装の順序

### PR 説明文に含める内容

- 「なぜこの実装にしたか」の判断理由（仕様書の判断事項テーブルから転記）
- 以下に該当する受け入れ条件がある場合は動作確認チェックリストを含める
  - 見た目・UX（アニメーション・レイアウト・トーストの表示位置や挙動）
  - 複数ページにまたがるフロー（E2Eテストがない場合）
  - 外部サービスとの実際の連携（決済・メール送信など）

```markdown
## 動作確認チェックリスト

- [ ] [具体的な操作手順と期待される結果]
```
