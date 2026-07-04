import { submissions } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: submissions });
}

export async function POST() {
  return NextResponse.json({ message: "Not implemented in demo" }, { status: 501 });
}
