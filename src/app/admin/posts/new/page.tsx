import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PostEditor } from "../PostEditor";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  return <PostEditor />;
}
