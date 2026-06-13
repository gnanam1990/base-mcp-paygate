import { NextResponse } from "next/server";
import { findContentBySlug, findPublicContentBySlug, getCreatorStats, listPublishedContent } from "@/lib/paygate-store";

const tools = [
  {
    name: "search_paygate_content",
    description: "Search published PayGate reports available for x402 unlock.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
    },
  },
  {
    name: "get_paygate_preview",
    description: "Get the free preview for one PayGate report.",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: { type: "string" },
      },
    },
  },
  {
    name: "get_paygate_purchase_url",
    description: "Return the paid x402 resource URL for a PayGate report.",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: { type: "string" },
      },
    },
  },
  {
    name: "get_paygate_creator_stats",
    description: "Return current creator analytics for PayGate.",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string" },
      },
    },
  },
];

export function GET() {
  return NextResponse.json({
    server: "paygate-mcp",
    version: "0.1.0",
    tools,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    tool?: string;
    arguments?: {
      query?: string;
      slug?: string;
      address?: string;
    };
  };

  switch (body.tool) {
    case "search_paygate_content": {
      const query = body.arguments?.query?.toLowerCase() ?? "";
      const results = listPublishedContent().filter((item) =>
        [item.title, item.creator, item.category, item.preview].some((value) =>
          value.toLowerCase().includes(query),
        ),
      );
      return NextResponse.json({ data: results });
    }
    case "get_paygate_preview": {
      const slug = body.arguments?.slug;
      const item = slug ? findPublicContentBySlug(slug) : undefined;
      if (!item) {
        return NextResponse.json({ error: "content_not_found" }, { status: 404 });
      }
      return NextResponse.json({ data: item });
    }
    case "get_paygate_purchase_url": {
      const slug = body.arguments?.slug;
      const item = slug ? findContentBySlug(slug) : undefined;
      if (!item) {
        return NextResponse.json({ error: "content_not_found" }, { status: 404 });
      }
      return NextResponse.json({
        data: {
          slug: item.slug,
          priceUsdc: item.priceUsdc,
          resource: `/api/paygate/content/${item.slug}/full`,
          network: process.env.PAYGATE_X402_NETWORK || "eip155:8453",
        },
      });
    }
    case "get_paygate_creator_stats":
      return NextResponse.json({
        data: {
          address: body.arguments?.address ?? "0xPayGateCreator",
          ...getCreatorStats(body.arguments?.address),
        },
      });
    default:
      return NextResponse.json({ error: "unknown_tool" }, { status: 400 });
  }
}
