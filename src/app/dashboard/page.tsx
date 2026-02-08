"use client";

import React, { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllTravelData } from "../utils/supabase/travel";
import { motion } from "framer-motion";
import { supabase } from "../utils/supabase/client";

interface TravelProps {
  travel_to: string;
  id: number;
  duration: number;
  user_id: string;
}

export default function TravelDashboard(): JSX.Element {
  const [travelData, setTravelData] = useState<TravelProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTravelData = async () => {
      const data = await getAllTravelData();
      if (data) setTravelData(data);
    };
    fetchTravelData();
  }, []);

  const createNewItem = () => {
    router.push("/createTravelChecklist");
  };

  const removeItem = (idx: number) => {
    setTravelData((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F1A] via-[#0E1325] to-[#0B0F1A] px-6 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      {/* Centered Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-4xl font-extrabold tracking-wide text-violet-400">
            TRAVKIT
          </h1>

          <div className="flex gap-3">

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </motion.button>
          </div>
        </header>

        {/* Card */}
        <section className="rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Checklist</h2>
              <p className="text-sm text-gray-400">
                No inputs, just a single button to add items.
              </p>
            </div>

            <button
              onClick={createNewItem}
              disabled={travelData.length >= 5}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500 disabled:opacity-50"
            >
              + Create new item
            </button>
          </header>

          {/* List */}
          {travelData.length === 0 ? (
            <p className="py-10 text-center text-gray-300">
              No items yet. Click “Create new item” to add one.
            </p>
          ) : (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
              {travelData.map((item, idx) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                >
                  <Link
                    href={`/dashboard/checklist/${item.id}`}
                    className="flex items-center justify-between p-3"
                  >
                    <span className="text-white">{item.travel_to}</span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(idx);
                      }}
                      className="rounded-md px-3 py-1 text-sm text-rose-500 transition hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <footer className="mt-6 flex justify-between text-sm text-gray-400">
            <span>Total items: {travelData.length}</span>
            <span>Max items: 5</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
