import { useState } from "react";
import Checkbox from "./Checkbox";
import { updateIsCompleted } from "../utils/supabase/client";

interface ListProps {
    id: number | string;
    title: string;
    is_completed: boolean;
    updateData: () => void;
    isTemplate?: boolean
}

export default function List({ id, title, is_completed, updateData, isTemplate }: ListProps) {
    const [isChecked, setIsChecked] = useState(is_completed);

    const handleToggle = async () => {
        await updateIsCompleted(id, !isChecked);
        setIsChecked(!isChecked);
        updateData();
    };

    return (
        <div className="mx-auto my-4 border-2 border-neutral-200 mb-2 overflow-hidden w-full h-10 rounded flex items-center p-2 list-item-container" onClick={handleToggle}>
            {!isTemplate && <Checkbox isChecked={isChecked} />}
            <span
                className={`ml-4 text-neutral-700 transition-all duration-300 ease-in-out capitalize ${isChecked && !isTemplate ? 'line-through opacity-60' : ''
                    }`}
            >
                {title}
            </span>
        </div>
    );
}