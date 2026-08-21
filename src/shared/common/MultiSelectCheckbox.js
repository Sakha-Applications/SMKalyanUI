// src/components/common/MultiSelectCheckbox.js
import React from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';

const MultiSelectCheckbox = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
  onSearch,
  searchInput = '',
  placeholder,
  loading = false
}) => {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options || []}
      getOptionLabel={(option) => option.label || option}
      value={Array.isArray(selectedValues) ? selectedValues : []}
      inputValue={searchInput} // ← controlled input
      onInputChange={(e, value, reason) => {
        if (reason === 'input' && onSearch) {
          onSearch(value); // trigger search input update
        }
      }}
      onChange={(e, value) => onChange(name, value)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder || `Select ${label}`}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox checked={selected} style={{ marginRight: 8 }} />
          {option.label || option}
        </li>
      )}
    />
  );
};

export default MultiSelectCheckbox;
