# マッチングアプリクローン

## プロジェクト概要

TinderやPairsのようなマッチングアプリのクローンです。

本プロジェクトはハーネスエンジニアリング講座の
サンプルアプリとして作成します。
Next.js App Router と `.claude/` ディレクトリ構成を実践的に学ぶことが目的です。

## 機能

- プロフィール作成・閲覧
- スワイプ / いいね
- マッチング一覧
- ユーザー認証（ログイン・登録）

## 技術スタック

- Next.js App Router
- TypeScript
- Tailwind CSS
- pnpm
- Vitest（ユニットテスト）
- Playwright（E2Eテスト）

## フォルダ構成

- `src/app/` — ページのルーティング
- `src/features/` — 機能ごとのコード（例: profiles, matches, likes, auth）
- `src/shared/` — 複数機能で共通して使うパーツ
- `.claude/rules/` — 開発ルールの詳細

## やらないこと

- データベースの設計・構築（Next.jsのみで完結させる）
- 本番環境へのデプロイ
- ファイルの自動整理・自動削除
- 意思決定の自動化

## 開発規約

- コンポーネントは `src/features/` の適切なフォルダに置く
- テストはコンポーネントと同じフォルダに置く（Co-location）
- コミットは Conventional Commits 形式で書く
- 詳細は `.claude/rules/` の各ファイルを参照

## よく使うコマンド

- `pnpm dev` — 開発サーバー起動
- `pnpm build` — ビルド
- `pnpm test` — テスト実行
- `pnpm lint` — Lint実行
