"use client";

import { useEffect } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error("Auth error:", error);
        router.replace("/login");
      } else {
        router.replace("/listTravel");
      }
    }
    handleAuth();
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Verifying your session...</p>
    </main>
  );
}
