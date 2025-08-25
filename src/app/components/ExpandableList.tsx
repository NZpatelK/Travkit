'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import List from './List';
import { getCategoriesWithLists } from '../utils/supabase/client';

interface ExpandedState {
    [key: number]: boolean;
}

interface ExpandableListProps {
    updatedProgress?: () => void;
    isTemplate?: boolean;
}

export default function ExpandableList({ updatedProgress, isTemplate = false }: ExpandableListProps) {
    const [expandedItems, setExpandedItems] = useState<ExpandedState>({});
    const [categoriesWithLists, setCategoriesWithLists] = useState<any[]>([]);
    const listRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchCategoriesWithLists = async () => {
            if (isTemplate) {
                await fetchCategoriesWithListsData();
            }
        };
        fetchCategoriesWithLists();
    }, []);

    const fetchCategoriesWithListsData = async () => {
        const data = await getCategoriesWithLists();
        setCategoriesWithLists(data);

        if (updatedProgress) {
            updatedProgress();
        }
    };

    const toggleItem = (index: number) => {
        setExpandedItems((prev) => {
            const newState: ExpandedState = {};

            // Collapse all other items and expand only the clicked one
            categoriesWithLists.forEach((_, i) => {
                newState[i] = i === index ? !prev[i] : false;

                const contentDiv = listRefs.current[i];
                if (contentDiv) {
                    if (newState[i]) {
                        // Slide down
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

                        const listItems = contentDiv.querySelectorAll('.list-item-container');
                        gsap.fromTo(
                            listItems,
                            { y: -50, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                        );
                    } else {
                        // Slide up
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
            });

            return newState;
        });
    };


    // Sync refs with categories
    useEffect(() => {
        listRefs.current = listRefs.current.slice(0, categoriesWithLists?.length);

        // Hide all by default
        listRefs.current.forEach((ref) => {
            if (ref) {
                gsap.set(ref, { display: 'none', height: 0, opacity: 0 });
            }
        });
    }, [categoriesWithLists?.length]);

    const calculateTotalCompleted = (category) => {
        const totalCompleted = category.list.filter((list) => list.is_completed).length;
        return totalCompleted;
    }

    return (
        <div className="w-11/12 mx-auto my-4">
            {categoriesWithLists?.map((category, index) => (
                <div
                    key={category.id ?? index}
                    className="border-2 border-rose-400 rounded-lg mb-2 overflow-hidden shadow-md"
                >
                    <button
                        className="w-full text-left p-4 bg-rose-100 hover:bg-rose-200 transition-colors flex justify-between items-center"
                        onClick={() => toggleItem(index)}
                    >
                        <span className="font-semibold text-neutral-700 capitalize">{category.title}</span>
                        <div className="flex items-center">
                            {!isTemplate && <div className="bg-white rounded-full p-1 px-4 mr-4 flex items-center justify-center">
                                <span className="text-rose-600 text-xs font-semibold">
                                    {calculateTotalCompleted(category)}   / {category.list.length}
                                </span>
                            </div>}
                            <span className="text-rose-600">{expandedItems[index] ? '−' : '+'}</span>
                        </div>
                    </button>
                    <div
                        ref={(el) => {
                            listRefs.current[index] = el;
                        }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white">
                            {category.list.map((listItem: any, i: number) => (
                                <List key={listItem.id ?? i} {...listItem} updateData={fetchCategoriesWithListsData} isTemplate={isTemplate} />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
