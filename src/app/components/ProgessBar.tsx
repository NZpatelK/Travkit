export default function ProgressBar() {
    return (
        <div className="w-full bg-white rounded-full h-6 drop-shadow-lg p-4 flex items-center justify-between">
            <div className="bg-green-600 h-2.5 rounded-full w-5/6"></div>
            <span className=" text-sm font-semibold text-neutral-800">100%</span>
        </div>

    )
}