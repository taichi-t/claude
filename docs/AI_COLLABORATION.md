# AI協業設計ガイド

Claude Codeの設定設計における原則と構成パターン。複数プロジェクトで共通して参照できる汎用ナレッジ。

---

## 設計原則

1. **コンテキストウィンドウが唯一の制約** — CLAUDE.mdは長いほど守られなくなる（目安200行以内）
2. **具体性が信頼性を決める** — 検証可能な形で書けないルールは書かない
3. **強制と指針を分ける** — 必ず守らせたいことはhooks/settingsへ。CLAUDE.mdは保証されない
4. **遅延ロードで設計する** — 常に必要なものだけ起動時に読み込む
5. **構造がコンテンツと同じくらい重要** — 長くなったらまず削る

---

## 何をどこに書くか

```mermaid
flowchart TD
    Start["書きたいことがある"] --> Q1{必ず実行させたい?}
    Q1 -->|Yes| Q1a{何で強制する?}
    Q1a -->|Claude Codeの権限制御| Settings[".claude/settings.json\n権限・許可リスト"]
    Q1a -->|イベント時のスクリプト実行| Hooks[".claude/hooks/\nライフサイクルイベント"]
    Q1a -->|コード品質・フォーマット| Linter["linter / formatter\nESLint・Prettier・etc"]

    Q1 -->|No| Q2{いつ必要?}
    Q2 -->|常に| CLAUDE["CLAUDE.md\n方針・禁止事項・ナビゲーション"]
    Q2 -->|特定ファイル編集時| Rules[".claude/rules/\ndocs/へのimportのみ"]
    Q2 -->|特定の作業フロー時| Q3{コンテキスト分離が必要?}
    Q3 -->|No| Skills[".claude/skills/\n手順・ワークフロー"]
    Q3 -->|Yes| Agents[".claude/agents/\n独立したワーカー"]

    Rules -->|参照| Docs["docs/\n人間もAIも読む唯一の真実"]
```

### rules はアダプター層

`docs/` の内容をコピーせず、パスだけ持つ。二重管理を避ける。

```markdown
---
paths:
  - "src/**/*.ts"
---
@docs/CODING_GUIDELINES.md
```

---

## モデルとトークンの最適化

```mermaid
flowchart TD
    Start["トークンを節約したい"] --> Q1{どこを最適化する?}

    Q1 -->|モデル選択| Q2{タスクの複雑さは?}
    Q2 -->|高：設計・方針決定| Opus["Opus\n/model opusplan で\n実装時にSonnetへ自動切替"]
    Q2 -->|中：実装・リファクタ| Sonnet["Sonnet\nデフォルト"]
    Q2 -->|低：探索・調査| Haiku["Haiku\nagentに割り当て"]

    Q1 -->|ツール選択| Q3{CLIで代替できる?}
    Q3 -->|Yes| CLI["CLI\ngh・aws・gcloud"]
    Q3 -->|No| MCP["MCP\n使わないものは /mcp で無効化"]
```

---

## アンチパターン

- **手順をCLAUDE.mdに書く** → skillsへ
- **docs/の内容をrulesにコピーする** → importだけにする
- **何でもCLAUDE.mdに書く** → 長くなるほど重要なルールが無視される
- **検証できないルールを書く** → 「良いコードを書く」は機能しない

---

## 参考

- [Claude Code ドキュメント](https://docs.anthropic.com/ja/docs/claude-code)
