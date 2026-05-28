# PayGate Architecture

## Product Role
PayGate lets creators publish premium reports or articles behind x402. Human users and AI agents can preview content, pay in USDC on Base, unlock the full piece, and receive a verifiable access receipt.

## System Shape
- Frontend app: Next.js App Router, TypeScript, responsive CSS, and lucide icons.
- API layer: Node/TypeScript endpoints for product reads, prepare flows, analytics, and x402-gated access.
- Base layer: Base Account for user approval and Base MCP for assistant-driven actions.
- Payment layer: x402 for paid API/content/service access using USDC on Base or Base Sepolia.
- Data layer: PostgreSQL for durable product state and Redis for cache/session/rate-limit workloads.
- Contracts: Solidity/Foundry only where the module needs onchain state or settlement logic.

## Main Modules
- Creator dashboard for publishing, pricing, revenue, and access logs.
- Reader experience with preview, payment-required unlock, and receipt display.
- x402-gated content API for paid full-text access.
- MCP tools for search, preview, purchase initiation, and creator analytics.
- Base Account approval flow for paid requests and future creator actions.

## Data Model
- Creator profiles keyed by Base Account address.
- Content items with preview text, encrypted or gated full text, price, category, and publication state.
- x402 receipts, access grants, payment references, and request metadata.
- Analytics for reads, paid unlocks, conversion, and creator earnings.

## MCP And x402 Pattern
Every write action should be exposed as a prepare endpoint that returns unsigned calldata or a payment request. MCP/plugin documentation must explain onboarding, read endpoints, prepare endpoints, and the mapping into Base MCP actions.

For paid resources, endpoints should return an x402 payment requirement before serving premium data. The app must enforce a user-defined max payment cap and record receipts for analytics and support.

## Current Foundation
- `/` renders the creator operations dashboard and premium content inventory.
- `/creator` supports local draft creation, inventory inspection, and publish-state transitions.
- `/content/:slug` renders the reader preview and demo unlock flow.
- `GET /api/paygate/content` returns public content inventory.
- `GET /api/paygate/content/:slug/preview` returns one free preview.
- `GET /api/paygate/content/:slug/full` returns a 402 challenge without payment headers and demo premium content with `x-demo-payment: accepted`.
- `GET /api/mcp/paygate` returns the current PayGate MCP tool list.
- `POST /api/mcp/paygate` handles search, preview, purchase URL, and creator stats tool calls.

## Safety Defaults
- Base Sepolia first, then Base mainnet.
- No private keys in app config.
- No hidden approvals or auto-execution.
- Clear user review before paid access or onchain writes.
- Placeholder env vars only in committed files.
