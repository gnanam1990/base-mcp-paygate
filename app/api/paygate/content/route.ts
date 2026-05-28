import { NextResponse } from "next/server";
import { publicContentItems } from "@/lib/paygate-data";

export function GET() {
  return NextResponse.json({
    data: publicContentItems(),
  });
}
