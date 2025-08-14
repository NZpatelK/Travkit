'use client'
import Checklist from "./components/Checklist";
import { useEffect } from "react";
import { clearAllData, seedDataIfEmpty } from "./utils/seedData";
import { Toaster } from "react-hot-toast";

export default function Home() {


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

      <div className="flex-grow flex flex-col items-center justify-center">
        <Checklist />
        <div className="mt-2 flex gap-4">
          <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded" onClick={handleClearList}>Delete All Tasks</button>
          <button className="bg-gray-600 text-white font-semibold px-4 py-2 rounded">Clear Completed</button>
        </div>
      </div>
    </div>


  );
}

