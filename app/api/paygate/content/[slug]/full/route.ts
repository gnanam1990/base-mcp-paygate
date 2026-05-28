import { NextResponse } from "next/server";
import { paymentRequiredBody, verifyPayment } from "@/lib/x402-payment";
import { findContentBySlug, recordPaidUnlock } from "@/lib/paygate-store";

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

  const resourceUrl = new URL(`/api/paygate/content/${item.slug}/full`, request.url).toString();
  const verification = await verifyPayment(request, item, resourceUrl);

  if (!verification.ok) {
    const body = paymentRequiredBody(item, resourceUrl);
    const response = NextResponse.json({ ...body, reason: verification.reason }, { status: 402 });
    response.headers.set("x-paygate-payment-reason", verification.reason);
    return response;
  }

  const receipt = recordPaidUnlock(item.slug, {
    network: verification.network,
    paymentMode: verification.mode,
    paymentPayloadHash: verification.paymentPayloadHash,
    facilitatorReference: verification.facilitatorReference,
    payerAddress: verification.payerAddress,
  });

  const response = NextResponse.json({
    data: {
      slug: item.slug,
      title: item.title,
    },
    fullContent: item.fullContent,
    receipt,
  });

  if (verification.paymentResponse) {
    response.headers.set("payment-response", verification.paymentResponse);
  }

  return response;
}
