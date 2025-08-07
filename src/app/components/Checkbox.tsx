'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CheckboxProps {
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
}

export default function Checkbox({ isChecked, setIsChecked }: CheckboxProps) {
    // const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="relative cursor-pointer" onClick={handleToggle}>
            <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => {}} // required for React controlled input
                readOnly // since we’re using onClick to toggle state
            />
            <motion.div
                className="w-4 h-4 border-2 rounded-md flex items-center justify-center"
                animate={{
                    backgroundColor: isChecked ? '#10B981' : '#FFFFFF',
                    borderColor: isChecked ? '#10B981' : '#D1D5DB',
                }}
                transition={{ duration: 0.2 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isChecked && (
                        <motion.svg
                            key="checkmark"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.path
                                d="M5 13l4 4L19 7"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
