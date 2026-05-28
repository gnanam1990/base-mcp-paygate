import { NextResponse } from "next/server";
import { publishContent } from "@/lib/paygate-store";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const body = (await request.json()) as { status?: string };

  if (body.status !== "Published") {
    return NextResponse.json({ error: "unsupported_status" }, { status: 400 });
  }

  const report = publishContent(slug);
  if (!report) {
    return NextResponse.json({ error: "content_not_found" }, { status: 404 });
  }

  return NextResponse.json({ data: report });
}
