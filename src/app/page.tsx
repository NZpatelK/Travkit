"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "./utils/supabase/client";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.replace("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0F1A] via-[#0E1325] to-[#0B0F1A] px-6">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-500/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-sm font-medium text-violet-300 ring-1 ring-white/10 backdrop-blur">
          ✈️ Travel checklist made simple
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Pack smarter. <br className="hidden sm:block" />
          Travel with confidence.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-gray-400">
          <span className="font-semibold text-gray-200">TravKit</span> keeps all
          your travel checklists in one place — so you never forget essentials,
          documents, or last-minute items again.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleLogin}
            className="rounded-xl bg-violet-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#0B0F1A]"
          >
            Get started
          </button>

          <span className="text-sm text-gray-500">
            Sign in to access your travel dashboard
          </span>
        </div>
      </section>
    </main>
  );
}
