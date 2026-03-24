import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPostBySlug } from "@/lib/db";
import { PostEditor } from "../PostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) redirect("/admin");

  return (
    <PostEditor
      initial={{
        slug: post.slug,
        title: post.title,
        kicker: post.kicker,
        excerpt: post.excerpt,
        body: post.body,
        tech_note: post.tech_note,
        read_time: post.read_time,
        published: post.published,
      }}
    />
  );
}
