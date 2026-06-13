# PayGate

> An x402 content paywall for creators and AI agents — publish premium reports, gate them behind a payment, and unlock the full text after a USDC payment on Base.

![License](https://img.shields.io/badge/license-MIT-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)

## Overview

PayGate is a Next.js application that lets creators publish premium reports behind an x402 paywall. Readers (human or AI agent) can browse free previews, then unlock the full content by paying in USDC on Base. The protected content endpoint answers with an HTTP 402 challenge until a valid payment is presented; successful unlocks append a receipt and update creator analytics. A small MCP tool endpoint exposes search, preview, purchase-URL, and creator-stats actions so assistants can discover and pay for content programmatically.

## Features

- Creator dashboard with revenue, paid-unlock counts, published/draft totals, and recent activity.
- Creator workspace to draft, price, and publish reports (drafts start unlisted, then move to Published).
- x402-gated full-content endpoint that returns a 402 payment challenge and unlocks on valid payment.
- Two payment modes: a `demo` mode that accepts an `x-demo-payment` header for local testing, and a facilitator mode that verifies and settles an `x-payment` payload against an external x402 facilitator. The facilitator path fails closed — a payment is accepted only when no rejection signal is present in the verify/settle responses.
- Receipt logging on every unlock (asset, network, payer, payment mode, payload hash, facilitator reference) with revenue and unlock counters updated per report.
- MCP tool endpoint (`/api/mcp/paygate`) with `search_paygate_content`, `get_paygate_preview`, `get_paygate_purchase_url`, and `get_paygate_creator_stats`.
- Durable JSON-file persistence with seeded demo content; storage location is configurable.

## Tech stack

- **Framework:** Next.js 16 (App Router, route handlers)
- **UI:** React 19, lucide-react icons, CSS in `app/globals.css`
- **Language:** TypeScript 5.9
- **Payments:** x402 payment challenge/verification (`lib/x402-payment.ts`), USDC on Base
- **Persistence:** local JSON file (no external database required to run)

## Architecture

- `app/` — Next.js App Router. UI pages (`/`, `/creator`, `/content/[slug]`) and API route handlers under `app/api/`.
- `lib/x402-payment.ts` — builds the x402 payment requirement / 402 body and verifies payments (demo header or facilitator verify+settle).
- `lib/paygate-store.ts` — durable store: read/write the JSON db, list/find content, create drafts, publish, record paid unlocks, and compute creator stats.
- `lib/paygate-data.ts` — seed content, type definitions, and formatting helpers.
- `scripts/smoke-test.mjs` — end-to-end smoke test against a running server.
- `docs/` — architecture, roadmap, MCP plugin, and demo-script notes.

## Getting started

### Prerequisites

- Node.js 18+ (Next.js 16 / React 19)
- npm

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and set the values you need. All variables are optional for local `demo` mode. Names and purpose only — never commit real secrets.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_CHAIN_ID` | Base chain id exposed to the client (e.g. `8453`). |
| `BASE_RPC_URL` | Base RPC endpoint. |
| `BASE_ACCOUNT_CLIENT_ID` | Base Account client identifier. |
| `BASE_MCP_URL` | Base MCP server URL. |
| `X402_FACILITATOR_URL` | x402 facilitator base URL used for `/verify` and `/settle` (required for facilitator-mode payments). |
| `X402_RECEIVING_ADDRESS` | Address that receives payments; falls back to the content's creator address. |
| `X402_DEFAULT_NETWORK` | Default x402 network label. |
| `PAYGATE_PAYMENT_MODE` | `demo` (default) accepts the `x-demo-payment` header; `strict` disables the demo path. |
| `PAYGATE_X402_NETWORK` | Network id used in payment challenges (default `eip155:8453`). |
| `PAYGATE_DATA_FILE` | Override path for the JSON data file (default `.data/paygate-db.json`, or `/tmp` on Vercel). |
| `DATABASE_URL` | Reserved for future database use. |
| `REDIS_URL` | Reserved for future cache/queue use. |
| `NEXT_PUBLIC_APP_URL` | Public app URL. |

### Running

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.

Production build / start:

```bash
npm run build
npm run start
```

## Usage

### UI routes

- `/` — creator operations dashboard (revenue, unlocks, content inventory, recent activity).
- `/creator` — draft, price, and publish workspace.
- `/content/[slug]` — reader preview with a paid unlock panel.

### API endpoints

- `GET /api/paygate/content` — list published content.
- `POST /api/paygate/content` — create a draft (`title`, `category`, `priceUsdc`, `preview`, `fullContent`); returns 201.
- `GET /api/paygate/content/[slug]/preview` — free preview for a report.
- `PATCH /api/paygate/content/[slug]` — publish a draft (body `{ "status": "Published" }`).
- `GET /api/paygate/content/[slug]/full` — paid full content. Returns 402 with an x402 challenge until a valid payment is presented.
- `GET /api/paygate/creator/[address]/stats` — creator analytics for an address.
- `GET /api/mcp/paygate` — MCP server descriptor and tool list.
- `POST /api/mcp/paygate` — invoke an MCP tool (`{ "tool": "...", "arguments": { ... } }`).

### Unlocking content

In `demo` mode, send a demo header to unlock:

```bash
curl -H "x-demo-payment: accepted" http://127.0.0.1:3000/api/paygate/content/base-agent-commerce-map/full
```

In facilitator mode (`PAYGATE_PAYMENT_MODE=strict` with `X402_FACILITATOR_URL` set), send an `x-payment` payload; PayGate verifies and settles it through the facilitator before returning the content and a receipt.

## Testing

A smoke test exercises the content list, draft creation, publish, the 402 challenge, a demo unlock, and the MCP search tool against a running server:

```bash
# In one terminal:
npm run dev
# In another:
PAYGATE_BASE_URL=http://127.0.0.1:3000 npm run test:smoke
```

Type checking:

```bash
npm run typecheck
```

## Project structure

```
app/
  api/
    mcp/paygate/route.ts                     MCP descriptor + tool dispatch
    paygate/content/route.ts                 list / create content
    paygate/content/[slug]/route.ts          publish (PATCH)
    paygate/content/[slug]/preview/route.ts  free preview
    paygate/content/[slug]/full/route.ts     x402-gated full content
    paygate/creator/[address]/stats/route.ts creator analytics
  content/[slug]/                            reader preview + unlock panel
  creator/                                   draft/publish workspace
  page.tsx                                   creator dashboard
lib/
  x402-payment.ts                            payment challenge + verification
  paygate-store.ts                           durable JSON store
  paygate-data.ts                            seed content + helpers
scripts/smoke-test.mjs                       end-to-end smoke test
docs/                                        architecture, roadmap, MCP, demo notes
```

## Status

Early MVP / preview. The Next.js foundation is functional: dashboard and creator UI, durable JSON-file storage, the reader paywall flow, x402 facilitator-ready content endpoints, receipt logging, and the MCP tool endpoint all work locally.

Honest caveats:

- Persistence is a local JSON file, not a hosted database; `DATABASE_URL` and `REDIS_URL` are reserved but unused.
- `demo` payment mode is for local testing only; real payment verification requires a configured `X402_FACILITATOR_URL` and `PAYGATE_PAYMENT_MODE=strict`.
- Seed content and creator addresses are placeholder/demo data.
- No CI workflow or unit-test suite yet (only the smoke test described above).

## License

MIT — see [LICENSE](LICENSE).
