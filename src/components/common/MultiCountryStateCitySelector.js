// src/components/common/MultiCountryStateCitySelector.js
import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { Label } from './FormElements';
import Select from 'react-select';

const MultiCountryStateCitySelector = ({
  name,
  labelPrefix,
  selectedValues = [],
  onChange
}) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [entries, setEntries] = useState(selectedValues);

useEffect(() => {
  if (selectedValues?.length > 0) {
    const last = selectedValues[selectedValues.length - 1];
    const allCountries = Country.getAllCountries();
    const countryObj = allCountries.find(c => c.isoCode === last.country);

    if (countryObj) {
      setSelectedCountry({ value: countryObj.isoCode, label: countryObj.name });

      const states = State.getStatesOfCountry(countryObj.isoCode).map(s => ({
        value: s.isoCode,
        label: s.name
      }));
      setStateOptions(states);

      if (states.length === 0) {
        // No states available — fallback to cities of country
        const cities = City.getCitiesOfCountry(countryObj.isoCode).map(c => ({
          value: c.name,
          label: c.name
        }));
        setCityOptions(cities);

        const cityObj = cities.find(c => c.value === last.city);
        if (cityObj) {
          setSelectedCity({ value: cityObj.value, label: cityObj.label });
        }
      } else {
        const stateObj = states.find(s => s.value === last.state);
        if (stateObj) {
          setSelectedState({ value: stateObj.value, label: stateObj.label });

          const cities = City.getCitiesOfState(countryObj.isoCode, stateObj.value).map(c => ({
            value: c.name,
            label: c.name
          }));
          setCityOptions(cities);

          const cityObj = cities.find(c => c.value === last.city);
          if (cityObj) {
            setSelectedCity({ value: cityObj.value, label: cityObj.label });
          }
        }
      }
    }
  }
}, [selectedValues]);



  useEffect(() => {
    const countries = Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: c.name
    }));
    setCountryOptions(countries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.value).map(s => ({
        value: s.isoCode,
        label: s.name
      }));
      setStateOptions(states);
      setSelectedState(null);
      setSelectedCity(null);
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry.value, selectedState.value).map(c => ({
        value: c.name,
        label: c.name
      }));
      setCityOptions(cities);
    } else {
      setCityOptions([]);
    }
  }, [selectedCountry, selectedState]);

  const handleAddEntry = () => {
    if (selectedCountry || selectedState || selectedCity) {
      const newEntry = {
  country: selectedCountry?.label || '.',
  state: selectedState?.label || '.',
  city: selectedCity?.label || '.',
  label: `${selectedCountry?.label || '.'} / ${selectedState?.label || '.'} / ${selectedCity?.label || '.'}`,
  value: `${selectedCountry?.label || '.'}/${selectedState?.label || '.'}/${selectedCity?.label || '.'}`
};

      const updated = [...entries, newEntry];
      setEntries(updated);
      onChange(name, updated);

      // Reset selection
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
    }
  };

  const handleRemove = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    onChange(name, updated);
  };

  return (
    <div className="space-y-2">
      <Label>{labelPrefix} Country/State/City</Label>
      <div className="flex gap-2">
        <Select
          options={countryOptions}
          value={selectedCountry}
          onChange={setSelectedCountry}
          placeholder="Select Country"
          className="flex-1"
        />
        <Select
          options={stateOptions}
          value={selectedState}
          onChange={setSelectedState}
          placeholder="Select State"
          isDisabled={!selectedCountry}
          className="flex-1"
        />
        <Select
          options={cityOptions}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="Select City"
          isDisabled={!selectedState}
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleAddEntry}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add ➕
        </button>
      </div>

      {/* Display selected values */}
      <ul className="list-disc pl-5 text-sm">
        {entries.map((entry, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{entry.label}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-600 text-xs ml-4"
            >
              ✖ Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiCountryStateCitySelector;
