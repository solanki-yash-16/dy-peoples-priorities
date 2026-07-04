import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.match(/session=([^;]+)/)?.[1];
  const authenticated = typeof token === "string" ? verifySession(token) : false;

  return NextResponse.json({ authenticated });
}
