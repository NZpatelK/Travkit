'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import List from './List';
import { addNewItemToList, getCategoriesWithLists } from '../utils/supabase/client';
import { useRefresh } from '../context/RefreshContext';

interface ExpandedState {
    [key: number]: boolean;
}

interface ExpandableListProps {
    updatedProgress?: () => void;
    travelId: string;
}

export default function ExpandableList({ updatedProgress, travelId }: ExpandableListProps) {
    const [inputNewItem, setInputNewItem] = useState('');
    const [expandedItems, setExpandedItems] = useState<ExpandedState>({});
    const [categoriesWithLists, setCategoriesWithLists] = useState<any[]>([]);
    const listRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { refreshFlag } = useRefresh();


    useEffect(() => {
        const fetchCategoriesWithLists = async () => {
            await fetchCategoriesWithListsData();
        };
        fetchCategoriesWithLists();
    }, [refreshFlag]);

    const fetchCategoriesWithListsData = async () => {
        const data = await getCategoriesWithLists(travelId);
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

    const handleAddNewItem = async (category_id: string) => {
        addNewItemToList({ title: inputNewItem, category_id })
        .then(() => {
            fetchCategoriesWithListsData();
        })
        .catch((error) => {
            console.error('Error adding new item:', error);
        });
        setInputNewItem('');
    }

    return (
        <div className="w-11/12 mx-auto my-4">
            {categoriesWithLists?.map((category, index) => (
                <div
                    key={category.id ?? index}
                    className={`border-2 ${calculateTotalCompleted(category) === category.list.length ? 'border-green-400 ' : 'border-violet-400 '} rounded-lg mb-2 overflow-hidden shadow-md transition-all`}
                >
                    <button
                        className={`w-full text-left p-4 ${calculateTotalCompleted(category) === category.list.length ? 'bg-green-100 hover:bg-green-200' : 'bg-violet-100 hover:bg-violet-200'} transition-colors flex justify-between items-center`}
                        onClick={() => toggleItem(index)}
                    >
                        <span className="font-semibold text-neutral-700 capitalize">{category.title}</span>
                        <div className="flex items-center">
                            <div className="bg-white rounded-full p-1 px-4 mr-4 flex items-center justify-center">
                                <span className={`${calculateTotalCompleted(category) === category.list.length ? 'text-green-600' : 'text-violet-600'} text-xs font-semibold transition-all`}>
                                    {calculateTotalCompleted(category)}   / {category.list.length}
                                </span>
                            </div>
                            <span className={`${calculateTotalCompleted(category) === category.list.length ? 'text-green-600' : 'text-violet-600'} transition-all`}>{expandedItems[index] ? '−' : '+'}</span>
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
                                <List key={listItem.id ?? i} {...listItem} updateData={fetchCategoriesWithListsData} />
                            ))}
                            <div className="mx-auto my-4 mb-2 w-full overflow-hidden rounded border-2 border-neutral-200 flex items-center gap-2 px-2 focus-within:border-violet-600">
                                <input
                                    type="text"
                                    value={inputNewItem}
                                    onChange={(e) => setInputNewItem(e.target.value)}
                                    placeholder="Add a New Item"
                                    className="flex-1 bg-transparent py-2 pl-8 text-neutral-800 placeholder:text-neutral-600 focus:outline-none"
                                />
                                <button className="shrink-0 pr-4 text-violet-600 text-md font-normal tracking-wide" onClick={() => handleAddNewItem(category.id)}>
                                    Add Item
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
