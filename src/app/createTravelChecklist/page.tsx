'use client';
import { motion } from "framer-motion";
import { JSX, useState } from "react";
import AddOnList from "../components/AddOnList";
import SearchableCountrySelect from "../components/SearchableCountrySelect";
import TemplateCard from "../components/TemplateCard";
import { Category, travelData } from "../data/travelData";
import toast, { Toaster } from "react-hot-toast";
import { seedDataIfEmpty } from "../utils/seedData";
import { useRouter } from "next/navigation";


interface CountryOption {
    value: string;
    label: string;
}

export default function CreateTravelChecklist(): JSX.Element {

    const [AddOnListData, setAddOnListData] = useState<Category[]>([]);
    const [inputDuration, setInputDuration] = useState<number | "">("");
    const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

    const router = useRouter();

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

        const travelId = await seedDataIfEmpty(AddOnListData, selectedCountry?.label ?? "", inputDuration as number);
        toast.success("List created!");
        setAddOnListData([]);
        setInputDuration("");
        setSelectedCountry(null);
        router.push(`/dashboard/checklist/${travelId}`);
    };

    return (
        <div>
            <Toaster position="top-right" reverseOrder={true} />
            <AddOnList>
                <h1 className="text-3xl font-bold text-neutral-800 text-center mt-5">Welcome to TravKit</h1>
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
    );
}