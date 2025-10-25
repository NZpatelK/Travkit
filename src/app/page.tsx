"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login"); // client-side navigation
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to TravKit</h1>
      <p className="mt-4 text-lg">Your travel planning companion.</p>
      <button
        className="mt-6 bg-blue-600 text-white font-semibold px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </main>
  );
}
