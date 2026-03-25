import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  await destroySession();
  return NextResponse.json({ ok: true });
}
