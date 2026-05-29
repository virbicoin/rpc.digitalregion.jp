# rpc.digitalregion.jp

VirBiCoin RPC node status dashboard built with Next.js.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | TypeScript type check |

## Port Configuration

デフォルトは3000番ポートです。変更するには環境変数を使用：

```bash
# .env or .env.local
PORT=4000
```

または直接指定：

```bash
PORT=4000 npm start
```

## Production Deployment

```bash
npm run build
PORT=4000 npm start
```

Nginx等のリバースプロキシ経由で運用する想定です。

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org) 6
- [Tailwind CSS](https://tailwindcss.com) 4
- [ESLint](https://eslint.org) 10
