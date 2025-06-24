// src/components/common/StyledFormField.jsx
import React from 'react';
import { TextField, FormControl, Select, MenuItem, Typography, Box } from '@mui/material';

const StyledFormField = ({
  label,
  type = "text",
  selectOptions,
  error,
  helperText,
  onFocus, // Explicitly destructure onFocus
  onBlur,  // Explicitly destructure onBlur
  ...props // Rest of the props
}) => {
  const commonSx = {
    backgroundColor: "#fff",
    borderRadius: 1,
    '& .MuiInputBase-root': { height: '40px' },
    '& .MuiInputBase-input': { padding: '8px 14px' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' }, // border-gray-300
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#a78bfa' }, // hover:border-indigo-400
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6366f1', // focus:border-indigo-500
      boxShadow: '0 0 0 1px #6366f1', // focus:ring-indigo-500
    },
  };

  const isError = !!error;

  return (
    <Box sx={{ mb: 2 }}> {/* Added margin-bottom for spacing between fields */}
      {label && <Typography sx={{ fontWeight: "bold", color: "#444", mb: 0.5, fontSize: '0.875rem' }}>{label}:</Typography>}
      {selectOptions ? (
        <FormControl fullWidth error={isError}>
          <Select
            variant="outlined"
            onFocus={onFocus} // Pass onFocus explicitly to Select
            onBlur={onBlur}   // Pass onBlur explicitly to Select
            {...props}
            sx={commonSx}
          >
            {selectOptions.length > 0 ? (
              selectOptions.map((option, index) => (
                <MenuItem key={option.value || option.label || index} value={option.value || option.label}>{option.label}</MenuItem>
              ))
            ) : (
              <MenuItem disabled>No options available</MenuItem>
            )}
          </Select>
          {isError && <Typography variant="caption" color="error">{helperText || error}</Typography>}
        </FormControl>
      ) : (
        <TextField
          type={type}
          fullWidth
          variant="outlined"
          onFocus={onFocus} // Pass onFocus explicitly to TextField
          onBlur={onBlur}   // Pass onBlur explicitly to TextField
          {...props}
          sx={commonSx}
          error={isError}
          helperText={helperText || error}
        />
      )}
    </Box>
  );
};

export default StyledFormField;