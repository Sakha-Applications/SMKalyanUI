import React, { useState } from 'react';
import { Label, Input, Button } from '../common/FormElements';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import countryData from "country-telephone-data";
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import useApiData from '../../hooks/useApiData';
import handleIntermediateProfileUpdate from './handlers/handleIntermediateProfileUpdate';
import handleUserAndProfileCreation from './handlers/handleUserAndProfileCreation';

const Popup2_ContactAndLocation = ({
  formData,
  handleChange,
  handleDOBChange,
  onNext,
  onPrevious,
  isProcessing,
  setIsProcessing,
  setFormData,
  setProfileAlreadyCreated,
  setUserAlreadyCreated,
  setUserCreationData,
  setShowUserCreatedDialog,
  setProfileCreationData,
  navigate
}) => {
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const countryCodes = countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2
  }));

  const { checkProfileExists } = useApiData();

  const validateAndProceed = async () => {
  const requiredFields = [
    { name: "phoneNumber", label: "Phone Number" },
    { name: "email", label: "Email" },
    { name: "dob", label: "Date of Birth" }
  ];

  const newErrors = validateRequiredFields(formData, requiredFields);

  if (formData.email && !formData.email.includes('@')) {
    newErrors.email = "Valid email is required.";
  }

  if (formData.phoneNumber && !formData.phoneNumber.match(/^\d{10}$/)) {
    newErrors.phoneNumber = "Valid 10-digit phone number is required.";
  }

  if (formData.dob) {
    const dob = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    const isBeforeBirthday = m < 0 || (m === 0 && today.getDate() < dob.getDate());
    const actualAge = isBeforeBirthday ? age - 1 : age;

    if (actualAge < 18) {
      newErrors.dob = "Minimum age must be 18 years.";
    }
  }

  if (!formData.profileId || formData.profileId.trim() === '') {
    newErrors.general = "Profile ID could not be generated. Please check your name and phone number.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    // ✅ Just allow parent (ProfileRegistration) to proceed with creation
    setIsProcessing(false);
    onNext();
  } else {
    setShowErrorDialog(true);
  }
};



 const getEmailHelperText = () => {
  if (errors.email) return errors.email;
  if (!formData.email) return "e.g., user@example.com";
  return formData.email.includes('@') ? '' : "Enter a valid email address.";
};
  const getPhoneHelperText = () => {
    if (errors.phoneNumber) return errors.phoneNumber;
    if (!formData.phoneNumber) return "e.g., 9876543210";
    return formData.phoneNumber.match(/^\d{10}$/) ? '' : "Enter a 10-digit number.";
  };

  return (
    <div className="space-y-6">
      <ValidationErrorDialog 
        errors={errors}
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
      />
      
      {/* Show ProfileId for debugging - remove in production */}
      {formData.profileId && (
        <div className="bg-green-50 p-2 rounded text-sm">
          <strong>Profile ID:</strong> {formData.profileId}
        </div>
      )}

      {/* Email - Row 1 */}
      <div>
        <Label>Email ID <span className="text-red-500">*</span></Label>
        <Input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
          error={!!errors.email}
          placeholder="yourname@example.com"
          helperText={getEmailHelperText()}
        />
      </div>

      {/* Phone Number - Row 2 */}
      <div>
        <Label>Phone Number <span className="text-red-500">*</span></Label>
        <div className="flex space-x-2">
          <TextField
            select
            name="phoneCountryCode"
            value={formData.phoneCountryCode ?? "+91"}
            onChange={handleChange}
            sx={{
              minWidth: 140,
              maxWidth: 200,
              backgroundColor: "#fff",
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
            {countryCodes.map((option) => (
              <MenuItem key={option.iso2 + option.code} value={option.code}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            required
            placeholder="1234567890"
            error={!!errors.phoneNumber}
            helperText={getPhoneHelperText()}
            className="flex-1"
          />
        </div>
      </div>

      {/* DOB - Row 3 */}
      <div>
        <Label>Date of Birth <span className="text-red-500">*</span></Label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month", "day"]}
            value={formData.dob ? dayjs(formData.dob) : null}
            onChange={(newValue) => {
              const formattedDOB = newValue ? newValue.format("YYYY-MM-DD") : null;
              handleDOBChange(formattedDOB);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: !!errors.dob,
                helperText: errors.dob || (!formData.dob ? "Date of Birth is required" : ""),
                sx: { 
                  backgroundColor: "#fff", 
                  borderRadius: 1,
                  '& .MuiInputBase-root': {
                    height: '40px',
                  }
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline">Previous</Button>
        <Button onClick={validateAndProceed} disabled={isProcessing} variant="primary">
          {isProcessing ? "Processing Profile Registration..." : "Sing Up"}
        </Button>
      </div>
    </div>
  );
};

export default Popup2_ContactAndLocation;