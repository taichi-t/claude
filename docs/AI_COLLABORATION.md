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
    Q1 -->|Yes| Q1a{技術的に強制できる?}
    Q1a -->|Yes| Settings[".claude/settings.json\n権限・許可リスト"]
    Q1a -->|No| Hooks[".claude/hooks/\nシェルスクリプト"]

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

## skills vs agents

```mermaid
flowchart TD
    Task{"この作業は…"} -->|手順に従ってほしい| Skill
    Task -->|独立して処理してほしい| Agent

    subgraph Skill[".claude/skills/"]
        direction LR
        SK1["ユーザーが /skill で呼び出し"]
        SK2["メインのコンテキストを共有"]
    end

    subgraph Agent[".claude/agents/"]
        direction LR
        AG1["Claudeが自動で委譲"]
        AG2["独立コンテキスト・モデル指定可"]
    end

    Skill -->|結果がそのまま会話に残る| Main["メイン会話"]
    Agent -->|サマリーだけ返る| Main
```

---

## モデルとトークンの最適化

```mermaid
flowchart LR
    Task["タスク"] --> D{種別}
    D -->|設計・方針決定| Opus
    D -->|実装・リファクタ| Sonnet["Sonnet\nデフォルト"]
    D -->|探索・調査| Haiku["Haiku\nagentに割り当て"]

    Opus -->|実装フェーズへ移行| Sonnet
    note["'/model opusplan' で\n自動切り替え"]
```

**MCPよりCLIを優先する**

MCPはツール定義がコンテキストに入る分だけ高コスト。`gh`・`aws` などCLIで代替できる場合はCLIを使う。使わないMCPは `/mcp` で無効化する。

---

## アンチパターン

- **手順をCLAUDE.mdに書く** → skillsへ
- **docs/の内容をrulesにコピーする** → importだけにする
- **何でもCLAUDE.mdに書く** → 長くなるほど重要なルールが無視される
- **検証できないルールを書く** → 「良いコードを書く」は機能しない

---

## 参考

- [Claude Code ドキュメント](https://docs.anthropic.com/ja/docs/claude-code)
