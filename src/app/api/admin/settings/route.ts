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
  if (data.session_days) {
    await setSetting("session_days", data.session_days);
  }

  return NextResponse.json({ ok: true });
}
