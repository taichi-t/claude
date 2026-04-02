# AI協業設計ガイド

Claude Codeを使った開発における設定設計の原則と構成パターンをまとめる。
複数プロジェクトで共通して参照できる汎用ナレッジ。

---

## 設計原則

### 1. コンテキストウィンドウが唯一の制約

すべての設計判断はここから派生する。

- CLAUDE.mdは長いほど守られなくなる（目安200行以内）
- 重要なルールが些末なルールに埋もれると無視される
- 「いつも必要か、たまに必要か」で置き場所が決まる

### 2. 具体性が信頼性を決める

抽象的な指示はノイズになる。

- ❌ 「コードを綺麗に保つ」
- ✅ 「`npm test` を必ずコミット前に実行する」

検証可能な形で書けないルールは書かない。

### 3. 強制と指針を分ける

| 種類 | 場所 | 保証 |
|------|------|------|
| 絶対に守らせたいこと | hooks / settings | 確実に実行される |
| 守ってほしいこと | CLAUDE.md / rules | コンテキストに依存 |
| 手順 | skills | 呼び出し時のみ |

CLAUDE.mdは「設定ファイル」ではなく「コンテキストに注入されるテキスト」。

### 4. 遅延ロードで設計する

起動時に全部読み込む必要はない。

| タイミング | 場所 |
|-----------|------|
| 常に必要 | CLAUDE.md（毎回読み込み） |
| ファイル種別に依存 | `.claude/rules/`（`paths`で条件付き） |
| 作業フローに依存 | skills（呼び出し時のみ） |
| 調査・探索 | subagents（独立したコンテキスト） |

### 5. 構造がコンテンツと同じくらい重要

Claudeはヘッダー・箇条書きの構造を手がかりに重要度を判断する。

- 密な段落より箇条書き
- 「必ず守ること」は他と混在させない
- ファイルが長くなったらまず削る（移動・分割の前に）

---

## 何をどこに書くか

### 責務の分離

```
CLAUDE.md
  └── Claudeがこのプロジェクトで何をすべきか・何を守るべきか

.claude/rules/
  └── docs/ のファイルへの参照（アダプター層）
      ※ 内容はdocs/が持つ。rulesは「読め」とだけ書く

.claude/skills/
  └── 特定の作業をどう進めるか（手順）

.claude/settings.json
  └── 権限・環境変数・許可リストなど技術的に強制する設定

.claude/hooks/
  └── 必ず実行させたいアクション（シェルスクリプト）

docs/
  └── 人間もAIも読むプロジェクトの情報（唯一の真実）
```

### `settings.json` と `hooks/` の使い分け

`.claude/settings.json` はClaude Codeクライアントが強制する設定。Claudeの判断に依存しない。

```jsonc
// .claude/settings.json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(git *)"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

`hooks/` はClaude Codeのライフサイクルイベントに紐づくシェルスクリプト。

| イベント | 用途例 |
|---------|--------|
| `PreToolUse` | ツール実行前のバリデーション・ブロック |
| `PostToolUse` | 実行後の通知・ログ |
| `Stop` | 作業完了時の通知・後処理 |
| `Notification` | 承認待ちなどの割り込み通知 |

```jsonc
// .claude/settings.json
{
  "hooks": {
    "Stop": [{ "command": ".claude/hooks/notify.sh stop" }],
    "Notification": [{ "command": ".claude/hooks/notify.sh notification" }]
  }
}
```

**原則：「必ず起きてほしいこと」はhooksに書く。CLAUDE.mdに書いても保証されない。**

### `.claude/rules/` はアダプター層

プロジェクトドキュメント（`docs/`）はそれ自体が唯一の真実。
`.claude/rules/` はその内容をコピーせず、パスだけ持つ。

```markdown
---
paths:
  - "src/**/*.ts"
---

@docs/CODING_GUIDELINES.md
```

これにより：
- ドキュメントの二重管理が生まれない
- 人間が更新した内容がそのままClaudeにも届く

### CLAUDE.md に書くべきこと・書かないこと

| 書く | 書かない |
|------|---------|
| 協業方針・禁止事項 | 手順・フロー（→ skills） |
| ドキュメントのナビゲーション | ドキュメントの中身（→ docs/） |
| 必ず守るルール（簡潔に） | 詳細なコーディング規約（→ rules経由） |

### skills と agents の使い分け

| | skills | agents |
|---|---|---|
| 置き場所 | `.claude/skills/NAME.md` | `.claude/agents/NAME.md` |
| 呼び出し | `/skill-name` でユーザーが明示的に実行 | Claudeが自動でタスクを委譲 |
| コンテキスト | メイン会話と共有 | 完全に独立した別ウィンドウ |
| 引数渡し | `$ARGUMENTS` で受け取れる | なし |
| ツール制限 | `allowed-tools` で制限可能 | 独自のホワイトリスト設定 |
| モデル指定 | 不可（セッションを継承） | 可能（コスト最適化に使える） |

**skills** は「Claudeに手順を教える」もの。ユーザーがタイミングを制御して呼び出す。

```markdown
---
name: build
user-invocable: true
---
## Step 1: コンテキストの収集
...
```

**agents** は「専門的な役割を持つ独立したワーカー」。コンテキストを汚さずに探索・調査をさせるときに有効。

```markdown
---
name: code-reviewer
description: PRのコードをレビューし、問題点を指摘する
allowed-tools: Read, Grep, Glob
---
テックリードの視点でコードレビューを行う。
...
```

**判断基準：**

- 「この手順に従ってほしい」→ skill
- 「この作業を独立して処理してほしい」→ agent
- 「探索・調査でメイン会話を汚したくない」→ agent
- ユーザーが `/` で明示的に呼び出す作業 → skill

---

## モデルの使い分け

### `/model opusplan`

計画フェーズだけOpusを使い、実装に移ると自動でSonnetに切り替わる専用モード。
設計・方針決定はOpus、コーディングはSonnetという使い分けをワンコマンドで実現できる。

```bash
/model opusplan
```

### agentsにモデルを指定する

探索・調査など単純作業はagentsにHaikuを割り当てることでコストを抑えられる。
メイン会話のモデルはそのまま維持される。

```markdown
---
name: code-explorer
description: コードベースの探索・調査を行う
model: haiku
allowed-tools: Read, Grep, Glob
---
コードベースの探索に特化。調査結果のサマリーのみを返す。
```

### MCPよりCLIツールを優先する

MCPサーバーはツール定義がコンテキストに入るためトークンを消費する。
`gh`・`aws`・`gcloud` などCLIツールで代替できる場合はそちらを使う方がコスト効率が高い。

| 操作 | MCPより効率的な代替 |
|------|-------------------|
| GitHub操作 | `gh` コマンド |
| AWS操作 | `aws` CLI |
| ファイル検索・調査 | Haiku agentに委譲 |

使わないMCPサーバーは `/mcp` で無効化する。

### モデル選定の目安

| タスク | モデル |
|--------|--------|
| アーキテクチャ設計・方針決定 | Opus |
| 実装・リファクタリング | Sonnet（デフォルト） |
| 探索・検索・調査 | Haiku（agentに割り当て） |
| シンプルな単純作業 | Haiku |

---

## アンチパターン

### 手順をCLAUDE.mdに書く

CLAUDE.mdはコンテキスト。手順はskillsに持たせる。
CLAUDE.mdには「このフローを使え」の一文だけ書けばよい。

### docs/ の内容を `.claude/rules/` にコピーする

二重管理になり、どちらかが腐る。rulesはimportだけ。

### 何でもCLAUDE.mdに書く

ファイルが長くなるほど重要なルールが無視される。
追加する前に「本当にここに書く必要があるか」を問う。

### 検証できないルールを書く

「良いコードを書く」は機能しない。
ルールは「誰が見ても守ったかどうか判断できる」形にする。

---

## 参考

- [Claude Code ドキュメント](https://docs.anthropic.com/ja/docs/claude-code)
