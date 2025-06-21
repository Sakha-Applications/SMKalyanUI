// src/components/common/CountryStateCitySelector.js
import React, { useState, useEffect, useRef } from 'react'; // ADD useRef here
import { Country, State, City } from 'country-state-city';
import { Label } from './FormElements';

const CountryStateCitySelector = ({
  formData,
  handleChange,
  countryField = 'currentLocationCountry',
  stateField = 'currentLocationState',
  cityField = 'currentLocation',
  labelPrefix = 'Residing'
}) => {
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);


  useEffect(() => {
    // Only clear dependent fields if it's NOT the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false; // Mark initial mount as done after first run
    } else {
      // Clear dependent fields if country changes AFTER initial mount
      handleChange({ target: { name: stateField, value: '' } });
      handleChange({ target: { name: cityField, value: '' } });
    }

    if (formData[countryField]) {
      const stateList = State.getStatesOfCountry(formData[countryField]);
      setStates(stateList);
    } else {
      setStates([]);
    }
    setCities([]); // Always clear cities when country changes
  }, [formData[countryField], handleChange, stateField, cityField]); // Added handleChange, stateField, cityField to dependencies
 
  // Effect to populate cities based on state selection

  useEffect(() => {
    // Only clear dependent fields if it's NOT the initial mount
    if (isInitialMount.current) { // Check again for state-specific initial mount
      // If we got here due to initial mount, don't clear city
    } else {
      handleChange({ target: { name: cityField, value: '' } }); // Clear city if state changes AFTER initial mount
    }

    if (formData[stateField]) {
      const cityList = City.getCitiesOfState(
        formData[countryField],
        formData[stateField]
      );
      setCities(cityList);
    } else {
      setCities([]);
    }
    }, [formData[stateField], formData[countryField], handleChange, cityField]); // Added formData[countryField], handleChange, cityField

  return (
    <div className="space-y-4">
      {/* Country */}
      <div>
        <Label>{labelPrefix} Country</Label>
        <select
          name={countryField}
          value={formData[countryField] || ''}
          onChange={handleChange}
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
          value={formData[stateField] || ''}
          onChange={handleChange}
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

      {/* City */}
      <div>
        <Label>{labelPrefix} City</Label>
        <select
          name={cityField}
          value={formData[cityField] || ''}
          onChange={handleChange}
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
