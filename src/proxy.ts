import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

// Optimistic check: keeps unauthenticated visitors out of /admin. Each admin
// page/action also calls verifyAdminSession() itself as the real gate — see
// the Data Access Layer pattern in the Next.js authentication guide.
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
