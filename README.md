This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### ポート変更方法

デフォルトでは3000番ポートで起動しますが、以下の方法でポートを変更できます：

#### 方法1: 環境変数を使用

`.env.local`ファイルを編集してPORT環境変数を設定：

```
PORT=8080
```

#### 方法2: package.jsonで定義済みのポート指定スクリプトを使用

```bash
# 開発サーバー
npm run dev         # 3001番ポート

# 本番サーバー
npm run start       # 3000番ポート
```

#### 方法3: コマンドラインでポートを直接指定

```bash
# 開発サーバー
next dev:port -p 3001

# 本番サーバー
next start:port -p 4000
```

#### 方法4: 環境変数を直接指定（ワンライナー）

```bash
# 開発サーバー
PORT=3001 npm run dev

# 本番サーバー
PORT=3000 npm run start
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
