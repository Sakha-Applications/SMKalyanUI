import React, { useState, useEffect, useRef } from 'react';
import { Input } from './FormElements'; // Assuming Input is in FormElements

const AutocompleteInput = ({
  label,
  name,
  inputValue,
  onInputChange,
  onSelect,
  searchFn,
  error,
  helperText
}) => {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prevInputValueRef = useRef(inputValue);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const hasInputValueChanged = inputValue !== prevInputValueRef.current;
    if (isFocused && hasInputValueChanged) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        if (inputValue && inputValue.length >= 2) {
          setLoading(true);
          try {
            const results = await searchFn(inputValue);
            setOptions(results || []);
            setShowOptions(true);
          } catch (err) {
            console.error(`Error fetching options for ${label}:`, err);
          }
          setLoading(false);
        } else {
          setOptions([]);
          setShowOptions(false);
        }
      }, 300);
    }
    prevInputValueRef.current = inputValue;
    return () => clearTimeout(debounceTimer.current);
  }, [inputValue, isFocused, searchFn, label]);

  const handleOptionSelect = (option) => {
    setShowOptions(false);
    onSelect(name, option);
  };

  return (
    <div className="autocomplete-dropdown relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
      <Input
        type="text"
        value={inputValue || ''}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={`Start typing ${label.toLowerCase()}...`}
        error={!!error}
        helperText={error || helperText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setTimeout(() => setShowOptions(false), 200);
        }}
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
      {showOptions && options.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full max-h-48 overflow-y-auto z-10 mt-1 shadow-md rounded-md">
          {options.map((opt, i) => (
            <li
              key={opt.id || i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleOptionSelect(opt)}
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