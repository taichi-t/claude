# GCP 認定クイズ（PCSE / PCA）

Google Cloud 認定資格 **Professional Cloud Security Engineer（PCSE）** と **Professional Cloud Architect（PCA）** の対策用クイズアプリ。スマートフォンでの利用を想定した日本語 UI。

## 機能

- PCSE / PCA の切り替え。正答率は試験別・セクション別に表示（ブラウザの localStorage に保存）
- 単一選択と複数選択に対応。複数選択は完全一致のみ正解
- 回答直後に正誤・解説を表示。解説では「要件中のどの語句が決め手か」を問題文中でハイライト
- 公式試験ガイドのセクション／サブセクション名を各問題に表示し、セクション単位で出題を絞り込める
- PCA はケーススタディ（EHR Healthcare / Helicopter Racing League / Mountkirk Games / TerramEarth）の企業概要を表示し、同じ企業の問題を連続出題
- 間違えた問題だけを再挑戦

## 開発

```bash
npm install
npm run dev        # 開発サーバー
npm test           # ロジックと問題データの整合性テスト
npm run typecheck  # tsc
npm run lint       # oxlint
npm run build      # 本番ビルド（dist/）
```

サブパス配信（GitHub Pages など）は `VITE_BASE_PATH=/repo-name/ npm run build`。

## 問題データ

- `src/data/exams.ts` — 試験・セクション・サブセクション定義。公式試験ガイドに準拠
  - PCSE: <https://cloud.google.com/learn/certification/cloud-security-engineer?hl=ja>（ガイド PDF へのリンクあり）
  - PCA: <https://cloud.google.com/learn/certification/guides/professional-cloud-architect?hl=ja>
- `src/data/pcse.ts`, `src/data/pca.ts` — 問題本体。`sub` に公式ガイドのサブセクション番号を指定する
- `src/data/caseStudies.ts` — PCA 公式ケーススタディの要約（原文 PDF へのリンク付き）
- `src/data/questions.test.ts` — ID の一意性、正解の整合、決め手語句が問題文に含まれること等を検証

### 問題作成の方針

- 公式試験ガイドのセクション構成に沿って作成し、サービス名は最新の公式名称を使う（例: Sensitive Data Protection）
- 正解の根拠は公式ドキュメント・Google 推奨のベストプラクティスに基づく。判断が分かれる問題は作らない
- 流出した本番問題は使わない
- `tags: ['review']` は受験者が既に解いた論点の復習用。ホーム画面で除外できる
- セクションの `focus` は受験者の弱点に基づく重点領域の表示用で、公式の配点とは別

### 出題比率の調整

公式の出題範囲の中で、PCSE はネットワーク境界（セクション 2）と鍵の種類（3.2）、PCA はネットワーク／組織設計／移行とケーススタディを多めに収録している。
