'use client';

import Select, { SingleValue } from 'react-select';
import { countries } from 'countries-list';
import { getEmojiFlag } from 'countries-list';

interface CountryOption {
  value: string;
  label: string;
}

interface SearchableCountrySelectProps {
  setSelectedCountry: (country: CountryOption | null) => void;
  selectedCountry: CountryOption | null;
}

export default function SearchableCountrySelect({ setSelectedCountry, selectedCountry }: SearchableCountrySelectProps) {

  // Map countries to React Select options with emoji flags
  const options: CountryOption[] = Object.entries(countries).map(([code, data]) => ({
    value: data.name,
    label: `${getEmojiFlag(code)} ${data.name}`,
  }));

  const handleChange = (option: SingleValue<CountryOption>) => {
    setSelectedCountry(option);
  };

  return (
    <div className="w-full">
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
