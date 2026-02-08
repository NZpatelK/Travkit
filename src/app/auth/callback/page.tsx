"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      try {
        // Supabase automatically stores the session after redirect
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("No session found:", error?.message);
          router.replace("/login");
          return;
        }

        // Session exists, redirect
        router.replace("/dashboard");
      } catch (err) {
        console.error("Unexpected auth error:", err);
        router.replace("/login");
      }
    }

    handleAuth();
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0F1A] via-[#0E1325] to-[#0B0F1A] px-4">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 rounded-2xl bg-white/5 p-8 shadow-xl ring-1 ring-white/10 backdrop-blur">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-sky-400 border-b-transparent border-l-transparent border-r-transparent"></div>
        <p className="text-center text-gray-300">Loading your dashboard...</p>
      </div>
    </main>
  );
}
