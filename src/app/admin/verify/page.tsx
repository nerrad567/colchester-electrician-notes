import { redirect } from "next/navigation";
import { verifyMagicLinkToken, createSession } from "@/lib/auth";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/admin?error=missing-token");
  }

  const email = await verifyMagicLinkToken(token);

  if (!email) {
    redirect("/admin?error=invalid-token");
  }

  await createSession(email);
  redirect("/admin");
}
