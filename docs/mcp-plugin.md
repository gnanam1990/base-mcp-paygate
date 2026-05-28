# PayGate MCP Plugin

## Server
- Local endpoint: `GET /api/mcp/paygate`
- Tool execution: `POST /api/mcp/paygate`
- Payment resource: `GET /api/paygate/content/:slug/full`

## Tools
| Tool | Purpose |
| --- | --- |
| `search_paygate_content` | Search published paid reports by topic, title, creator, or preview text. |
| `get_paygate_preview` | Return the free preview and pricing metadata for one report. |
| `get_paygate_purchase_url` | Return the x402-protected resource URL, network, and price for a report. |
| `get_paygate_creator_stats` | Return creator revenue, unlock count, and publication totals. |

## Example Tool Call
```json
{
  "tool": "search_paygate_content",
  "arguments": {
    "query": "agent"
  }
}
```

## Payment Pattern
The full-content endpoint returns `402` without a payment header. In the current demo build, `x-demo-payment: accepted` unlocks premium content so the product flow can be tested before facilitator verification is wired in.

Production x402 integration must replace the demo header with facilitator-backed payment verification and receipt persistence.
