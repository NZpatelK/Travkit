"use client";

import React, { JSX, useEffect, useState } from "react";
import { getAllTravelData } from "../utils/supabase/client";

interface TravelProps {
    travel_to: string;
    id: number;
}

export default function TravelDashboard(): JSX.Element {
  const [items, setItems] = useState<string[]>([]);
  const [nextIndex, setNextIndex] = useState<number>(1);

  useEffect(() => {
    const fetchTravelData = async () => {
      const data = await getAllTravelData();
      if (data) {
        const itemLabels = data.map((item: TravelProps) => item.travel_to); // assuming 'travel_to' is a field
        setItems(itemLabels);
        setNextIndex(itemLabels.length + 1);
        console.log('Fetched travel data:', itemLabels);
      }
    };
    fetchTravelData();
  }, []);

  function createNewItem() {
    const newItem = `Item ${nextIndex}`;
    setItems((prev) => [...prev, newItem]);
    setNextIndex((i) => i + 1);
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
            >
              + Create new item
            </button>
          </div>
        </header>

        <section>
          {items.length === 0 ? (
            <p className="text-center text-slate-800 py-10">No items yet. Click "Create new item" to add one.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((label, idx) => (
                <li
                  key={label + "-" + idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="text-base text-slate-600">{label}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(idx)}
                      aria-label={`Remove ${label}`}
                      className="text-sm px-3 py-1 text-rose-600 rounded-md hover:bg-slate-100 transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-6 text-sm text-slate-500">
          <div>Total items: {items.length}</div>
        </footer>
      </div>
    </main>
  );
}
