// src/components/common/CountryStateCitySelector.js
import React, { useState, useEffect } from 'react'; // useRef removed from here
import { Country, State, City } from 'country-state-city';
import { Label } from './FormElements'; // Assuming Label is imported from here

const CountryStateCitySelector = ({
  formData,
  handleChange,
  countryField = 'currentLocationCountry',
  stateField = 'currentLocationState',
  cityField = 'currentLocation',
  labelPrefix = 'Residing'
}) => {

  // Add these logs at the top of the component to see received props
  console.log(`DEBUG_CSC: ${labelPrefix} - formData received:`, formData);
  console.log(`DEBUG_CSC: ${labelPrefix} - countryField value:`, formData[countryField]);
  console.log(`DEBUG_CSC: ${labelPrefix} - stateField value:`, formData[stateField]);
  console.log(`DEBUG_CSC: ${labelPrefix} - cityField value:`, formData[cityField]);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(null); 
const [selectedState, setSelectedState] = useState(null); 

  // Effect to populate states options list (based on countryField in formData)
  // This useEffect only sets the 'states' dropdown options, it DOES NOT modify formData.
  useEffect(() => {
    // Get the current country value from formData (which could be an ISO code or a name)
    const currentCountryValue = formData[countryField];
    if (currentCountryValue) {
      // Find by ISO code first, then by name for robustness
      const foundCountry = countries.find(c => c.isoCode === currentCountryValue || c.name === currentCountryValue);
      if (foundCountry) {
        setStates(State.getStatesOfCountry(foundCountry.isoCode));
      } else {
        setStates([]); // If country value is invalid or not found
      }
    } else {
      setStates([]); // If country field in formData is empty
    }
    setCities([]); // Always clear cities when country changes (as states change)
  }, [formData[countryField], countries]); // Only depend on formData.countryField and countries list

  // Effect to populate cities options list (based on stateField in formData)
  // This useEffect only sets the 'cities' dropdown options, it DOES NOT modify formData.
  useEffect(() => {
    if (formData[stateField]) {
      const currentCountryValue = formData[countryField];
      const currentStateValue = formData[stateField];
      
      if (currentCountryValue && currentStateValue) {
        const foundCountry = countries.find(c => c.isoCode === currentCountryValue || c.name === currentCountryValue);
        if (foundCountry) {
          const foundState = State.getStatesOfCountry(foundCountry.isoCode).find(s => s.isoCode === currentStateValue || s.name === currentStateValue);
          if (foundState) {
            setCities(City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode));
          } else {
            setCities([]);
          }
        } else {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [formData[stateField], formData[countryField], countries]); // Dependencies

    // ADD THIS NEW useEffect for initializing selectedCountry, selectedState, selectedCity
  // This runs when formData (from parent) changes, to set internal states
  useEffect(() => {
    // Initialize selected Country
    const countryValueInForm = formData[countryField];
    if (countryValueInForm) {
      const initialCountry = countries.find(c => c.name === countryValueInForm); // Find by NAME
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      } else {
        setSelectedCountry(null); // If name not found, clear
      }
    } else {
      setSelectedCountry(null); // If formData has no value, clear
    }

    // Initialize selected State (depends on selectedCountry being set)
    const stateValueInForm = formData[stateField];
    if (stateValueInForm && selectedCountry) { // Needs selectedCountry to get states
      const initialStatesOfCountry = State.getStatesOfCountry(selectedCountry.isoCode);
      const initialState = initialStatesOfCountry.find(s => s.name === stateValueInForm); // Find by NAME
      if (initialState) {
        setSelectedState(initialState);
      } else {
        setSelectedState(null);
      }
    } else {
      setSelectedState(null);
    }

    // City is a string in formData, directly use it for its input
    // This component does not manage selectedCity object, as city select is by name.
  }, [formData[countryField], formData[stateField], countries, selectedCountry]); // Add selectedCountry as a dependency




  // Handlers for Select elements
  const handleCountryChange = (e) => {
const selectedIsoCode = e.target.value; // Value from select option is ISO code
    // Update parent formData for country, and clear state/city
handleChange({ target: { name: countryField, value: countries.find(c => c.isoCode === selectedIsoCode)?.name || '' } }); // Send NAME to formData
    handleChange({ target: { name: stateField, value: '' } });
    handleChange({ target: { name: cityField, value: '' } });
    // The useEffects above will react to formData change to populate states/cities
  };

  const handleStateChange = (e) => {
    const selectedIsoCode = e.target.value; // Value from select option is ISO code
    // Update parent formData for state, and clear city
handleChange({ target: { name: stateField, value: states.find(s => s.isoCode === selectedIsoCode)?.name || '' } }); // Send NAME to formData
    handleChange({ target: { name: cityField, value: '' } });
    // The useEffect above will react to formData change to populate cities
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
    value={selectedCountry?.isoCode || ''} // NOW BOUND TO internal selectedCountry (ISO code)
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
          value={selectedState?.isoCode || ''} // NOW BOUND TO internal selectedState (ISO code)
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

      {/* City */}
      <div>
        <Label>{labelPrefix} City</Label>
        <select
          name={cityField}
          value={formData[cityField] || ''} // City is bound to name
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