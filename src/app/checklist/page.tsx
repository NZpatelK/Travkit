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
  const [AddOnListData, setAddOnListData] = useState<Category[]>([]);
  const [inputDuration, setInputDuration] = useState<number | "">("");
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
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
    setAddOnListData([]);
    setIsDataEmpty(true);
  };

  const handleClearCompleted = async () => {
    await resetIsCompleted();
    triggerRefresh();
    toast.success("Completed tasks cleared!");
  };

  const handleAddList = (category: Category) => {
    setAddOnListData([...AddOnListData, category]);
  };

  const handleRemoveList = (title: string) => {
    setAddOnListData(AddOnListData.filter((item) => item.title !== title));
  };

  const handleCreateList = async () => {
    if (AddOnListData.length === 0) return toast.error("Please add at least one list");
    if (!selectedCountry) return toast.error("Please select a country");
    if (!inputDuration || inputDuration <= 1) return toast.error("Please enter a valid duration. Must be greater than 1.");

    setIsLoading(true);
    await seedDataIfEmpty(AddOnListData, selectedCountry?.label ?? "", inputDuration as number);
    toast.success("List created!");
    setAddOnListData([]);
    setInputDuration("");
    setSelectedCountry(null);
    setIsDataEmpty(false);
    setIsLoading(false);
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

      {isDataEmpty && !isLoading && (
        <div>
          <AddOnList isOpen={isDataEmpty}>
            <h1 className="text-3xl font-bold text-neutral-800 text-center">Welcome to TravKit</h1>
            <hr className="my-2 w-5/12 mx-auto text-neutral-300" />
            <h2 className="text-sm font-semibold text-neutral-800 text-center">Create a checklist for your next trip</h2>

            <div className="text-neutral-900 mt-5">
              <div className="max-w-md mx-auto p-5 space-y-6">
                <div className="flex flex-col">
                  <label className="mb-2 text-gray-700 font-semibold">Travel To:</label>
                  <SearchableCountrySelect setSelectedCountry={setSelectedCountry} selectedCountry={selectedCountry} />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-gray-700 font-semibold">How Many Days?</label>
                  <input
                    type="number"
                    placeholder="Enter number of days"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={inputDuration}
                    onChange={(e) => setInputDuration(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <hr className="my-5 w-11/12 mx-auto text-neutral-300" />
              <div>
                <h2 className="text-center font-bold text-lg capitalize">Select a Checklist template to get started</h2>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-5">
                {travelData.categories.map((data, index) => (
                  <TemplateCard key={index} category={data} handleAddList={handleAddList} handleRemoveList={handleRemoveList} />
                ))}
              </div>
            </div>

            <div className="text-center">
              <motion.button
                className="bg-violet-600 text-white font-semibold w-10/12 py-3 rounded mt-5"
                onClick={handleCreateList}
                whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Create Checklist
              </motion.button>
            </div>
          </AddOnList>
        </div>
      )}

      {isLoading && <GlobePage />}
    </div>
  );
}
