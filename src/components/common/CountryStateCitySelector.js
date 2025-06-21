// src/components/common/CountryStateCitySelector.js
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
    console.log(`DEBUG_CSC_EFFECT_INIT: ${labelPrefix} - formData[countryField]:`, formData[countryField], "formData[stateField]:", formData[stateField]);

    // Initialize selectedCountry
    const countryValueInForm = formData[countryField]; // This should be an ISO code (e.g., 'IN', 'AU')
    const initialCountry = countries.find(c => c.isoCode === countryValueInForm);
    if (initialCountry && initialCountry.isoCode !== selectedCountry?.isoCode) { // Only update if changed
        setSelectedCountry(initialCountry);
    } else if (!countryValueInForm && selectedCountry) { // Clear if value removed
        setSelectedCountry(null);
    }

    // Initialize selectedState (depends on selectedCountry being resolved)
    // We need a stable selectedCountry reference for this, or re-find it.
    const stateValueInForm = formData[stateField]; // This should be an ISO code (e.g., 'KA', 'QLD')
    // Find states for the current country selected (either from prop or previous selection)
    const currentCountryForState = initialCountry || selectedCountry;

    if (stateValueInForm && currentCountryForState) {
        const availableStatesForCurrentCountry = State.getStatesOfCountry(currentCountryForState.isoCode);
        const initialState = availableStatesForCurrentCountry.find(s => s.isoCode === stateValueInForm);
        if (initialState && initialState.isoCode !== selectedState?.isoCode) { // Only update if changed
            setSelectedState(initialState);
        } else if (!stateValueInForm && selectedState) { // Clear if value removed
            setSelectedState(null);
        }
    } else if (selectedState) { // Clear if stateValueInForm is empty or no country
        setSelectedState(null);
    }

    // City is a string in formData and managed directly in value prop, no internal state for it.
  }, [formData[countryField], formData[stateField], countries]); // Add countries as dep because find uses it

  // Effect to populate states options list based on selectedCountry internal state
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStates([]);
    }
    setCities([]); // Always clear cities when states list potentially changes
  }, [selectedCountry]);

  // Effect to populate cities options list based on selectedState internal state
  useEffect(() => {
    if (selectedState && selectedCountry) {
      setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry]);


  // Handlers for Select elements (these correctly send NAME to parent's formData)
  // This means MyProfilePage will store names for Country/State after user interaction.
  // We'll address this in handleUpdate of MyProfilePage to convert names back to ISO for backend.
  const handleCountryChange = (e) => {
    const selectedIsoCode = e.target.value; // Value from select option is ISO code
    const countryName = countries.find(c => c.isoCode === selectedIsoCode)?.name || '';
    handleChange({ target: { name: countryField, value: countryName } }); // Send NAME to formData
    handleChange({ target: { name: stateField, value: '' } }); // Clear state in formData
    handleChange({ target: { name: cityField, value: '' } });   // Clear city in formData
  };

  const handleStateChange = (e) => {
    const selectedIsoCode = e.target.value; // Value from select option is ISO code
    const stateName = states.find(s => s.isoCode === selectedIsoCode)?.name || '';
    handleChange({ target: { name: stateField, value: stateName } }); // Send NAME to formData
    handleChange({ target: { name: cityField, value: '' } });   // Clear city in formData
  };

  const handleCityChange = (e) => {
    const selectedValue = e.target.value; // This is the city name from the option value
    handleChange({ target: { name: cityField, value: selectedValue } });
  };

  return (
    <>
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

      <div>
        <Label>{labelPrefix} State</Label>
        <select
          name={stateField}
          value={selectedState?.isoCode || ''} // Bound to internal state (ISO code)
          onChange={handleStateChange}
          className="w-full border rounded px-2 py-1"
          disabled={!states.length}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>{labelPrefix} City</Label>
        <select
          name={cityField}
          value={formData[cityField] || ''} // City is bound to name from formData
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