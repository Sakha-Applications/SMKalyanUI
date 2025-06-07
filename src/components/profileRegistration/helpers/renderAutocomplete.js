// src/components/profileRegistration/helpers/renderAutocomplete.js

import React from 'react';
import { Label as L, Input as I } from '../../common/FormElements';

const renderAutocomplete = ({
  label,
  name,
  inputValue,
  inputSetter,
  show,
  setShow,
  options,
  setOptions,
  searchFn,
  handleChange,
  errors = {}
}) => {
  const isError = !!errors[name];
  const helperText = isError ? errors[name] : 'Start typing to search...';

  return (
    <div className="autocomplete-dropdown relative">
      <L>{label} <span className="text-red-500">*</span></L>
      <I
        name={name}
        value={inputValue}
        onChange={async (e) => {
          const val = e.target.value;
          inputSetter(val);
          if (val.length >= 2) {
            const results = await searchFn(val);
            setOptions(results || []);
            setShow(true);
          } else {
            setOptions([]);
            setShow(false);
          }
        }}
        error={isError}
        helperText={helperText}
        autoComplete="off"
        onBlur={() => setTimeout(() => setShow(false), 200)} // ← delay to allow click
      />
      {show && options.length > 0 && (
        <ul className="absolute z-10 bg-white border max-h-40 overflow-y-auto mt-1 w-full shadow-md text-sm">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault(); // ← prevent blur canceling click
                inputSetter(opt.label);
                setShow(false);
                handleChange({ target: { name, value: opt.label } });
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default renderAutocomplete;
