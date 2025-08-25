import { useState } from "react";
import { Category } from "../data/travelData";
import Checkbox from "./Checkbox";
import Modal from "./Modal";


export default function TemplateCard(category: Category) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full h-full flex items-center justify-between border-violet-400 bg-violet-100 border-2  shadow-md rounded-md p-2 pr-6 relative">
            <div className="flex items-center">
                <Checkbox isChecked={false} />
                <h2 className="text-md ml-2 font-bold text-neutral-900 capitalize">{category.title}</h2>
            </div>
            <button className="text-blue-500 text-xs font-semibold tracking-wide" onClick={() => setIsModalOpen(true)}>View List</button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-3xl font-bold mb-4 text-center capitalize">{category.title}</h2>

                <ul className="divide-y divide-violet-100">
                    {category.list.map((item, index) => (
                        <li key={index} className="py-3 flex items-center">
                            <span className="w-1.5 h-1.5 bg-violet-300 rounded-full mr-3 flex-shrink-0"></span>
                            <p className="text-md font-medium text-neutral-800 capitalize">{item.title}</p>
                        </li>
                    ))}
                </ul>
            </Modal>


        </div>
    );
}