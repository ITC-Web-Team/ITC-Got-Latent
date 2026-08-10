import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "itc_session";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get(SESSION_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only guards the root rating page — /login, the API routes, and the
// unlisted analytics page are intentionally left out.
export const config = {
  matcher: ["/"],
};
