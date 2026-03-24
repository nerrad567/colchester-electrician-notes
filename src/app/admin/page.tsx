import { getSession } from "@/lib/auth";
import { getSetting } from "@/lib/db";
import { LoginForm } from "./LoginForm";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getSession();

  if (!session) {
    // Get masked email for display
    const adminEmail =
      (await getSetting("admin_email").catch(() => null)) ??
      process.env.ADMIN_EMAIL ??
      "";

    const [local, domain] = adminEmail.split("@") ?? ["", ""];
    const masked = adminEmail
      ? `${local[0]}${"*".repeat(Math.max(local.length - 2, 1))}${local.slice(-1)}@${domain}`
      : "not configured";

    return <LoginForm maskedEmail={masked} error={error} />;
  }

  return <AdminDashboard email={session} />;
}
