import { NextResponse } from "next/server";
import { getSetting } from "@/lib/db";
import { createMagicLinkToken, sendMagicLink } from "@/lib/auth";

export async function POST() {
  try {
    // Get admin email from DB settings, fall back to env var
    const adminEmail =
      (await getSetting("admin_email").catch(() => null)) ??
      process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin email not configured" },
        { status: 500 }
      );
    }

    const token = await createMagicLinkToken(adminEmail);
    await sendMagicLink(adminEmail, token);

    // Return masked email for UI display
    const [local, domain] = adminEmail.split("@");
    const masked = `${local[0]}${"*".repeat(Math.max(local.length - 2, 1))}${local.slice(-1)}@${domain}`;

    return NextResponse.json({ sent: true, email: masked });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to send login link" },
      { status: 500 }
    );
  }
}
