import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

  if (!data.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = (data.slug || data.title)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const title = data.title.trim();

  const result = await upsertPost({
    slug,
    title,
    kicker: data.kicker ?? "",
    excerpt: data.excerpt ?? "",
    body: data.body ?? "",
    tech_note: data.tech_note ?? "",
    read_time: data.read_time ?? "",
    published: data.published ?? false,
  });

  revalidatePath("/", "page");
  revalidatePath(`/posts/${slug}`, "page");

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

  revalidatePath("/", "page");
  revalidatePath(`/posts/${slug}`, "page");

  return NextResponse.json({ ok: true });
}
