// src/components/ModifyProfile/PartnerPreferences/helpers/EnhancedAutocomplete.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Label as L, Input as I } from '../../../common/FormElements';

const EnhancedAutocomplete = ({
  label,
  name,
  inputValue,      // Controlled by parent (MyProfilePage)
  inputSetter,     // Setter for inputValue from parent
  options,         // Options list from parent (MyProfilePage)
  setOptions,      // Setter for options from parent
  searchFn,        // Function to fetch options from parent (MyProfilePage)
  onChange,        // Handler for selection from parent (e.g., handleEducationChange)
  errors = {},
  placeholder = "",
  loading = false,
  // New props for internal visibility if not controlled externally
  show: externalShow = null,
  setShow: setExternalShow = null,
}) => {
  // Use internal state for dropdown visibility if not controlled externally
  const [internalShowDropdown, setInternalShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Determine which show/setShow to use (external preference, then internal)
  const isDropdownVisible = externalShow !== null ? externalShow : internalShowDropdown;
  const setDropdownVisible = externalShow !== null ? setExternalShow : setInternalShowDropdown;

  const isError = !!errors[name];
  const helperText = isError ? errors[name] : placeholder;

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setDropdownVisible]);

  return (
    <div className="autocomplete-dropdown relative" ref={dropdownRef}>
      <L>{label} {label && <span className="text-red-500">*</span>}</L>
      <I
        name={name}
        value={inputValue}
        onChange={async (e) => {
          const val = e.target.value;
          inputSetter(val); // Update parent's inputValue
          if (val.length >= 2) {
            const results = await searchFn(val);
            setOptions(results || []); // Update parent's options
            setDropdownVisible(true); // Show dropdown
          } else {
            setOptions([]); // Clear options
            setDropdownVisible(false); // Hide dropdown
          }
        }}
        onFocus={() => {
          // If input has some value, trigger a search to populate options on focus
          // or just show the dropdown if options are already present
          if (inputValue.length >= 2) { // Allow showing on focus if already typed enough
              searchFn(inputValue).then(results => {
                setOptions(results || []);
                setDropdownVisible(true);
              });
          } else if (options.length > 0) { // If options already exist (e.g., pre-filled)
              setDropdownVisible(true);
          } else { // For empty input, just show the box, typing will load options
              setDropdownVisible(true);
          }
        }}
        onBlur={() => {
          // Delay hiding to allow click on an option before blur closes it
          setTimeout(() => setDropdownVisible(false), 200);
        }}
        error={isError}
        helperText={helperText}
        autoComplete="off"
        ref={inputRef} // Assign ref to the input
        placeholder={placeholder}
        disabled={loading} // Disable input while loading options if desired
      />
      {loading && inputValue.length >= 2 && (
        <div className="absolute left-0 top-full mt-1 p-2 text-xs text-gray-500">
          Loading...
        </div>
      )}
      {isDropdownVisible && options.length > 0 && (
        <ul className="absolute z-10 bg-white border max-h-40 overflow-y-auto mt-1 w-full shadow-md text-sm">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onMouseDown={(e) => { // Use onMouseDown to prevent blur
                e.preventDefault();
                inputSetter(opt.label); // Update input field text
                setDropdownVisible(false); // Hide dropdown
                onChange(opt); // Call parent's onChange with selected object
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {isDropdownVisible && options.length === 0 && inputValue.length >= 2 && !loading && (
        <div className="absolute z-10 bg-white border mt-1 w-full shadow-md text-sm px-3 py-2 text-gray-500">
          No results found.
        </div>
      )}
    </div>
  );
};

export default EnhancedAutocomplete;