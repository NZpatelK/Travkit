'use client'
import Checklist from "./components/Checklist";
import { useEffect } from "react";
import { clearAllData, seedDataIfEmpty } from "./utils/seedData";
import { Toaster } from "react-hot-toast";

export default function Home() {

  useEffect(() => {
    seedDataIfEmpty();
  })

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

      <div className="flex-grow flex items-center justify-center">
        <Checklist />
        <button onClick={handleClearList}>Clear</button>
      </div>
    </div>


  );
}

