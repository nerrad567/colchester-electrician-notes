import { NextRequest, NextResponse } from "next/server";
import { getSetting } from "@/lib/db";
import { createMagicLinkToken, sendMagicLink } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!(await rateLimit(`login:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
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

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Login error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to send login link" },
      { status: 500 }
    );
  }
}
