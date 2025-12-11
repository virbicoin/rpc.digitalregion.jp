import { NextResponse } from "next/server";
import { nodes } from "@/app/api/nodes/data";

export async function GET() {
  return NextResponse.json(nodes);
}
