import { NextResponse } from "next/server";
import { nodes } from "./data";

export async function GET() {
  return NextResponse.json(nodes);
}
