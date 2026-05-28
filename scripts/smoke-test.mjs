const baseUrl = process.env.PAYGATE_BASE_URL ?? "http://127.0.0.1:3000";

async function readJson(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const body = await response.json();
  return { response, body };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const content = await readJson("/api/paygate/content");
  assert(content.response.ok, "content list should return 200");
  assert(content.body.data.length >= 4, "content list should include seeded reports");

  const slug = content.body.data[0].slug;
  const locked = await readJson(`/api/paygate/content/${slug}/full`);
  assert(locked.response.status === 402, "full content should require payment");
  assert(locked.body.accepts[0].network === "base-sepolia", "payment challenge should target Base Sepolia");

  const unlocked = await readJson(`/api/paygate/content/${slug}/full`, {
    headers: {
      "x-demo-payment": "accepted",
    },
  });
  assert(unlocked.response.ok, "demo payment should unlock content");
  assert(unlocked.body.receipt.asset === "USDC", "unlock receipt should be denominated in USDC");

  const mcp = await readJson("/api/mcp/paygate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tool: "search_paygate_content",
      arguments: {
        query: "agent",
      },
    }),
  });
  assert(mcp.response.ok, "MCP search tool should return 200");
  assert(mcp.body.data.length > 0, "MCP search should return matching content");

  console.log(`PayGate smoke checks passed against ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
