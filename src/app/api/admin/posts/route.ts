import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllPostsFromDB, upsertPost, deletePost } from "@/lib/db";

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const posts = await getAllPostsFromDB();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const data = await req.json();

  if (!data.slug || !data.title) {
    return NextResponse.json(
      { error: "slug and title are required" },
      { status: 400 }
    );
  }

  // Sanitise slug
  const slug = data.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const result = await upsertPost({
    slug,
    title: data.title ?? "",
    kicker: data.kicker ?? "",
    excerpt: data.excerpt ?? "",
    body: data.body ?? "",
    tech_note: data.tech_note ?? "",
    read_time: data.read_time ?? "",
    published: data.published ?? false,
  });

  return NextResponse.json(result[0] ?? { ok: true });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  await deletePost(slug);
  return NextResponse.json({ ok: true });
}
