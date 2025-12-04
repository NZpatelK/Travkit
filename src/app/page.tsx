"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "./utils/supabase/client";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login"); // client-side navigation
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.replace("/listTravel"); // redirect if logged in
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to TravKit</h1>
      <p className="mt-4 text-lg">Your travel planning companion.</p>
      <button
        className="mt-6 bg-blue-600 text-white font-semibold px-4 py-2 rounded z-9999 cursor-pointer hover:bg-blue-700 transition-colors duration-200" 
        onClick={handleLogin}
      >
        Login
      </button>
    </main>
  );
}
