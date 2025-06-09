import React, { useEffect, useState } from 'react';
import { Country } from 'country-state-city';
import { Label } from '../common/FormElements';

const MultiCountrySelector = ({
  label = "Country Living In",
  name = "preferredCountries",
  selectedValues = [],
  onChange
}) => {
  const [countries] = useState(Country.getAllCountries().map(c => ({
    label: c.name,
    value: c.name
  })));
  const [input, setInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(selectedValues || []);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (input.length >= 1) {
      const filtered = countries.filter(country =>
        country.label.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [input, countries]);

  const addCountry = (country) => {
    const exists = selectedOptions.some(
      (c) => c.value.toLowerCase() === country.value.toLowerCase()
    );
    if (!exists) {
      const updated = [...selectedOptions, country];
      setSelectedOptions(updated);
      onChange(name, updated);
    }
    setInput('');
    setShowDropdown(false);
  };

  const removeCountry = (country) => {
    const updated = selectedOptions.filter((c) => c.value !== country.value);
    setSelectedOptions(updated);
    onChange(name, updated);
  };

  return (
    <div className="space-y-4 relative">
      <div>
        <Label>{label}</Label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type country name..."
          className="w-full border rounded px-2 py-1"
        />
        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 bg-white border mt-1 w-full max-h-40 overflow-y-auto shadow-md text-sm">
            {filteredOptions.map((country) => (
              <li
                key={country.value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => addCountry(country)}
              >
                {country.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Countries */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((country) => (
            <span
              key={country.value}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {country.label}
              <button
                onClick={() => removeCountry(country)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiCountrySelector;
