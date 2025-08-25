import { Category } from "../data/travelData";
import Checkbox from "./Checkbox";


export default function TemplateCard(category: Category) {
    return (
        <div className="w-full h-full flex items-center justify-between border-violet-700 bg-violet-100 border-2  shadow-md rounded p-2 pr-6 ">
           <div className="flex items-center">
                <Checkbox isChecked={false}/>
                <h2 className="text-md ml-2 font-bold text-neutral-900 capitalize">{category.title}</h2>
           </div>
           <button className="text-blue-500 text-xs font-semibold tracking-wide">View List</button>
        </div>
    );
}