"use client";

import React, { JSX, useEffect, useState } from "react";
import { getAllTravelData } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      if (data) {
        setTravelData(data);
        console.log("Fetched travel data:", data);
      }
    };
    fetchTravelData();
  }, []);

  function createNewItem() {
    router.push("/createTravelChecklist");
  }

  function removeItem(idx: number) {
    setTravelData((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0B0F1A] via-[#0E1325] to-[#0B0F1A] px-6 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur overflow-hidden">
        {/* Brand Name */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            TRAVKIT
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Your travel checklist companion
          </p>
        </div>

        <hr className="border-gray-700 mb-10" />
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Checklist</h2>
            <p className="text-sm text-gray-400">
              No inputs, just a single button to add items.
            </p>
          </div>
          <div>
            <button
              onClick={createNewItem}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={travelData.length >= 5}
            >
              + Create new item
            </button>
          </div>
        </header>

        {/* Checklist Section */}
        <section className="overflow-hidden">
          {travelData.length === 0 ? (
            <p className="text-center text-gray-300 py-10">
              No items yet. Click &quot;Create new item&quot; to add one.
            </p>
          ) : (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
              {travelData.map((item, idx) => (
                <Link
                  href={`/dashboard/checklist/${item.id}`}
                  key={item.id + "-" + idx}
                  className="flex w-full rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <li className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-2">
                    <div className="text-base text-white">{item.travel_to}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeItem(idx);
                        }}
                        aria-label={`Remove ${item.travel_to}`}
                        className="text-sm rounded-md px-3 py-1 text-rose-500 hover:bg-white/10 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-col sm:flex-row justify-between text-sm text-gray-400 gap-1 sm:gap-0">
          <div>Total items: {travelData.length}</div>
          <div>Max items: 5</div>
        </footer>
      </div>
    </main>
  );
}
