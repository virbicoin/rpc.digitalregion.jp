# rpc.digitalregion.jp

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![License](https://img.shields.io/github/license/virbicoin/rpc.digitalregion.jp)](LICENSE)

VirBiCoin RPC ノードステータスダッシュボード — 暗号通貨ノードの稼働状況をリアルタイムで表示し、JSON-RPC プロキシエンドポイントを提供する Web アプリケーションです。

## Features

- 🖥️ **ノードステータス表示** — ブロック高、接続数、バージョン情報をリアルタイム取得
- 🌐 **JSON-RPC プロキシ** — POST リクエストを VirBiCoin ノードへ中継
- 🌙 **ダーク/ライトテーマ** — システム設定に連動、手動切替対応
- ⚡ **高速レンダリング** — Next.js App Router + Turbopack
- 📱 **レスポンシブ** — モバイル対応のダッシュボード UI

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/virbicoin/rpc.digitalregion.jp.git
cd rpc.digitalregion.jp
npm install
```

### Development

```bash
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

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/nodes` | GET | 全ノードのステータス一覧 |
| `/api/nodes/:name` | GET | 特定ノードのステータス |
| `/health` | GET | ヘルスチェック |
| `/` | POST | JSON-RPC プロキシ (Nginx経由) |

## Project Structure

```
app/
├── page.tsx              # メインダッシュボード
├── layout.tsx            # ルートレイアウト
├── globals.css           # Tailwind グローバルスタイル
├── api/
│   └── nodes/            # ノードステータス API
│       ├── route.ts      # GET /api/nodes
│       ├── data.ts       # ノード設定データ
│       └── [NODE_NAME]/
│           └── route.ts  # GET /api/nodes/:name
├── components/           # React コンポーネント
│   ├── Header.tsx        # ヘッダー
│   ├── NodeStatus.tsx    # ノードステータス表示
│   ├── ConnectionInfo.tsx# 接続情報
│   ├── SecurityInfo.tsx  # セキュリティ情報
│   ├── UsageGuide.tsx    # 使い方ガイド
│   ├── ThemeProvider.tsx # テーマプロバイダ
│   └── ThemeToggle.tsx   # テーマ切替ボタン
└── health/
    └── route.ts          # ヘルスチェック
```

## Configuration

### Port

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

### Nginx リバースプロキシ設定例

```nginx
server {
    server_name rpc.example.com;

    # _next/ 静的アセットを Next.js へプロキシ
    location /_next/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
    }

    location / {
        # JSON-RPC (POST) → VirBiCoin ノード
        if ($request_method = POST) {
            proxy_pass http://127.0.0.1:8329;
            break;
        }
        # GET → Next.js ダッシュボード
        proxy_pass http://127.0.0.1:4000$request_uri;
        proxy_set_header Host $host;
    }
}
```

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org) 6
- [Tailwind CSS](https://tailwindcss.com) 4
- [ESLint](https://eslint.org) 10

## License

See [LICENSE](LICENSE) for details.
