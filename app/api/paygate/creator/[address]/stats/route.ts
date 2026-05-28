import { NextResponse } from "next/server";
import { getCreatorStats } from "@/lib/paygate-store";

type RouteContext = {
  params: Promise<{
    address: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params;

  return NextResponse.json({
    data: {
      address,
      ...getCreatorStats(address),
    },
  });
}
