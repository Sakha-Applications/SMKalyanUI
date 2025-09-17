import React, { useState, useEffect, useRef } from 'react';
import StyledFormField from './StyledFormField';

const AutocompleteInput = ({
  label,
  name,
  inputValue,
  inputSetter,
  options,
  setOptions,
  show,
  setShow,
  loading,
  searchFn,
  onSelect,
  error,
  helperText,
  delay = 300
}) => {
  const [justSelected, setJustSelected] = useState(false);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  const safeSetShow = typeof setShow === 'function' ? setShow : () => {};
  const safeShow = typeof show === 'boolean' ? show : false;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        safeSetShow(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [safeSetShow]);

  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (inputValue && inputValue.length >= 2) {
        try {
          const results = await searchFn(inputValue);
          setOptions(results || []);
          safeSetShow(true);
        } catch (err) {
          console.error(`Error fetching ${label} options:`, err);
        }
      } else {
        setOptions([]);
        safeSetShow(false);
      }
    }, delay);

    return () => clearTimeout(debounceTimer.current);
  }, [inputValue]); // only re-run when inputValue changes

  const handleOptionSelect = (option) => {
    setJustSelected(true);
    inputSetter(option.label);
    setOptions([]);
    safeSetShow(false);
    onSelect(name, option.label, option.id);
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
          if (inputValue && inputValue.length >= 2) {
            safeSetShow(true);
          } else if (options.length > 0 && !justSelected) {
            safeSetShow(true);
          }
        }}
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
      {safeShow && options.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full max-h-48 overflow-y-auto z-10 mt-1 shadow-md rounded-md">
          {options.map((opt, i) => (
            <li
              key={opt.id || opt.label || i}
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
