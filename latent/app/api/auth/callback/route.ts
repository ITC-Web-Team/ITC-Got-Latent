import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookieName } from "@/lib/session";
import { fetchSsoUser } from "@/lib/sso";

export async function GET(request: NextRequest) {
  const baseUrl =
    process.env.APP_URL ??
    `https://${request.headers.get("x-forwarded-host") ?? request.headers.get("host")}`;

  const accessId = request.nextUrl.searchParams.get("accessid");

  if (!accessId) {
    return NextResponse.redirect(new URL("/login?error=missing_accessid", baseUrl));
  }

  try {
    const ssoUser = await fetchSsoUser(accessId);
    const branch = ssoUser.department || "Unknown";

    const user = await prisma.user.upsert({
      where: { rollNo: ssoUser.roll },
      update: { name: ssoUser.name, branch },
      create: { rollNo: ssoUser.roll, name: ssoUser.name, branch },
    });

    const sessionToken = await createSessionToken({
      userId: user.id,
      rollNo: user.rollNo,
      name: user.name,
      branch: user.branch,
      isVerified: user.isVerified,
    });

    // Land back on the rating form, not a hardcoded external host.
    const response = NextResponse.redirect(new URL("/", baseUrl));

    response.cookies.set(sessionCookieName(), sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("SSO callback error:", error);
    return NextResponse.redirect(new URL("/login?error=sso_failed", baseUrl));
  }
}
