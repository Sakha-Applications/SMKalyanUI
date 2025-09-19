import React, { useState } from 'react';
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
    // ✅ FIX: object style requiredFields
    const requiredFields = {
      reference1Name: "Reference 1 Name",
      reference1PhoneNumber: "Reference 1 Phone Number"
    };

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
    <div className="h-full flex flex-col">
      {/* Sticky Header (Popup6 style) */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          Let's cover your References
        </h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">

          <ValidationErrorDialog 
            errors={errors}
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
          />

          {/* Profile Info Header */}
          <div className="bg-slate-100 border border-slate-300 rounded-md p-3 shadow-sm text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
            <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
            <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reference 1 Name */}
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
              <L>Reference 1 Phone <span className="text-red-500">*</span></L>
              <div className="flex space-x-2 w-full">
                <TextField
                  select
                  name="reference1PhoneCountryCode"
                  value={formData.reference1PhoneCountryCode || '+91'}
                  onChange={handleChange}
                  sx={{ minWidth: 140, maxWidth: 200, backgroundColor: '#fff' }}
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
            <div className="md:col-span-2">
              <L>Reference 2 Name</L>
              <I
                name="reference2Name"
                value={formData.reference2Name || ''}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            {/* Reference 2 Phone */}
            <div className="md:col-span-2">
              <L>Reference 2 Phone</L>
              <div className="flex space-x-2 w-full">
                <TextField
                  select
                  name="reference2PhoneCountryCode"
                  value={formData.reference2PhoneCountryCode || '+91'}
                  onChange={handleChange}
                  sx={{ minWidth: 140, maxWidth: 200, backgroundColor: '#fff' }}
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
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>⬅️ Previous</B>
            <B onClick={validateAndProceed}>Save & Next ➡️</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup8_References;
