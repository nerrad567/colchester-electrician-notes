import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = () => {
  const s = process.env.AUTH_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to login and verify endpoints
  if (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/verify" ||
    pathname === "/api/admin/session"
  ) {
    return NextResponse.next();
  }

  // Allow the admin login page itself (it handles its own auth check for rendering)
  if (pathname === "/admin" && !pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // Check session cookie for all other /admin and /api/admin routes
  const token = req.cookies.get("admin_session")?.value;
  if (!token) {
    return redirectToLogin(req);
  }

  const secret = SECRET();
  if (!secret) {
    return redirectToLogin(req);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "session") {
      return redirectToLogin(req);
    }
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  // API routes get 401, pages get redirected
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin", req.url));
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path*"],
};
