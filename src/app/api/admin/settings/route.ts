import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { setSetting } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  if (data.admin_email) {
    await setSetting("admin_email", data.admin_email);
  }
  if (data.session_days != null) {
    const days = parseInt(data.session_days, 10);
    if (isNaN(days) || days < 1 || days > 30) {
      return NextResponse.json(
        { error: "session_days must be between 1 and 30" },
        { status: 400 }
      );
    }
    await setSetting("session_days", String(days));
  }
  if (data.author_name !== undefined) {
    await setSetting("author_name", data.author_name);
  }
  if (data.business_name !== undefined) {
    await setSetting("business_name", data.business_name);
  }

  return NextResponse.json({ ok: true });
}
