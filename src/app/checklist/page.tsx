"use client";

import Checklist from "@/app/components/Checklist";
import { useEffect, useState } from "react";
import { clearAllData, seedDataIfEmpty } from "@/app/utils/seedData";
import toast, { Toaster } from "react-hot-toast";
import { allLists, resetIsCompleted } from "@/app/utils/supabase/client";
import AddOnList from "@/app/components/AddOnList";
import SearchableCountrySelect from "@/app/components/SearchableCountrySelect";
import { Category, travelData } from "@/app/data/travelData";
import TemplateCard from "@/app/components/TemplateCard";
import { motion } from "framer-motion";
import { useRefresh } from "@/app/context/RefreshContext";
import GlobePage from "@/app/components/Globe";
import { supabase } from "@/app/utils/supabase/client"; // <- Add Supabase client
import { useRouter } from "next/navigation";

interface CountryOption {
  value: string;
  label: string;
}

export default function Dashboard() {
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { triggerRefresh } = useRefresh();
  const router = useRouter();

  // ------------------------
  // Auth Protection
  // ------------------------
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login"); // redirect if not logged in
      } else {
        setUser(data.user);
      }
    };
    checkAuth();
  }, [router]);

  // ------------------------
  // Fetch checklist data
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await allLists();
      if (!data || data.length === 0) setIsDataEmpty(true);
      else setIsDataEmpty(false);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // ------------------------
  // Handlers
  // ------------------------
  const handleClearList = async () => {
    await clearAllData();
    toast.success("List cleared!");
    setIsDataEmpty(true);
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

      {(!isDataEmpty && !isLoading) && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <Checklist />
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
