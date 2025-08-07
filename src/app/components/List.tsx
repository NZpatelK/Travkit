import { useState } from "react";
import Checkbox from "./Checkbox";

export default function List() {
    const [isChecked, setIsChecked] = useState(false);
    
    return (
        <div className="mx-auto my-4 border-2 border-neutral-200 mb-2 overflow-hidden w-full h-10 rounded flex items-center p-2 list-item-container">
            <Checkbox isChecked={isChecked} setIsChecked={setIsChecked} />
            <span 
                className={`ml-4 text-neutral-700 transition-all duration-300 ease-in-out ${
                    isChecked ? 'line-through opacity-60' : ''
                }`}
            >
                Item 1
            </span> 
        </div>
    );
}