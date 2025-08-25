'use client'
import Checklist from "./components/Checklist";
import { useEffect, useState } from "react";
import { clearAllData, seedDataIfEmpty } from "./utils/seedData";
import { Toaster } from "react-hot-toast";
import { allLists } from "./utils/supabase/client";
import AddOnList from "./components/AddOnList";
import SearchableCountrySelect from "./components/SearchableCountrySelect";
import { Category, travelData } from "./data/travelData";
import TemplateCard from "./components/TemplateCard";
import { h1 } from "framer-motion/client";

export default function Home() {
  const [isDataEmpty, setIsDataEmpty] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await allLists();
      if (data && data.length === 0) {
        setIsDataEmpty(true);
      }
      else {
        // setIsDataEmpty(false);
      }
    }
    fetchData();
  }, []);


  const handleClearList = () => {
    clearAllData();
  };

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
          <button className="bg-gray-600 text-white font-semibold px-4 py-2 rounded">Clear Completed</button>
        </div>
      </div>}
      {
        isDataEmpty &&
        <div>
          <AddOnList isOpen={isDataEmpty} onClose={() => setIsDataEmpty(false)}>
            <h1 className="text-3xl font-bold text-neutral-800 text-center">Welcome to TravKit</h1>

            <div className="text-neutral-900 mt-5">

              <div className="">
                <p className="mr-2 font-semibold">Travel To: </p>
                <SearchableCountrySelect />
              </div>

             <div className="mt-5 font-semibold">
                <p>How Many Days?:</p>
                <input type="number"  className="w-full p-1.5 px-3 border border-gray-300 rounded"/>
             </div>

             <hr className="my-5 w-11/12 mx-auto text-neutral-300"/>
             <div>
              <h2 className="text-center font-bold text-lg capitalize">Select a Checklist template to get started</h2>
             </div>

             {travelData.categories.map((data, index) => (
                <TemplateCard key={index} {...(data as Category)}  />
              ))}

            </div>
          </AddOnList>
        </div>
      }
    </div>


  );
}

