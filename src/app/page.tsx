'use client'
import Checklist from "./components/Checklist";
import { useEffect, useState } from "react";
import { clearAllData, seedDataIfEmpty } from "./utils/seedData";
import toast, { Toaster } from "react-hot-toast";
import { allLists, resetIsCompleted } from "./utils/supabase/client";
import AddOnList from "./components/AddOnList";
import SearchableCountrySelect from "./components/SearchableCountrySelect";
import { Category, travelData } from "./data/travelData";
import TemplateCard from "./components/TemplateCard";
import { motion } from "framer-motion";

export default function Home() {
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [AddOnListData, setAddOnListData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await allLists();
      if (data && data.length === 0) {
        setIsDataEmpty(true);
      }
      else {
        setIsDataEmpty(false);
      }
    }
    fetchData();
  }, []);


  const handleClearList = async () => {
    await clearAllData();
    toast.success("List cleared!");
    setAddOnListData([]);
    setIsDataEmpty(true);
  };

  const handleClearCompleted = async () => {
    // Logic to clear completed tasks
    await resetIsCompleted();
    toast.success("Completed tasks cleared!");
  };

  const handleAddList = (category: Category) => {
    setAddOnListData([...AddOnListData, category]);
    console.log(AddOnListData);
  }

  const handleRemoveList = (title: string) => {
    setAddOnListData(AddOnListData.filter((item) => item.title !== title));
    console.log(AddOnListData);
  }

  const handleCreateList = async () => {
    if(AddOnListData.length === 0) {
      toast.error("Please add at least one list");
      return;
    }
    
    await seedDataIfEmpty(AddOnListData);
    toast.success("List created!");
    setAddOnListData([]);
    setIsDataEmpty(false);
  }

  return (
    <div className="h-screen flex flex-col">
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <div className="ml-10 mt-10 text-3xl font-semibold">
        <h1>TravKit</h1>
      </div>

      {!isDataEmpty && <div className="flex-grow flex flex-col items-center justify-center">
        <Checklist />
        <div className="mt-2 flex gap-4">
          <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded" onClick={handleClearList}>Delete All Tasks</button>
          <button className="bg-gray-600 text-white font-semibold px-4 py-2 rounded" onClick={handleClearCompleted}>Clear Completed</button>
        </div>
      </div>}
      {
        isDataEmpty &&
        <div>
          <AddOnList isOpen={isDataEmpty} onClose={() => setIsDataEmpty(false)}>
            <h1 className="text-3xl font-bold text-neutral-800 text-center">Welcome to TravKit</h1>
            <hr className="my-2 w-5/12 mx-auto text-neutral-300" />
            <h2 className="text-sm font-semibold text-neutral-800 text-center">Create a checklist for your next trip</h2>

            <div className="text-neutral-900 mt-5">

              <div className="max-w-md mx-auto p-5 space-y-6">
                <div className="flex flex-col">
                  <label className="mb-2 text-gray-700 font-semibold">Travel To:</label>
                  <SearchableCountrySelect />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-gray-700 font-semibold">How Many Days?</label>
                  <input
                    type="number"
                    placeholder="Enter number of days"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }} // slightly bigger & brighter on hover
                whileTap={{ scale: 0.95 }} // shrink when clicked
                transition={{ type: "spring", stiffness: 300 }}
              >
                Create Checklist
              </motion.button>
            </div>
          </AddOnList>
        </div>
      }
    </div>


  );
}

