import { Category } from "../data/travelData";
import Checkbox from "./Checkbox";


export default function TemplateCard(category: Category) {
    return (
        <div className="w-full h-full flex items-center border-violet-700 bg-violet-100 border-2  shadow-md rounded p-2 m-2">
            <Checkbox isChecked={false}/>
            <h2 className="text-md ml-2 font-bold text-neutral-900 capitalize">{category.title}</h2>
        </div>
    );
}