import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client once (better performance)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;

  // If no token, redirect to landing page
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Validate token
  const { data: userData, error } = await supabase.auth.getUser(token);

  // If token invalid or expired, redirect to landing page and clear cookies
  if (error || !userData.user) {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    response.cookies.delete("sb-auth-token"); // Supabase sometimes sets this
    return response;
  }

  // User is authenticated -> allow access
  return NextResponse.next();
}

// Protect only dashboard routes
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
