import { useState } from "react";
import Checkbox from "./Checkbox";
import { updateIsCompleted } from "../utils/supabase/client";

interface ListProps {
  id: number | string;
  title: string;
  iscompleted: boolean;
}

export default function List({ id, title, iscompleted }: ListProps) {
    const [isChecked, setIsChecked] = useState(iscompleted);

    const handleToggle = () => {
        updateIsCompleted(id, !isChecked);
        setIsChecked(!isChecked);
    };

    return (
        <div className="mx-auto my-4 border-2 border-neutral-200 mb-2 overflow-hidden w-full h-10 rounded flex items-center p-2 list-item-container" onClick={handleToggle}>
            <Checkbox isChecked={isChecked}/>
            <span
                className={`ml-4 text-neutral-700 transition-all duration-300 ease-in-out capitalize ${isChecked ? 'line-through opacity-60' : ''
                    }`}
            >
                {title}
            </span>
        </div>
    );
}