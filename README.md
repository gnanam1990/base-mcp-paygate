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
5. Ship analytics dashboard, demo content, docs, Sepolia test, and Base mainnet launch.

## Repository Status
This repository is public from day one. It now includes the first usable Next.js foundation: dashboard UI, creator publishing console, reader paywall flow, x402-shaped content endpoints, and a PayGate MCP tool endpoint.

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

The paid full-content endpoint returns a 402 response until a demo payment header is sent. Real x402 facilitator verification is the next payment milestone.

## Current UI Routes
- `/` creator operations dashboard and content inventory.
- `/creator` draft, inventory, and publish workspace.
- `/content/:slug` reader preview and paid unlock demo.

## License
MIT
