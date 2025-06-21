import React, { useState, useEffect } from 'react';
import { State, City } from 'country-state-city';
import { Label } from '../common/FormElements';

const MultiStateCitySelector = ({
  labelPrefix = '',
  name = 'preferredNativeOrigins',
  selectedValues = [],
  onChange
}) => {
  const [states] = useState(State.getStatesOfCountry('IN'));
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState(
    selectedValues.map((val) => (typeof val === 'string' ? { label: val, value: val, state: '' } : val))
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const getStateNameByCode = (code) => {
    const state = states.find((s) => s.isoCode === code);
    return state ? state.name : '';
  };

  useEffect(() => {
    if (selectedStateCode) {
      const cityList = City.getCitiesOfState('IN', selectedStateCode);
      const formatted = cityList.map((c) => ({
        label: c.name,
        value: c.name,
        state: getStateNameByCode(selectedStateCode)
      }));
      setAllCities(formatted);
      setFilteredCities(formatted);
    } else {
      setAllCities([]);
      setFilteredCities([]);
    }
  }, [selectedStateCode]);

 useEffect(() => {
  if (cityInput.length >= 1) {
    const filtered = allCities
      .filter((city) => city.label.toLowerCase().includes(cityInput.toLowerCase()));

    // ✅ Fallback if no match found
    setFilteredCities(filtered.length > 0 ? filtered : [{ label: ".", value: "." }]);

    setShowDropdown(true);
  } else {
    setShowDropdown(false);
  }
}, [cityInput, allCities]);

  const addCity = (city) => {
    const exists = selectedCities.some(
      (c) => c.value.toLowerCase() === city.value.toLowerCase()
    );
    if (!exists) {
      const updated = [...selectedCities, city];
      setSelectedCities(updated);
      onChange(name, updated);
    }
    setCityInput('');
    setShowDropdown(false);
  };

  const removeCity = (city) => {
    const updated = selectedCities.filter((c) => c.value !== city.value);
    setSelectedCities(updated);
    onChange(name, updated);
  };

  // Group cities by state
  const groupedCities = selectedCities.reduce((groups, city) => {
    const key = city.state || 'Unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(city);
    return groups;
  }, {});

  return (
    <div className="space-y-4 relative">
      {/* State Dropdown */}
      <div>
        <Label>{labelPrefix} State</Label>
        <select
          value={selectedStateCode}
          onChange={(e) => setSelectedStateCode(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Search Input */}
      {allCities.length > 0 && (
        <div className="relative">
          <Label>{labelPrefix} Cities</Label>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Type to search cities..."
            className="w-full border rounded px-2 py-1"
          />
          {showDropdown && filteredCities.length > 0 && (
            <ul className="absolute z-10 bg-white border mt-1 w-full max-h-40 overflow-y-auto shadow-md text-sm">
              {filteredCities.map((city) => (
                <li
                  key={city.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addCity(city)}
                >
                  {city.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Grouped Selected Cities */}
      {Object.keys(groupedCities).length > 0 && (
        <div className="space-y-3">
          {Object.entries(groupedCities).map(([state, cities]) => (
            <div key={state}>
              <div className="text-sm font-medium text-gray-600">{state}</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {cities.map((city) => (
                  <span
                    key={city.value}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {city.label}
                    <button onClick={() => removeCity(city)} className="text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiStateCitySelector;
