import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, createSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/admin?error=missing-token", req.url));
  }

  const email = await verifyMagicLinkToken(token);

  if (!email) {
    return NextResponse.redirect(new URL("/admin?error=invalid-token", req.url));
  }

  await createSession(email);
  return NextResponse.redirect(new URL("/admin", req.url));
}
