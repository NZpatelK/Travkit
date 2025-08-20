'use client';

import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { countries } from 'countries-list';
import { getEmojiFlag } from 'countries-list';

interface CountryOption {
  value: string;
  label: string;
}

export default function SearchableCountrySelect() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  // Map countries to React Select options with emoji flags
  const options: CountryOption[] = Object.entries(countries).map(([code, data]) => ({
    value: code,
    label: `${getEmojiFlag(code)} ${data.name}`,
  }));

  const handleChange = (option: SingleValue<CountryOption>) => {
    setSelectedCountry(option);
  };

  console.log(countries);

  return (
    <div className="w-72">
      <Select
        options={options}
        value={selectedCountry}
        onChange={handleChange}
        placeholder="Search and select a country..."
        isClearable
      />
    </div>
  );
}
