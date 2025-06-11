// src/components/common/StateCitySelector.js
import React, { useState, useEffect } from 'react';
import { State, City } from 'country-state-city';

const StateCitySelector = ({
  formData,
  handleChange,
  cityField = "currentLocation",
  stateField = "stateCode",
  labelPrefix = "",
}) => {
  const [states] = useState(State.getStatesOfCountry('IN'));
  const [selectedStateCode, setSelectedStateCode] = useState(formData[stateField] || "");
  const [cities, setCities] = useState([]);
  const [isOtherCity, setIsOtherCity] = useState(false);

  useEffect(() => {
  setSelectedStateCode(formData[stateField] || "");
}, [formData[stateField]]);

  useEffect(() => {
    if (selectedStateCode) {
      const cityList = City.getCitiesOfState("IN", selectedStateCode);
      setCities(cityList);
      setIsOtherCity(false);
    } else {
      setCities([]);
    }
  }, [selectedStateCode]);

  useEffect(() => {
  if (formData[stateField]) {
    const cityList = City.getCitiesOfState("IN", formData[stateField]);
    setCities(cityList);
  }
}, [formData[stateField]]);

  return (
    <div className="space-y-3">
      {/* State Dropdown */}
      <div>
        <label className="block font-semibold">{labelPrefix} State</label>
        <select
          value={selectedStateCode}
          onChange={(e) => {
            const code = e.target.value;
            setSelectedStateCode(code);
 handleChange({ target: { name: stateField, value: code } }); // update formData
  handleChange({ target: { name: cityField, value: "" } });    // clear city
          }}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* City Dropdown or Text Input */}
      <div>
        <label className="block font-semibold">{labelPrefix} City</label>
        {!isOtherCity ? (
          <select
            name={cityField}
            value={formData[cityField] || ""}
            onChange={(e) => {
              if (e.target.value === "Others") {
                setIsOtherCity(true);
                handleChange({ target: { name: cityField, value: "" } });
              } else {
                handleChange(e);
              }
            }}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
            <option value="Others">Others</option>
          </select>
        ) : (
          <input
            type="text"
            name={cityField}
            placeholder="Enter your city"
            value={formData[cityField] || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        )}
      </div>
    </div>
  );
};

export default StateCitySelector;
