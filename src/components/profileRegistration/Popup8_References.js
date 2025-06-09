import React, { useState, useEffect } from 'react';
import { Label as L, Input as I, Button as B } from '../common/FormElements';
import { MenuItem, TextField } from '@mui/material';
import countryData from 'country-telephone-data';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';

const countryCodes = countryData.allCountries.map(c => ({
  code: `+${c.dialCode}`,
  label: `${c.name} (+${c.dialCode})`,
  iso2: c.iso2,
}));

const Popup8_References = ({
  formData,
  handleChange,
  onNext,
  onPrevious,
  handleIntermediateProfileUpdate,
  setIsProcessing
}) => {

const [errors, setErrors] = useState({});
const [showErrorDialog, setShowErrorDialog] = useState(false);


const validateAndProceed = async () => {
  const requiredFields = [
    { name: "reference1Name", label: "Reference 1 Name" },
    { name: "reference1PhoneNumber", label: "Reference 1 Phone Number" }
  ];

  const newErrors = validateRequiredFields(formData, requiredFields);
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    
    const success = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
    if (success) onNext();
  } else {
    setShowErrorDialog(true);
  }
};

  return (
    <div className="space-y-6">

<ValidationErrorDialog 
  errors={errors}
  isOpen={showErrorDialog}
  onClose={() => setShowErrorDialog(false)}
/>


      {/* Profile Header Info */}
      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 shadow-sm text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>

      {/* Reference 1 Name */}
      <div>
        <L>Reference 1 Name <span className="text-red-500">*</span></L>
        <I
          name="reference1Name"
          value={formData.reference1Name || ''}
          onChange={handleChange}
          placeholder="Enter name of reference person"
          required
        />
      </div>

      {/* Reference 1 Phone */}
{/* Reference 1 Phone */}
<div>
  <L>Reference 1 Phone <span className="text-red-500">*</span></L>
  <div className="flex space-x-2 w-full">
    <TextField
      select
      name="reference1PhoneCountryCode"
      value={formData.reference1PhoneCountryCode || '+91'}
      onChange={handleChange}
      sx={{
        minWidth: 140,
        maxWidth: 200,
        backgroundColor: '#fff',
        borderRadius: 1,
        '& .MuiInputBase-root': {
          height: '40px',
        },
        '& .MuiInputBase-input': {
          padding: '8px 14px',
        }
      }}
      required
    >
      {countryCodes.map(option => (
        <MenuItem key={option.iso2 + option.code} value={option.code}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    <I
      name="reference1PhoneNumber"
      type="tel"
      value={formData.reference1PhoneNumber || ''}
      onChange={handleChange}
      placeholder="Phone number"
      required
      className="flex-1"
    />
  </div>
</div>
      {/* Reference 2 Name */}
      <div>
        <L>Reference 2 Name</L>
        <I
          name="reference2Name"
          value={formData.reference2Name || ''}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

{/* Reference 2 Phone */}
<div>
  <L>Reference 2 Phone</L>
  <div className="flex space-x-2 w-full">
    <TextField
      select
      name="reference2PhoneCountryCode"
      value={formData.reference2PhoneCountryCode || '+91'}
      onChange={handleChange}
      sx={{
        minWidth: 140,
        maxWidth: 200,
        backgroundColor: '#fff',
        borderRadius: 1,
        '& .MuiInputBase-root': {
          height: '40px',
        },
        '& .MuiInputBase-input': {
          padding: '8px 14px',
        }
      }}
    >
      {countryCodes.map(option => (
        <MenuItem key={option.iso2 + option.code} value={option.code}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    <I
      name="reference2PhoneNumber"
      type="tel"
      value={formData.reference2PhoneNumber || ''}
      onChange={handleChange}
      placeholder="Phone number"
      className="flex-1"
    />
  </div>
</div>
      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <B variant="outline" onClick={onPrevious}>⬅️ Previous</B>
        <B onClick={validateAndProceed}>Save & Next ➡️</B>
      </div>
    </div>
  );
};

export default Popup8_References;
