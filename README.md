# PayGate

x402 content paywalls for creators and AI agents.

**Status:** Frontend/API foundation in progress.

PayGate lets creators publish premium reports or articles behind x402. Human users and AI agents can preview content, pay in USDC on Base, unlock the full piece, and receive a verifiable access receipt.

## Why It Exists
Base MCP gives AI assistants access to Base Account actions such as balances, sends, swaps, contract calls, and x402 payments, with user approval for writes. This project turns that capability into a focused product for writers, researchers, analysts, AI agents, and readers who want pay-per-piece premium content.

## Core Capabilities
- Creator dashboard for publishing, pricing, revenue, and access logs.
- Reader experience with preview, payment-required unlock, and receipt display.
- x402-gated content API for paid full-text access.
- MCP tools for search, preview, purchase initiation, and creator analytics.
- Base Account approval flow for paid requests and future creator actions.

## Roadmap Snapshot
1. Scaffold Next.js frontend, API service, database schema, and shared UI shell.
2. Implement creator publish/edit flow with draft and published states.
3. Add x402-protected full content endpoint and paid reader unlock flow.
4. Build PayGate MCP plugin spec and tool handlers for search, preview, and paid access.
5. Ship analytics dashboard, demo content, docs, Base mainnet verification, and Base mainnet launch.

## Repository Status
This repository is public from day one. It now includes a usable Next.js foundation: dashboard UI, creator publishing console, durable local storage, reader paywall flow, x402 facilitator-ready content endpoints, receipt logging, and a PayGate MCP tool endpoint.

## Local Development
```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Current Demo Endpoints
- `GET /api/paygate/content`
- `GET /api/paygate/content/:slug/preview`
- `GET /api/paygate/content/:slug/full`
- `GET /api/paygate/creator/:address/stats`
- `GET /api/mcp/paygate`
- `POST /api/mcp/paygate`

The paid full-content endpoint returns a 402 response until a payment header is sent. Local development accepts `x-demo-payment: accepted` while `PAYGATE_PAYMENT_MODE` is `demo`; strict deployments should set `PAYGATE_PAYMENT_MODE=strict` and `X402_FACILITATOR_URL`.

## Persistence And Payments
- Durable local state is stored at `.data/paygate-db.json` by default.
- Set `PAYGATE_DATA_FILE` to move storage elsewhere.
- Submitted `x-payment` payloads are verified and settled through `X402_FACILITATOR_URL` when configured.
- Successful unlocks append receipt records and update creator stats.

## Checks
```bash
npm run typecheck
npm run build
PAYGATE_BASE_URL=http://127.0.0.1:3000 npm run test:smoke
```

## Current UI Routes
- `/` creator operations dashboard and content inventory.
- `/creator` draft, inventory, and publish workspace.
- `/content/:slug` reader preview and paid unlock demo.

## License
MIT
