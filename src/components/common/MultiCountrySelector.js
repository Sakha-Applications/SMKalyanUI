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
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fix 1: Properly sync selectedValues prop with internal state
  useEffect(() => {
    // Ensure selectedValues is always an array and has proper structure
    const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];
    
    // Convert selectedValues to proper format if needed
    const formattedValues = safeSelectedValues.map(item => {
      // Handle both string values and object values
      if (typeof item === 'string') {
        return { label: item, value: item };
      } else if (item && typeof item === 'object' && item.value) {
        return item;
      }
      return null;
    }).filter(Boolean); // Remove null values
    
    setSelectedOptions(formattedValues);
  }, [selectedValues]);

  useEffect(() => {
    if (input.length >= 1) {
      const filtered = countries.filter(country =>
        country.label.toLowerCase().includes(input.toLowerCase()) &&
        // Exclude already selected countries
        !selectedOptions.some(selected => 
          selected.value.toLowerCase() === country.value.toLowerCase()
        )
      );
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [input, countries, selectedOptions]);

  const addCountry = (country) => {
    const exists = selectedOptions.some(
      (c) => c.value.toLowerCase() === country.value.toLowerCase()
    );
    if (!exists) {
      const updated = [...selectedOptions, country];
      setSelectedOptions(updated);
      // Fix 2: Pass the correct data format to parent
      if (onChange) {
        onChange(name, updated);
      }
    }
    setInput('');
    setShowDropdown(false);
  };

  const removeCountry = (country) => {
    const updated = selectedOptions.filter((c) => c.value !== country.value);
    setSelectedOptions(updated);
    // Fix 3: Pass the correct data format to parent
    if (onChange) {
      onChange(name, updated);
    }
  };

  // Fix 4: Add error boundary for map function
  const renderSelectedOptions = () => {
    if (!Array.isArray(selectedOptions) || selectedOptions.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {selectedOptions.map((country, index) => (
          <span
            key={`${country.value}-${index}`} // More robust key
            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {country.label || country.value}
            <button
              type="button"
              onClick={() => removeCountry(country)}
              className="text-red-500 font-bold hover:text-red-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    );
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
          className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Selected Countries with error handling */}
      {renderSelectedOptions()}
    </div>
  );
};

export default MultiCountrySelector;