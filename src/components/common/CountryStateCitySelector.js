// src/components/common/CountryStateCitySelector.js
// testing git commit detection
import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { Label } from './FormElements'; // Assuming Label is imported from here
import { Select, Input } from './FormElements'; // Ensure Select and Input are imported

const CountryStateCitySelector = ({
  formData,
  handleChange,
  countryField = 'currentLocationCountry',
  stateField = 'currentLocationState',
  cityField = 'currentLocation',
  labelPrefix = 'Residing'
}) => {

  // Debug logs to see received props and internal state changes
  console.log(`DEBUG_CSC: ${labelPrefix} - formData received:`, formData);
  console.log(`DEBUG_CSC: ${labelPrefix} - countryField value:`, formData[countryField]);
  console.log(`DEBUG_CSC: ${labelPrefix} - stateField value:`, formData[stateField]);
  console.log(`DEBUG_CSC: ${labelPrefix} - cityField value:`, formData[cityField]);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Effect to set internal states (selectedCountry, selectedState) based on formData props
  // NOW EXPECTS ISO CODES FROM formData
  useEffect(() => {
    const countryCode = formData[countryField];
    const stateCode = formData[stateField];
    console.log(`DEBUG_CSC: ${labelPrefix} - useEffect[formData]: countryCode=${countryCode}, stateCode=${stateCode}`);
    if (countryCode) {
      const country = Country.getCountryByCode(countryCode);
      setSelectedCountry(country);
      if (stateCode) {
        const allStates = State.getStatesOfCountry(countryCode);
        const state = allStates.find(s => s.isoCode === stateCode);
        setSelectedState(state);
      } else {
        setSelectedState(null); // Reset state if stateCode is not present
      }
    } else {
      setSelectedCountry(null); // Reset country if countryCode is not present
      setSelectedState(null); // Also reset state
    }
  }, [formData, countryField, stateField, labelPrefix]);

  // Effect to populate states when selectedCountry changes
  useEffect(() => {
    console.log(`DEBUG_CSC: ${labelPrefix} - useEffect[selectedCountry]:`, selectedCountry);
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, labelPrefix]);

  // Effect to populate cities when selectedState changes
  useEffect(() => {
    console.log(`DEBUG_CSC: ${labelPrefix} - useEffect[selectedState]:`, selectedState);
    if (selectedState && selectedCountry) {
      setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry, labelPrefix]);

    // --- START OF NEW CODE ---
    // ADDITION: This new useEffect hook listens for changes in the formData prop.
    // Its purpose is to correctly populate the states and cities dropdowns
    // when the user navigates back to this page with data already selected.
    useEffect(() => {
      const countryCode = formData[countryField];
      const stateCode = formData[stateField];

      // If a country code exists in the form data, fetch and set the corresponding states.
      if (countryCode) {
        setStates(State.getStatesOfCountry(countryCode));
      }

      // If both a country code and a state code exist, fetch and set the corresponding cities.
      if (countryCode && stateCode) {
        setCities(City.getCitiesOfState(countryCode, stateCode));
      }
  }, [formData, countryField, stateField]); // This effect runs when formData changes.
  // --- END OF NEW CODE ---


  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    console.log(`DEBUG_CSC: ${labelPrefix} - handleCountryChange: countryCode=${countryCode}`);
    const country = Country.getCountryByCode(countryCode);
    setSelectedCountry(country);
    setSelectedState(null); // Reset state selection

    // Propagate change up, including clearing dependent fields
    handleChange({ target: { name: countryField, value: countryCode } });
    handleChange({ target: { name: stateField, value: '' } }); // Clear state
    handleChange({ target: { name: cityField, value: '' } }); // Clear city
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    console.log(`DEBUG_CSC: ${labelPrefix} - handleStateChange: stateCode=${stateCode}`);
    if (selectedCountry) {
      const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
      const state = allStates.find(s => s.isoCode === stateCode);
      setSelectedState(state);
    }

    // Propagate change up, including clearing city
    handleChange({ target: { name: stateField, value: stateCode } });
    handleChange({ target: { name: cityField, value: '' } }); // Clear city
  };

  // Generic handler for city, just propagates up
  const handleCityChange = (e) => {
    console.log(`DEBUG_CSC: ${labelPrefix} - handleCityChange: value=${e.target.value}`);
    handleChange(e);
  };


  return (
    <>
      {/* Country */}
      <div>
        <Label>{labelPrefix} Country</Label>
        <select
          name={countryField}
          value={formData[countryField] || ''} // Country is bound to isoCode from formData
          onChange={handleCountryChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <Label>{labelPrefix} State</Label>
        <select
          name={stateField}
          value={formData[stateField] || ''} // State is bound to isoCode from formData
          onChange={handleStateChange}
          className="w-full border rounded px-2 py-1"
          disabled={!states.length} // Disable if no states are available
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <Label>{labelPrefix} City</Label>
        {/*
        <Input
          id={`${cityField}`}
          name={cityField}
          value={formData[cityField] || ''} // City is bound to name from formData
          onChange={handleCityChange}
          placeholder={`Enter ${labelPrefix} city`}
          className="w-full"
          disabled={!cities.length} // Disable if no cities are available (implies no state/country selected)
        />
        */}
        {/* If city is an Autocomplete, its value/inputValue binding would be different */}
        {/* If using a select for cities: */}

        <select
          name={cityField}
          value={formData[cityField] || ''}
          onChange={handleCityChange}
          className="w-full border rounded px-2 py-1"
          disabled={!cities.length}
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

      </div>
    </>
  );
};

export default CountryStateCitySelector;