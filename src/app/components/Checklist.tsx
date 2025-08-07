'use client'
import Image from "next/image";
import ProgressBar from "./ProgessBar";
import ExpandableList from "./ExpandableList";


export default function Checklist() {
    return (
        <div className="flex flex-col max-w-2xl w-full bg-neutral-100 min-h-[600px] rounded-2xl shadow-2xl m-5">
            <div className="relative h-35 overlay">
                <Image
                    src="/bg-image.jpg"
                    alt="Header Background Image"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-2xl"
                />

                <h3 className="absolute bottom-8 left-5 text-2xl font-extrabold capitalize text-gray-800 z-20 drop-shadow-md">
                    Prepare trip to Dubai in 2025
                </h3>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-20 w-10/12 sm:w-3/5 transition-all">
                    <ProgressBar progressNum={100} />
                </div>
            </div>
            <div className="flex flex-col mt-10 items-center w-full relative">
                <ExpandableList />
            </div>
        </div>

    )
}