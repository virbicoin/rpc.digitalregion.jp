# CLAUDE.md

This file provides guidance for AI assistants working on this codebase.

## Project Overview

VirBiCoin RPC node status dashboard — a Next.js app that displays cryptocurrency node information and provides JSON-RPC proxy endpoints.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 10 (flat config)
- **Runtime**: Node.js

## Commands

```bash
npm run dev        # Development server (Turbopack, port 3000)
npm run build      # Production build
npm start          # Production server (port from $PORT or 3000)
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
npm run typecheck  # TypeScript type check
```

## Project Structure

```
app/
├── page.tsx              # Main dashboard page
├── layout.tsx            # Root layout
├── globals.css           # Global styles (Tailwind)
├── api/
│   └── nodes/            # Node status API endpoints
│       ├── route.ts      # GET /api/nodes
│       ├── data.ts       # Node configuration data
│       └── [NODE_NAME]/
│           └── route.ts  # GET /api/nodes/:name
├── components/           # React components
│   ├── Header.tsx
│   ├── NodeStatus.tsx
│   ├── ConnectionInfo.tsx
│   ├── SecurityInfo.tsx
│   ├── UsageGuide.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
└── health/
    └── route.ts          # Health check endpoint
```

## Coding Conventions

- Use `type` imports: `import type { Foo } from "bar"`
- Path alias: `@/*` maps to project root
- Components are in `app/components/`
- API routes use Next.js App Router conventions

## Deployment

- Runs behind Nginx reverse proxy on port 4000 (configured via `PORT` env var)
- POST requests are proxied to the VirBiCoin node RPC (port 8329)
- GET requests are proxied to Next.js (port 4000)
- Production: `npm run build && npm start`

## Environment Variables

- `PORT` — Server port (default: 3000, production: 4000)
