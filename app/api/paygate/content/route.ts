import { NextResponse } from "next/server";
import { createDraft, listPublishedContent } from "@/lib/paygate-store";

export function GET() {
  return NextResponse.json({
    data: listPublishedContent(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    title?: string;
    category?: string;
    priceUsdc?: number;
    preview?: string;
    fullContent?: string;
  };

  const draft = createDraft({
    title: body.title?.trim() || "Untitled PayGate report",
    category: body.category?.trim() || "Research",
    priceUsdc: Number.isFinite(body.priceUsdc) ? Number(body.priceUsdc) : 0.1,
    preview: body.preview?.trim() || "Draft preview pending.",
    fullContent: body.fullContent?.trim() || "Draft premium content pending.",
  });

  return NextResponse.json({ data: draft }, { status: 201 });
}
