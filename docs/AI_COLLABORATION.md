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
    Q{いつ必要?}
    Q -->|常に| CLAUDE["CLAUDE.md\n方針・禁止事項・ナビゲーション"]
    Q -->|ファイル種別に依存| Rules[".claude/rules/\ndocs/へのimportのみ"]
    Q -->|作業フロー時のみ| Skills[".claude/skills/\n手順・ワークフロー"]
    Q -->|探索・調査| Agents[".claude/agents/\n独立したワーカー"]

    E{必ず実行?}
    E -->|Yes| Hooks[".claude/hooks/\nライフサイクルイベント"]
    E -->|No| CLAUDE

    P{技術的に強制?}
    P -->|Yes| Settings[".claude/settings.json\n権限・許可リスト"]

    D["docs/\n人間もAIも読む唯一の真実"]
    Rules -->|参照| D
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
flowchart LR
    subgraph skills[".claude/skills/"]
        S1["ユーザーが /skill で呼び出す"]
        S2["メイン会話のコンテキストを共有"]
        S3["手順・ワークフローを記述"]
    end

    subgraph agents[".claude/agents/"]
        A1["Claudeが自動で委譲"]
        A2["独立したコンテキスト窓"]
        A3["モデル・ツールを個別指定可"]
    end
```

| | skills | agents |
|---|---|---|
| 呼び出し | ユーザーが `/` で明示実行 | Claudeが自動委譲 |
| コンテキスト | メイン会話と共有 | 完全に独立 |
| モデル指定 | 不可 | 可能 |
| 向いている用途 | 手順を教える・フロー制御 | 探索・調査・専門ワーカー |

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
