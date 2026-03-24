import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSetting } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  const adminEmail = (await getSetting("admin_email").catch(() => null)) ?? process.env.ADMIN_EMAIL ?? "";
  const sessionDays = (await getSetting("session_days").catch(() => null)) ?? "7";

  return (
    <div className="mx-auto max-w-[600px] px-6 py-8">
      <a href="/admin" className="text-[0.78rem] text-muted hover:text-text transition-colors">
        &larr; Back to admin
      </a>
      <h1 className="mt-4 mb-6 text-xl font-bold text-text">Settings</h1>
      <SettingsForm currentEmail={adminEmail} currentSessionDays={sessionDays} />
    </div>
  );
}
