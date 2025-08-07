'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
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
    const listRefs = useRef<(HTMLDivElement | null)[]>([]);

    const items: ListItem[] = [
        { title: 'Item 1', content: 'This is the content for item 1.' },
        { title: 'Item 2', content: 'This is the content for item 2.' },
        { title: 'Item 3', content: 'This is the content for item 3.' },
    ];

    const toggleItem = (index: number) => {
        setExpandedItems((prev) => {
            const isExpanding = !prev[index];
            const contentDiv = listRefs.current[index];

            if (contentDiv) {
                if (isExpanding) {
                    // Slide down animation
                    gsap.set(contentDiv, { display: 'block', height: 0, opacity: 0 });
                    gsap.to(contentDiv, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: () => {
                            gsap.set(contentDiv, { height: 'auto' });
                        },
                    });
                    // Animate list items one by one
                    const listItems = contentDiv.querySelectorAll('.list-item-container');
                    gsap.fromTo(
                        listItems,
                        { y: -50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.1,
                            ease: 'power2.out',
                        }
                    );
                } else {
                    // Slide up animation
                    gsap.to(contentDiv, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            gsap.set(contentDiv, { display: 'none' });
                        },
                    });
                }
            }

            return {
                ...prev,
                [index]: isExpanding,
            };
        });
    };

    // Initialize refs for each item
    useEffect(() => {
        listRefs.current = listRefs.current.slice(0, items.length);
        // Set initial state to hidden
        listRefs.current.forEach((ref) => {
            if (ref) {
                gsap.set(ref, { display: 'none', height: 0, opacity: 0 });
            }
        });
    }, [items.length]);

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
                            <div className="bg-white rounded-full p-1 px-4 mr-4 flex items-center justify-center">
                                <span className="text-rose-600 text-xs font-semibold">
                                    0 / {items.length}
                                </span>
                            </div>
                            <span className="text-rose-600">{expandedItems[index] ? '−' : '+'}</span>
                        </div>
                    </button>
                    <div
                        ref={(el) => (listRefs.current[index] = el)}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white">
                            <List />
                            <List />
                            <List />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}