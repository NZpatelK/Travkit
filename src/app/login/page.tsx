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
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-3xl font-medium text-white text-center">
          Welcome TravKit
        </h1>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-white
                       placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-white py-2.5 text-sm font-medium text-neutral-900
                       hover:bg-neutral-200 transition"
          >
            Continue
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-xs text-neutral-400">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
