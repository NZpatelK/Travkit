"use client";

import { useState } from "react";
import { supabase } from "@/app/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Sending link…");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setMessage(error.message);
    else setMessage("Check your email ✉️");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0F1A] via-[#0E1325] to-[#0B0F1A] px-4">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/5 p-8 shadow-xl ring-1 ring-white/10 backdrop-blur">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-white">
          Welcome to <span className="text-sky-400">TravKit</span>
        </h1>

        <p className="mt-2 text-center text-sm text-gray-400">
          Sign in to access your travel checklist
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-white/15 bg-transparent py-2 text-sm text-white
                       placeholder:text-gray-500 focus:border-sky-400 focus:outline-none transition"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white
                       shadow-lg shadow-sky-600/30 transition hover:bg-sky-500
                       focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2
                       focus:ring-offset-[#0B0F1A]"
          >
            Continue
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-xs text-gray-400">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
