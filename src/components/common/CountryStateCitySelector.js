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
  // NOW EXPECTS ISO CODES FROM formData for countryField and stateField
  useEffect(() => {
    console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - formData[countryField]:`, formData[countryField], "formData[stateField]:", formData[stateField]);

    // Initialize selectedCountry
    const countryValueInForm = formData[countryField]; // This should be an ISO code (e.g., 'IN', 'AU')
    const initialCountry = countries.find(c => c.isoCode === countryValueInForm);

    // Only update if the value from formData is different from the current internal state
    if (initialCountry && initialCountry.isoCode !== selectedCountry?.isoCode) {
        setSelectedCountry(initialCountry);
        console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - Setting selectedCountry to: ${initialCountry.isoCode}`);
    } else if (!countryValueInForm && selectedCountry) { // Clear internal state if formData value is removed/empty
        setSelectedCountry(null);
        console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - Clearing selectedCountry.`);
    }

    // Initialize selectedState (depends on selectedCountry being resolved)
    // Use the `initialCountry` found in this same effect if available, otherwise rely on `selectedCountry` state (from a previous render)
    const stateValueInForm = formData[stateField]; // This should be an ISO code (e.g., 'KA', 'QLD')
    const countryForStateLookup = initialCountry || selectedCountry; // Prefer the country resolved in this effect pass

    if (stateValueInForm && countryForStateLookup) {
        const availableStatesForCountry = State.getStatesOfCountry(countryForStateLookup.isoCode);
        const initialState = availableStatesForCountry.find(s => s.isoCode === stateValueInForm);

        // Only update if the value from formData is different from the current internal state
        if (initialState && initialState.isoCode !== selectedState?.isoCode) {
            setSelectedState(initialState);
            console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - Setting selectedState to: ${initialState.isoCode}`);
        } else if (!stateValueInForm && selectedState) { // Clear if value removed
            setSelectedState(null);
            console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - Clearing selectedState.`);
        }
    } else if (selectedState) { // Clear if stateValueInForm is empty or no country for lookup
        setSelectedState(null);
        console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - Clearing selectedState (no value or no country).`);
    }

    // City is a string in formData, directly use it for its input, no internal state for it in this component.
  }, [formData[countryField], formData[stateField], countries, selectedCountry, selectedState]); // Ensure all states and props are dependencies to react to changes


  // Effect to populate 'states' dropdown options based on the internal `selectedCountry`
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStates([]); // Clear states if no country is selected
    }
    // Clear cities whenever states change (e.g., new country selected)
    setCities([]);
  }, [selectedCountry]); // Only re-run when selectedCountry changes

  // Effect to populate 'cities' dropdown options based on internal `selectedState` and `selectedCountry`
  useEffect(() => {
    if (selectedState && selectedCountry) {
      setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    } else {
      setCities([]); // Clear cities if no state or country is selected
    }
  }, [selectedState, selectedCountry]); // Only re-run when selectedState or selectedCountry changes


  // FIXED: Handlers for Select elements - create proper event objects
  const handleCountryChange = (e) => {
    const selectedIsoCode = e.target.value; // Value from select option is ISO code
    const countryName = countries.find(c => c.isoCode === selectedIsoCode)?.name || '';
    setSelectedCountry(countries.find(c => c.isoCode === selectedIsoCode) || null); // Update internal state
    setSelectedState(null); // Clear internal state

    // Create proper event objects for handleChange
    handleChange({ target: { name: countryField, value: countryName } });
    handleChange({ target: { name: stateField, value: '' } });
    handleChange({ target: { name: cityField, value: '' } });
  };

  const handleStateChange = (e) => {
    const selectedIsoCode = e.target.value; // Value from select option is ISO code
    const stateName = states.find(s => s.isoCode === selectedIsoCode)?.name || '';
    setSelectedState(states.find(s => s.isoCode === selectedIsoCode) || null); // Update internal state

    // Create proper event objects for handleChange
    handleChange({ target: { name: stateField, value: stateName } });
    handleChange({ target: { name: cityField, value: '' } });
  };

  const handleCityChange = (e) => {
    const selectedValue = e.target.value; // This is the city name from the option value
    handleChange({ target: { name: cityField, value: selectedValue } });
  };

  return (
    <div className="space-y-4">
      {/* Country */}
      <div>
        <Label>{labelPrefix} Country</Label>
        <select
          name={countryField}
          value={selectedCountry?.isoCode || ''} // Bound to internal state (ISO code)
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
          value={selectedState?.isoCode || ''} // Bound to internal state (ISO code)
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
    </div>
  );
};

export default CountryStateCitySelector;