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
  const [items, setItems] = useState<string[]>([]);
  const [travelData, setTravelData] = useState<TravelProps[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTravelData = async () => {
      const data = await getAllTravelData();
      if (data) {
        const getTravelData = data.map((item: TravelProps) => item);
        setTravelData(getTravelData);
        console.log('Fetched travel data:', getTravelData);
      }
    };
    fetchTravelData();
  }, []);

  function createNewItem() {
    router.push("/createTravelChecklist");
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl text-slate-600 font-semibold">Checklist</h1>
            <p className="text-sm text-slate-500">No inputs, just a single button to add items.</p>
          </div>
          <div>
            <button
              onClick={createNewItem}
              className="inline-flex items-center bg-neutral-800 gap-2 px-4 py-2 rounded-lg shadow-sm border border-transparent hover:shadow-md transition"
              disabled={travelData.length >= 5}
            >
              + Create new item
            </button>
          </div>
        </header>

        <section>
          {travelData.length === 0 ? (
            <p className="text-center text-slate-800 py-10">No items yet. Click &quot;Create new item&quot; to add one.</p>
          ) : (
            <ul className="space-y-3">
              {travelData.map((item, idx) => (
                <Link href={`/dashboard/checklist/${item.id}`} key={item.id + "-" + idx}
                  className="flex p-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition">

                  <li
                    key={item.id + "-" + idx}
                    className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-2"
                  >
                    <div className="text-base text-slate-600">{item.travel_to}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeItem(idx)}
                        aria-label={`Remove ${item.travel_to}`}
                        className="text-sm px-3 py-1 text-rose-600 rounded-md hover:bg-slate-100 transition"
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

        <footer className="mt-6 text-sm text-slate-500">
          <div>Total items: {items.length}</div>
          <div>Max items: 5</div>
        </footer>
      </div>
    </main>
  );
}
