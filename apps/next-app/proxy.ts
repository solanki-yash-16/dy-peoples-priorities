import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const isAuthenticated = verifySession(token || "");

  const dashboardPaths = ["/(dashboard)"];
  const authPath = "/(auth)/login";

  if (dashboardPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(authPath, request.url));
    }
  }

  if (request.nextUrl.pathname === authPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(dashboard)", "/(auth)/login"],
};
