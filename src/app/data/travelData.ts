// data.ts
export interface Item {
  title: string;
  is_completed?: boolean;
  orderBy: number;
}

export interface Category {
  id?: number;
  title: string;
  orderBy: number;
  list: Item[];
}

export interface TravelDataProps {
  categories: Category[];
}

export const travelData: TravelDataProps = {
  categories: [
    {
      title: "plane",
      orderBy: 1,
      list: [
        { title: "boarding pass", orderBy: 1 },
        { title: "luggage", orderBy: 2 },
        { title: "in-flight entertainment", orderBy: 3 },
        { title: "travel pillow", orderBy: 4 },
      ],
    },
    {
      title: "bus",
      orderBy: 2,
      list: [
        { title: "bus ticket", orderBy: 1 },
        { title: "bus stop", orderBy: 2 },
        { title: "seat reservation", orderBy: 3 },
        { title: "travel schedule", orderBy: 4 },
      ],
    },
    {
      title: "tourist spot",
      orderBy: 3,
      list: [
        { title: "museum", orderBy: 1 },
        { title: "historical monument", orderBy: 2 },
        { title: "national park", orderBy: 3 },
        { title: "beach", orderBy: 4 },
      ],
    },
    {
      title: "clothe",
      orderBy: 4,
      list: [
        { title: "jacket", orderBy: 1 },
        { title: "t-shirt", orderBy: 2 },
        { title: "hiking boots", orderBy: 3 },
        { title: "hat", orderBy: 4 },
      ],
    },
    {
      title: "pack",
      orderBy: 5,
      list: [
        { title: "backpack", orderBy: 1 },
        { title: "toiletries", orderBy: 2 },
        { title: "first aid kit", orderBy: 3 },
        { title: "charger", orderBy: 4 },
      ],
    },
  ],
};
