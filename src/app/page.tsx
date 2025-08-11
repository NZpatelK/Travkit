'use client'
import Image from "next/image";
import Checklist from "./components/Checklist";
import { useEffect } from "react";
import { seedDataIfEmpty } from "./utils/seedData";

export default function Home() {

  useEffect(() => {
    seedDataIfEmpty();
  })

  return (
    <div className="h-screen flex flex-col">
      <div className="ml-10 mt-10 text-3xl font-semibold">
        <h1>TravKit</h1>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <Checklist />
      </div>
    </div>


  );
}

