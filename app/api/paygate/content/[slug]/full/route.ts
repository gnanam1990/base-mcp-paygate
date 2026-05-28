import { NextResponse } from "next/server";
import { findContentBySlug } from "@/lib/paygate-data";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = findContentBySlug(slug);

  if (!item) {
    return NextResponse.json({ error: "content_not_found" }, { status: 404 });
  }

  const demoPayment = request.headers.get("x-demo-payment");
  const xPayment = request.headers.get("x-payment");

  if (!demoPayment && !xPayment) {
    return NextResponse.json(
      {
        error: "payment_required",
        x402Version: 1,
        description: `Unlock ${item.title} for ${item.priceUsdc.toFixed(2)} USDC on Base Sepolia.`,
        accepts: [
          {
            scheme: "exact",
            network: "base-sepolia",
            asset: "USDC",
            amount: item.priceUsdc.toFixed(2),
            payTo: item.creatorAddress,
            resource: `/api/paygate/content/${item.slug}/full`,
          },
        ],
      },
      { status: 402 },
    );
  }

  return NextResponse.json({
    data: {
      slug: item.slug,
      title: item.title,
    },
    fullContent: item.fullContent,
    receipt: {
      id: `paygate-demo-${item.slug}-${Date.now()}`,
      network: "base-sepolia",
      amount: item.priceUsdc.toFixed(2),
      asset: "USDC",
      creator: item.creatorAddress,
    },
  });
}
