import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyEmailChangeToken } from "@/lib/auth";
import { setSetting } from "@/lib/db";

export async function GET(req: NextRequest) {
  // Must be logged in to confirm email change
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin?error=not-logged-in", req.url));
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/admin/settings?error=missing-token", req.url));
  }

  const newEmail = await verifyEmailChangeToken(token);
  if (!newEmail) {
    return NextResponse.redirect(new URL("/admin/settings?error=invalid-token", req.url));
  }

  await setSetting("admin_email", newEmail);
  return NextResponse.redirect(new URL("/admin/settings?success=email-updated", req.url));
}
