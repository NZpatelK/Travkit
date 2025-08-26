import { useEffect, useState } from "react";
import { useConfetti } from "@/app/hooks/useConfetti";


interface ProgressBarProps {
    progressNum?: number; // externally passed progress (0–100)
}

export default function ProgressBar({ progressNum = 0 }: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const { fire } = useConfetti();


    useEffect(() => {
        if (typeof progressNum !== 'number') return;

        const step = 1;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev === progressNum) {
                    clearInterval(interval);
                    return prev;
                }

                const direction = progressNum > prev ? 1 : -1;
                const next = prev + direction * step;

                if ((direction === 1 && next > progressNum) || (direction === -1 && next < progressNum)) {
                    clearInterval(interval);
                    return progressNum;
                }

                if (next.toFixed(0) as unknown as number >= 100) {
                    fire();
                }

                return next;
            });

        }, 50);

        return () => clearInterval(interval);
    }, [fire, progressNum]);

    return (
        <div className="w-full bg-white rounded-full h-6 drop-shadow-lg p-4 flex items-center justify-between">
            <div className="h-2.5 rounded-full w-4/5 sm:w-5/6 relative">
                <div
                    className="bg-green-600 h-full rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <span className="text-sm font-semibold text-neutral-800">{progress.toFixed(0)}%</span>
        </div>
    );
}
