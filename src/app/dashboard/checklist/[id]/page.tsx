"use client";

import Checklist from "@/app/components/Checklist";
import { useEffect, useState } from "react";
import { deteleTravelChecklistByTravelId } from "@/app/utils/seedData";
import toast, { Toaster } from "react-hot-toast";
// import { getAllListsByTravelId } from "@/app/utils/supabase/client";
import { motion } from "framer-motion";
import { useRefresh } from "@/app/context/RefreshContext";
import GlobePage from "@/app/components/Globe";
import { supabase } from "@/app/utils/supabase/client"; 
import { useRouter } from "next/navigation";
import React from "react";
import { getCurrentUser } from "@/app/utils/supabase/auth";
import { getAllListsByTravelId, resetIsCompleted } from "@/app/utils/supabase/list";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function ChecklistPage({ params }: Props) {
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { id } = React.use(params)


  const { triggerRefresh } = useRefresh();
  const router = useRouter();

  // ------------------------
  // Auth Protection
  // ------------------------
  useEffect(() => {
    const checkAuth = async () => {
      const data = await getCurrentUser(); 
      if (!data) {
        router.replace("/login"); // redirect if not logged in
      } else {
        setUser(data);
      }
    };
    checkAuth();
  }, [router]);

  // ------------------------
  // Fetch checklist data
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      if (id) {
        const data = await getAllListsByTravelId(id)

        if (!data || data.length === 0) {
          setIsDataEmpty(true)
        } else {
          setIsDataEmpty(false)
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [id])


  // ------------------------
  // Handlers
  // ------------------------
  const handleClearList = async () => {
    await deteleTravelChecklistByTravelId(id!);
    toast.success("List cleared!");
    setIsDataEmpty(true);
    router.replace(`/dashboard`);
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

  // ------------------------
  // Render
  // ------------------------
  if (!user) return <GlobePage />; // show loader until auth is verified

  return (
    <div className="h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={true} />

      <div className="mx-10 mt-10 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">TravKit</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md z-9999 cursor-pointer transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => router.replace('/dashboard')}
        className="mx-10 mt-4 px-8 py-3 rounded shadow-md z-9999 bg-violet-700 hover:bg-violet-800 cursor-pointer transition-colors duration-200 self-start"
      >
        &larr; Back to Dashboard
      </button>

      {(!isDataEmpty && !isLoading) && (
        <div className="flex-grow flex flex-col items-center justify-center">
          {id && <Checklist travelId={id} />}
          <div className="mt-2 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95, rotate: -2 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded shadow-md transition-colors duration-200"
              onClick={handleClearList}
            >
              Delete All Tasks
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95, rotate: 2 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded shadow-md transition-colors duration-200"
              onClick={handleClearCompleted}
            >
              Clear Completed
            </motion.button>
          </div>
        </div>
      )}

      {isLoading && <GlobePage />}
    </div>
  );
}
