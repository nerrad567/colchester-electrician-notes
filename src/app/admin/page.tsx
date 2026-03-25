import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getSession();

  if (!session) {
    return <LoginForm error={error} />;
  }

  const { AdminDashboard } = await import("./AdminDashboard");
  return <AdminDashboard email={session} />;
}
