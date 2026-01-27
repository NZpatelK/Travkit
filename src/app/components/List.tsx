import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import { updateIsCompleted } from "../utils/supabase/client";

interface ListProps {
    id: number | string;
    title: string;
    is_completed: boolean;
    is_deletable?: boolean;
    updateData: () => void;

}

export default function List({ id, title, is_completed, is_deletable, updateData}: ListProps) {
    const [isChecked, setIsChecked] = useState(is_completed);

    useEffect(() => {
        setIsChecked(is_completed);
    }, [is_completed]);

    const handleToggle = async () => {
        await updateIsCompleted(id, !isChecked);
        setIsChecked(!isChecked);
        updateData();
    };

    return (
        <div className="mx-auto my-4 border-2 border-neutral-200 mb-2 overflow-hidden w-full h-10 rounded flex items-center p-2 list-item-container" onClick={handleToggle}>
            <Checkbox isChecked={isChecked} />
            <span
                className={`ml-4 text-neutral-700 transition-all duration-300 ease-in-out capitalize ${isChecked ? 'line-through opacity-60' : ''
                    }`}
            >
                {title}
            </span>
            {is_deletable && <button className="ml-auto text-red-700 hover:text-red-400">Delete Item</button>}
        </div>
    );
}