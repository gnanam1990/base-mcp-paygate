import { NextResponse } from "next/server";
import { findContentBySlug } from "@/lib/paygate-store";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = findContentBySlug(slug);

  if (!item) {
    return NextResponse.json({ error: "content_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    data: item,
  });
}
