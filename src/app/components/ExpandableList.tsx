import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import List from './List';

// Define the shape of each item in the list
interface ListItem {
    title: string;
    content: string;
}

// Define the shape of the expandedItems state
interface ExpandedState {
    [key: number]: boolean;
}

export default function ExpandableList() {
    const [expandedItems, setExpandedItems] = useState<ExpandedState>({});

    const toggleItem = (index: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const items: ListItem[] = [
        { title: 'Item 1', content: 'This is the content for item 1.' },
        { title: 'Item 2', content: 'This is the content for item 2.' },
        { title: 'Item 3', content: 'This is the content for item 3.' },
    ];

    return (
        <div className="w-11/12 mx-auto my-4">
            {items.map((item: ListItem, index: number) => (
                <div key={index} className="border-2 border-rose-400 rounded-lg mb-2 overflow-hidden shadow-md">
                    <button
                        className="w-full text-left p-4 bg-rose-100 hover:bg-rose-200 transition-colors flex justify-between items-center"
                        onClick={() => toggleItem(index)}
                    >
                        <span className="font-semibold text-neutral-700">{item.title}</span>
                        <div className="flex items-center">
                            <div className='bg-white rounded-full p-1 px-4 mr-4 flex items-center justify-center'>
                                <span className="text-rose-600 text-xs font-semibold">0 / {items.length}</span>
                            </div>
                            <span className="text-rose-600">
                                {expandedItems[index] ? '−' : '+'}
                            </span>
                        </div>
                    </button>
                    <AnimatePresence>
                        {expandedItems[index] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-white">
                                    <List />
                                    <List />
                                    <List />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}