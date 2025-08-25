import { Category } from "../data/travelData";


export default function TemplateCard(category: Category) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-amber-200">{category.title}</h2>
        </div>
    );
}