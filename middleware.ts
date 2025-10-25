import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  // Initialize a Supabase client using service URL + anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get the user's session token from cookies
  const token = req.cookies.get("sb-access-token")?.value;

  // If no token, redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optionally, validate the token
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow access if authenticated
  return NextResponse.next();
}

// Protect only certain routes
export const config = {
  matcher: ["/dashboard/:path*"], // Add more paths as needed
};
