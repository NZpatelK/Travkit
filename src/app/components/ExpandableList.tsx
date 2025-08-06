import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpandableList() {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const items = [
    { title: 'Item 1', content: 'This is the content for item 1.' },
    { title: 'Item 2', content: 'This is the content for item 2.' },
    { title: 'Item 3', content: 'This is the content for item 3.' },
  ];

  return (
    <div className="w-11/12 mx-auto my-4">
      {items.map((item, index) => (
        <div key={index} className="border-2 border-rose-400 rounded mb-2">
          <button
            className="w-full text-left p-4 bg-rose-100 hover:bg-rose-200 transition-colors flex justify-between items-center"
            onClick={() => toggleItem(index)}
          >
            <span className="font-semibol text-neutral-700">{item.title}</span>
            <span className="text-rose-600">
              {expandedItems[index] ? '−' : '+'}
            </span>
          </button>
          <AnimatePresence>
            {expandedItems[index] && (
              <motion.div
                key={index}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-white">
                  <p className="text-neutral-700">{item.content}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}