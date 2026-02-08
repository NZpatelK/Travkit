"use client";

import Checklist from "@/app/components/Checklist";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useRefresh } from "@/app/context/RefreshContext";
import GlobePage from "@/app/components/Globe";
import { supabase } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";
import { getCurrentUser } from "@/app/utils/supabase/auth";
import {
  getAllListsByTravelId,
  resetIsCompleted,
} from "@/app/utils/supabase/list";
import { deleteTravelChecklistByTravelId } from "@/app/utils/supabase/checklist";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ChecklistPage({ params }: Props) {
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { id } = React.use(params);
  const { triggerRefresh } = useRefresh();
  const router = useRouter();

  // ------------------------
  // Auth Protection
  // ------------------------
  useEffect(() => {
    const checkAuth = async () => {
      const data = await getCurrentUser();
      if (!data) router.replace("/login");
      else setUser(data);
    };
    checkAuth();
  }, [router]);

  // ------------------------
  // Fetch checklist data
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (id) {
        const data = await getAllListsByTravelId(id);
        setIsDataEmpty(!data || data.length === 0);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  // ------------------------
  // Handlers
  // ------------------------
  const handleClearList = async () => {
    await deleteTravelChecklistByTravelId(id!);
    toast.success("List cleared!");
    router.replace("/dashboard");
  };

  const handleClearCompleted = async () => {
    await resetIsCompleted();
    triggerRefresh();
    toast.success("Completed tasks cleared!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (!user) return <GlobePage />;

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F1A] via-[#0E1325] to-[#0B0F1A] px-6 overflow-x-hidden">
      <Toaster position="top-right" reverseOrder />

      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      {/* Centered Content */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold tracking-wide text-violet-400">
            TRAVKIT
          </h1>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.replace("/dashboard")}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              ← Dashboard
            </motion.button>

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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isLoading && <GlobePage />}

          {!isDataEmpty && !isLoading ? (
            <div className="flex flex-col gap-6">
              {id && <Checklist travelId={id} />}

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearList}
                  className="rounded-xl border border-red-500/30 px-6 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  🗑️ Delete all tasks
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearCompleted}
                  className="rounded-xl border border-violet-500/40 bg-violet-600/10 px-6 py-2.5 text-sm text-violet-300 transition hover:bg-violet-600/20 hover:text-violet-200"
                >
                  ✅ Clear completed
                </motion.button>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="mb-4 text-lg text-gray-400">
                Your checklist is empty!
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.replace("/dashboard")}
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                ← Back to dashboard
              </motion.button>
            </div>
          ) : null}
        </motion.section>
      </div>
    </main>
  );
}
