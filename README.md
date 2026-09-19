# たびプラン

旅行の計画を投稿して「いいね」をもらえる、旅行専用SNS。
Next.js (App Router) + Supabase (Auth / Postgres) + Vercel。

## セットアップ

1. **Supabase**: 新しいプロジェクトを作成 → `SQL Editor` に `supabase/schema.sql` を貼り付けて実行
2. **Supabase**: `Project Settings > API` の Project URL と anon (publishable) key をコピー
3. ローカル: `cp .env.example .env.local` に上記2つを記入 → `npm install` → `npm run dev`
4. **GitHub**: リポジトリを作成して push
5. **Vercel**: GitHubリポジトリをImport → Environment Variables に `.env.local` と同じ2つを登録 → Deploy
6. **Supabase**: `Authentication > URL Configuration` の Site URL を Vercel の本番URLに変更

開発中にメール確認を省略したい場合は、Supabase の `Authentication > Sign In / Providers > Email` で
「Confirm email」をオフにしてください（公開前にオンへ戻すのがおすすめです）。

## 構成

- `supabase/schema.sql` — テーブル(profiles / plans / likes)・サインアップ時のプロフィール自動作成・RLS
- `app/page.tsx` — 新着プラン一覧
- `app/plans/[id]/page.tsx` — プラン詳細・削除
- `app/new/page.tsx` — プラン投稿
- `app/login/page.tsx` — ログイン / 新規登録
- `components/LikeButton.tsx` — いいね（1人1回、もう一度押すと取り消し）
