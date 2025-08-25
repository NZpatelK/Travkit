import { useState } from "react";
import { Category } from "../data/travelData";
import Checkbox from "./Checkbox";
import Modal from "./Modal";


export default function TemplateCard(category: Category) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full h-full flex items-center justify-between border-violet-700 bg-violet-100 border-2  shadow-md rounded p-2 pr-6 relative">
            <div className="flex items-center">
                <Checkbox isChecked={false} />
                <h2 className="text-md ml-2 font-bold text-neutral-900 capitalize">{category.title}</h2>
            </div>
            <button className="text-blue-500 text-xs font-semibold tracking-wide" onClick={() => setIsModalOpen(true)}>View List</button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4 capitalize">{category.title}</h2>
                {category.list.map((item, index) => (
                    <div className="flex items-center w-full" key={index}>
                        <p className="text-md font-semibold text-neutral-900 capitalize" >{item.title}</p>
                    </div>
                ))}
            </Modal>
        </div>
    );
}