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

const Popup2_ContactAndLocation = ({
  formData,
  handleChange,
  handleDOBChange,
  onNext,
  onPrevious,
  isProcessing
}) => {
  const [errors, setErrors] = useState({});

  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const countryCodes = countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2
  }));

  const validateAndProceed = () => {
  const requiredFields = [
    { name: "phoneNumber", label: "Phone Number" },
    { name: "email", label: "Email" },
    { name: "dob", label: "Date of Birth" }
  ];

  // Step 1: Validate required fields
  const newErrors = validateRequiredFields(formData, requiredFields);

  // Step 2: Custom validation logic
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

  // Step 3: Set errors and proceed
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    console.log("✅ All validations passed. Triggering signup...");
    onNext();
  } else {
    // Show error dialog when there are validation errors
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
            onChange={(e) => {
              const phoneCountryCode = e.target.value;
              const phoneNumber = formData.phoneNumber || '';
              handleChange({ target: { name: 'phoneCountryCode', value: phoneCountryCode } });
              handleChange({ target: { name: 'phone', value: phoneCountryCode + phoneNumber } });
            }}
            sx={{ width: 110, backgroundColor: "#fff", borderRadius: 1 }}
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
            onChange={(e) => {
              const phoneNumber = e.target.value;
              const phoneCountryCode = formData.phoneCountryCode || '+91';
              handleChange({ target: { name: 'phoneNumber', value: phoneNumber } });
              handleChange({ target: { name: 'phone', value: phoneCountryCode + phoneNumber } });
            }}
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
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
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
                error: !formData.dob,
                helperText: !formData.dob ? "Date of Birth is required" : "",
                sx: { backgroundColor: "#fff", borderRadius: 1 },
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline">Previous</Button>
        <Button onClick={validateAndProceed} disabled={isProcessing} variant="primary">
          {isProcessing ? "Processing..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
};

export default Popup2_ContactAndLocation;
