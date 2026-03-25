import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { getSetting, storeMagicToken, consumeMagicToken, pruneExpiredTokens } from "./db";

const SECRET = () => {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET not set");
  return new TextEncoder().encode(s);
};

// ─── Magic Link ──────────────────────────────────────────────────────────────

/** Generate a signed magic link token (15 min expiry, single-use via JTI) */
export async function createMagicLinkToken(email: string) {
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await storeMagicToken(jti, expiresAt);

  // Opportunistically prune expired tokens
  pruneExpiredTokens().catch(() => {});

  return new SignJWT({ email, purpose: "magic-link", jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(SECRET());
}

/** Verify and decode a magic link token (single-use: consumes the token) */
export async function verifyMagicLinkToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET());
    if (payload.purpose !== "magic-link") return null;

    // Enforce single-use via JTI
    const jti = payload.jti;
    if (!jti) return null;

    const consumed = await consumeMagicToken(jti);
    if (!consumed) return null;

    return payload.email as string;
  } catch {
    return null;
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

const SESSION_COOKIE = "admin_session";

/** Create a session cookie after successful magic link verification */
export async function createSession(email: string) {
  // Get configurable session length from DB, default 7 days
  const daysStr = await getSetting("session_days").catch(() => null);
  const days = parseInt(daysStr ?? "7", 10) || 7;

  const token = await new SignJWT({ email, purpose: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(SECRET());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: days * 86400,
  });
}

/** Check if the current request has a valid session */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET());
    if (payload.purpose !== "session") return null;
    return payload.email as string;
  } catch {
    return null;
  }
}

/** Destroy the session */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ─── Email ───────────────────────────────────────────────────────────────────

/** Send a magic login link via Migadu SMTP */
export async function sendMagicLink(email: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${siteUrl}/api/admin/verify?token=${token}`;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.migadu.com",
    port: parseInt(process.env.SMTP_PORT ?? "465", 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: email,
    subject: "Your admin login link",
    text: `Click this link to log in to your site admin:\n\n${link}\n\nThis link expires in 15 minutes. If you didn't request this, ignore this email.`,
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 2rem;">
        <h2 style="color: #fbbf24; font-size: 1rem;">Admin Login</h2>
        <p style="color: #e5e7eb; line-height: 1.6;">Click the button below to log in to your site admin panel.</p>
        <a href="${link}" style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); color: #111827; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0;">Log in</a>
        <p style="color: #a1a1aa; font-size: 0.85rem; margin-top: 1.5rem;">This link expires in 15 minutes.<br>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

// ─── Email Change ────────────────────────────────────────────────────────────

/** Generate a token to confirm email change */
export async function createEmailChangeToken(newEmail: string) {
  return new SignJWT({ email: newEmail, purpose: "email-change" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET());
}

/** Verify email change token */
export async function verifyEmailChangeToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET());
    if (payload.purpose !== "email-change") return null;
    return payload.email as string;
  } catch {
    return null;
  }
}
