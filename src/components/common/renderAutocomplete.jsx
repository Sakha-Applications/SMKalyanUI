// src/components/common/renderAutocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';
import StyledFormField from './StyledFormField'; // Ensure this path is correct

const AutocompleteInput = ({
  label,
  name,
  inputValue,
  inputSetter,
  options, // Array of options
  setOptions, // Setter for the options array (crucial for clearing)
  show,
  setShow,
  loading,
  searchFn, // Function to call for search (e.g., searchMotherTongues)
  onSelect, // Callback when an option is selected
  error,
  helperText,
  delay = 300 // Debounce delay
}) => {
  const [justSelected, setJustSelected] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setShow]);

  // Debounce effect for search input
  useEffect(() => {
    if (justSelected) { // If an item was just selected, prevent immediate re-search
      setJustSelected(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (inputValue && inputValue.length >= 2) {
        const results = await searchFn(inputValue);
        setOptions(results || []); // Use setter to update options state
        setShow(true); // Show dropdown after results are fetched
      } else {
        setOptions([]); // Clear options when input is too short
        setShow(false); // Hide dropdown
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, delay, searchFn, setOptions, justSelected, setShow]);

  const handleOptionSelect = (option) => {
    setJustSelected(true);
    inputSetter(option.label); // Update the input field with selected label
    setOptions([]); // <-- Crucial: Clear options array immediately after selection
    setShow(false); // Hide the dropdown
    onSelect(name, option.label, option.id); // Call parent's onSelect callback
  };

  const isError = !!error;
  const hasTyped = inputValue && inputValue.length > 0;
  const isShort = hasTyped && inputValue.length < 2;
  const currentHelperText = isError
    ? error
    : (helperText || (isShort
      ? `Enter at least 2 characters to search ${label.toLowerCase()}`
      : `Start typing to search ${label.toLowerCase()}`));

  return (
    <div className="autocomplete-dropdown relative" ref={dropdownRef}>
      <StyledFormField
        label={label}
        name={name}
        type="text"
        value={inputValue || ''}
        onChange={(e) => inputSetter(e.target.value)}
        placeholder={`Start typing ${label.toLowerCase()}...`}
        error={isError}
        helperText={currentHelperText}
        onFocus={() => {
            // Only show dropdown on focus if input has enough characters
            // or if there are already options loaded (e.g. from initial load if not empty)
            if (inputValue && inputValue.length >= 2) {
                setShow(true);
            } else if (options.length > 0 && !justSelected) { // Show if pre-populated and not just selected
                setShow(true);
            }
        }}
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
      {show && options.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full max-h-48 overflow-y-auto z-10 mt-1 shadow-md rounded-md">
          {options.map((opt, i) => (
            <li
              key={opt.id || opt.label || i} // Use ID if available, else label/index
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleOptionSelect(opt)} // Use onMouseDown to prevent blur before click
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;