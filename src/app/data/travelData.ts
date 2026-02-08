// data.ts
export interface Item {
  title: string;
  is_completed?: boolean;
  is_deletable?: boolean;
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
      title: "documents & admin",
      orderBy: 1,
      list: [
        { title: "passport / visa", orderBy: 1 },
        { title: "ID cards / driver’s license", orderBy: 2 },
        { title: "vaccination certificates / health records", orderBy: 3 },
        { title: "permits / travel authorizations", orderBy: 4 },
        { title: "travel insurance documents", orderBy: 5 },
        { title: "emergency contact list", orderBy: 6 },
        { title: "copies of important documents (digital & paper)", orderBy: 7 }
      ],
    },
    {
      title: "transport",
      orderBy: 2,
      list: [
        { title: "tickets / boarding passes / reservations", orderBy: 1 },
        { title: "departure & arrival info (station, port, schedule)", orderBy: 2 },
        { title: "seat / cabin / berth assignment", orderBy: 3 },
        { title: "luggage check / info", orderBy: 4 },
        { title: "travel pillow / blanket", orderBy: 5 },
        { title: "pen (for forms / customs / booking changes)", orderBy: 6 },
        { title: "emergency contacts & travel info", orderBy: 7 }
      ],
    },
    {
      title: "accommodation",
      orderBy: 3,
      list: [
        { title: "booking confirmation / reservation details", orderBy: 1 },
        { title: "check-in / check-out info", orderBy: 2 },
        { title: "hotel / hostel / Airbnb address & contact", orderBy: 3 },
        { title: "ID / passport required for check-in", orderBy: 4 },
        { title: "room preferences / special requests", orderBy: 5 },
        { title: "emergency contacts / hotel contacts", orderBy: 6 },
        { title: "key / access card / door code", orderBy: 7 },
        { title: "amenities info (Wi-Fi, breakfast, gym, etc.)", orderBy: 8 }
      ],
    },
    {
      title: "travel essentials",
      orderBy: 4,
      list: [
        { title: "wallet (cash & cards)", orderBy: 1 },
        { title: "phone & charger / power bank", orderBy: 2 },
        { title: "face mask & hand sanitizer", orderBy: 3 },
        { title: "medications / prescriptions", orderBy: 4 },
        { title: "snacks & water bottle", orderBy: 5 },
        { title: "travel documents (tickets, confirmations, itineraries)", orderBy: 6 },
        { title: "insurance documents / travel insurance", orderBy: 7 }
      ],
    },
    {
      title: "pack / luggage",
      orderBy: 5,
      list: [
        { title: "backpack / suitcase", orderBy: 1 },
        { title: "toiletries (travel-size)", orderBy: 2 },
        { title: "first aid kit", orderBy: 3 },
        { title: "entertainment (book, tablet, headphones)", orderBy: 4 },
        { title: "sunglasses / hat", orderBy: 5 },
        { title: "luggage locks / tags", orderBy: 6 },
        { title: "travel laundry bag / packing cubes", orderBy: 7 }
      ],
    },
    {
      title: "clothing",
      orderBy: 6,
      list: [
        { title: "tops / t-shirts / shirts", orderBy: 1 },
        { title: "bottoms / pants / shorts / skirts", orderBy: 2 },
        { title: "underwear & socks", orderBy: 3 },
        { title: "sleepwear / pajamas", orderBy: 4 },
        { title: "light jacket / sweater", orderBy: 5 },
        { title: "heavy jacket / coat (if needed)", orderBy: 6 },
        { title: "swimwear", orderBy: 7 },
        { title: "shoes: casual / walking / formal / sandals", orderBy: 8 },
        { title: "exercise / sports clothes", orderBy: 9 },
        { title: "rain gear: raincoat / poncho / umbrella", orderBy: 10 },
        { title: "accessories: belt, scarf, hat", orderBy: 11 }
      ],
    },
    {
      title: "tourist spots / activities",
      orderBy: 7,
      list: [
        { title: "museum / historical monument / national park / beach", orderBy: 1 },
        { title: "map / guidebook / app", orderBy: 2 },
        { title: "camera", orderBy: 3 },
        { title: "sunscreen & hat", orderBy: 4 },
        { title: "comfortable walking shoes", orderBy: 5 },
        { title: "pre-booked tickets / confirmations", orderBy: 6 }
      ],
    },
    {
      title: "optional / comfort items",
      orderBy: 8,
      list: [
        { title: "neck pillow / eye mask", orderBy: 1 },
        { title: "earplugs / noise-canceling headphones", orderBy: 2 },
        { title: "snacks / chewing gum", orderBy: 3 },
        { title: "light blanket / shawl", orderBy: 4 },
        { title: "waterproof bag / ziplock bags", orderBy: 5 },
        { title: "small sewing kit", orderBy: 6 },
        { title: "travel journal / notebook", orderBy: 7 }
      ],
    },
    {
      title: "safety & security",
      orderBy: 9,
      list: [
        { title: "personal alarm / whistle", orderBy: 1 },
        { title: "luggage locks / tags", orderBy: 2 },
        { title: "emergency contact list", orderBy: 3 },
        { title: "travel insurance / medical info", orderBy: 4 }
      ],
    },
    {
      title: "travel apps & tech",
      orderBy: 10,
      list: [
        { title: "navigation / maps (Google Maps, Here Maps, etc.)", orderBy: 1 },
        { title: "ride-hailing apps (Uber, Lyft, local taxis)", orderBy: 2 },
        { title: "public transport apps (train, bus, ferry schedules)", orderBy: 3 },
        { title: "currency exchange / conversion apps", orderBy: 4 },
        { title: "translation apps", orderBy: 5 },
        { title: "travel booking apps (hotels, flights, activities)", orderBy: 6 },
        { title: "weather apps", orderBy: 7 },
        { title: "messaging / communication apps (WhatsApp, Messenger, etc.)", orderBy: 8 },
        { title: "emergency / safety apps", orderBy: 9 },
        { title: "digital tickets / boarding passes apps", orderBy: 10 },
        { title: "offline maps & guides (for areas without internet)", orderBy: 11 }
      ],
    },
    {
      title: "travel equipment / gadgets",
      orderBy: 11,
      list: [
        { title: "camera / lenses / tripod", orderBy: 1 },
        { title: "drone / spare batteries / remote", orderBy: 2 },
        { title: "selfie stick / gimbal / stabilizer", orderBy: 3 },
        { title: "action cameras (GoPro, etc.)", orderBy: 4 },
        { title: "memory cards / external storage", orderBy: 5 },
        { title: "charging cables / power banks for devices", orderBy: 6 },
        { title: "camera bag / protective case", orderBy: 7 },
        { title: "cleaning kit for lenses / screens", orderBy: 8 }
      ],
    },
  ],
};
