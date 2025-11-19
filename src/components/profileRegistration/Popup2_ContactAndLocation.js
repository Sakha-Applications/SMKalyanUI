// src/components/profileRegistration/Popup2_ContactAndLocation.js
import React, { useState } from 'react';
import { Label, Input, Button } from '../common/FormElements';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import countryData from 'country-telephone-data';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import useApiData from '../../hooks/useApiData';
import handleIntermediateProfileUpdate from './handlers/handleIntermediateProfileUpdate';
import handleUserAndProfileCreation from './handlers/handleUserAndProfileCreation';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';

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
  const [availability, setAvailability] = useState({ email: null, phone: null });
  const [isCheckingAvailability, setIsCheckingAvailability] = useState({ email: false, phone: false });

  const countryCodes = countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2
  }));

  const { checkProfileExists } = useApiData();

  // Availability helper (uses your BE GET /api/account/availability)
  const fetchAvailability = async ({ email, phoneCountryCode, phoneNumber }) => {
    try {
      const baseUrl = getBaseUrl();
      const params = {};
      
      if (email && email.trim()) {
        params.email = String(email).trim();
      }
      
      if (phoneCountryCode && phoneNumber && phoneNumber.trim()) {
        params.phoneCountryCode = phoneCountryCode;
        params.phoneNumber = String(phoneNumber).trim();
      }

      console.log('Checking availability with params:', params); // Debug log
      
      const res = await axios.get(`${baseUrl}/api/account/availability`, { params });
      console.log('Availability response:', res.data); // Debug log
      
      // Ensure the response structure is what we expect
      const response = res.data || {};
      const emailData = response.email || {};
      const phoneData = response.phone || {};
      
      console.log('Parsed response - Email exists:', emailData.exists, 'Phone exists:', phoneData.exists);
      
      return {
        email: { exists: Boolean(emailData.exists) },
        phone: { exists: Boolean(phoneData.exists) }
      };
    } catch (err) {
      console.warn('availability precheck failed', err?.response?.status, err?.message);
      console.warn('Error details:', err?.response?.data); // Additional debug info
      return null; // soft-fail; don't block UX
    }
  };

  // Temporary debug helper - you can remove this later
  const testPhoneAvailability = async () => {
    const cc = formData.phoneCountryCode ?? '+91';
    const num = formData.phoneNumber?.trim();
    
    console.log('=== PHONE TEST ===');
    console.log('Country Code:', cc);
    console.log('Phone Number:', num);
    
    if (num) {
      const result = await fetchAvailability({ 
        phoneCountryCode: cc, 
        phoneNumber: num 
      });
      
      console.log('API Response:', result);
      console.log('Phone exists:', result?.phone?.exists);
      console.log('Phone exists type:', typeof result?.phone?.exists);
      console.log('=== END TEST ===');
    }
  };

  // Clear errors when user starts typing
  const handleEmailChange = (e) => {
    handleChange(e);
    // Clear email-related errors when user starts typing
    if (errors.email || availability.email === 'taken') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
      setAvailability(prev => ({ ...prev, email: null }));
    }
  };

  const handlePhoneChange = (e) => {
    handleChange(e);
    // Clear phone-related errors when user starts typing
    if (errors.phoneNumber || availability.phone === 'taken') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
      setAvailability(prev => ({ ...prev, phone: null }));
    }
  };

  const handleCountryCodeChange = (e) => {
    const newCountryCode = e.target.value;
    handleChange(e);
    
    // Clear phone errors when country code changes
    if (errors.phoneNumber || availability.phone === 'taken') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
      setAvailability(prev => ({ ...prev, phone: null }));
    }
    
    // If phone number exists and is valid, recheck availability with new country code
    const phoneNum = formData.phoneNumber?.trim();
    if (phoneNum && /^\d{10}$/.test(phoneNum)) {
      // Small delay to let the form data update, then check availability
      setTimeout(async () => {
        console.log('Rechecking phone availability after country code change');
        
        setIsCheckingAvailability(prev => ({ ...prev, phone: true }));
        
        try {
          const data = await fetchAvailability({ 
            phoneCountryCode: newCountryCode, // Use the new country code
            phoneNumber: phoneNum 
          });
          
          console.log('Phone availability result after country change:', data);
          
          const taken = data?.phone?.exists === true;
          
          setAvailability(prev => ({ ...prev, phone: taken ? 'taken' : 'free' }));
          
          if (taken) {
            setErrors(prev => ({ ...prev, phoneNumber: 'This phone number is already registered. Please login with this number instead.' }));
          }
        } catch (error) {
          console.error('Error checking phone availability after country change:', error);
        } finally {
          setIsCheckingAvailability(prev => ({ ...prev, phone: false }));
        }
      }, 100);
    }
  };

  // onBlur checks to show inline errors early
  const handleEmailBlur = async () => {
    const emailValue = formData?.email?.trim();
    if (!emailValue || !emailValue.includes('@')) return;

    setIsCheckingAvailability(prev => ({ ...prev, email: true }));
    
    try {
      const data = await fetchAvailability({ email: emailValue });
      const taken = data?.email?.exists === true;
      
      setAvailability(prev => ({ ...prev, email: taken ? 'taken' : 'free' }));
      
      if (taken) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered. Please login with this email instead.' }));
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    } finally {
      setIsCheckingAvailability(prev => ({ ...prev, email: false }));
    }
  };

  const handlePhoneBlur = async () => {
    const cc = formData.phoneCountryCode ?? '+91';
    const num = formData.phoneNumber?.trim();
    
    console.log('Phone blur check:', { cc, num }); // Debug log
    
    if (!num || !/^\d{10}$/.test(num)) {
      console.log('Phone validation skipped - invalid format');
      return;
    }

    setIsCheckingAvailability(prev => ({ ...prev, phone: true }));
    
    try {
      const data = await fetchAvailability({ 
        phoneCountryCode: cc, 
        phoneNumber: num 
      });
      
      console.log('Phone availability result:', data); // Debug log
      
      const taken = data?.phone?.exists === true;
      
      console.log('Phone taken status:', taken); // Debug log
      
      setAvailability(prev => ({ ...prev, phone: taken ? 'taken' : 'free' }));
      
      if (taken) {
        console.log('Phone is taken, setting error'); // Debug log
        setErrors(prev => ({ ...prev, phoneNumber: 'This phone number is already registered. Please login with this number instead.' }));
      } else {
        console.log('Phone is available'); // Debug log
        // Clear any existing phone errors since phone is available
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phoneNumber;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error checking phone availability:', error);
    } finally {
      setIsCheckingAvailability(prev => ({ ...prev, phone: false }));
    }
  };

  // main validation + preflight gate
  const validateAndProceed = async () => {
    setIsProcessing(true); // Set processing state immediately
    
    const requiredFields = {
      email: 'Email ID',
      phoneNumber: 'Phone Number',
      dob: 'Date of Birth'
    };

    const newErrors = validateRequiredFields(formData, requiredFields);

    // Email validation
    if (formData.email) {
      const emailTrimmed = formData.email.trim();
      if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
        newErrors.email = 'Valid email is required.';
      }
    }

    // Phone validation
    if (formData.phoneNumber) {
      const phoneTrimmed = formData.phoneNumber.trim();
      if (!/^\d{10}$/.test(phoneTrimmed)) {
        newErrors.phoneNumber = 'Valid 10-digit phone number is required.';
      }
    }

    // Age validation
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const isBeforeBirthday = m < 0 || (m === 0 && today.getDate() < dob.getDate());
      const actualAge = isBeforeBirthday ? age - 1 : age;
      if (actualAge < 18) newErrors.dob = 'Minimum age must be 18 years.';
    }

    // Profile ID validation
    if (!formData.profileId || formData.profileId.trim() === '') {
      newErrors.general = 'Profile ID could not be generated. Please check your name and phone number.';
    }

    // If there are basic validation errors, show them immediately
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorDialog(true);
      setIsProcessing(false);
      return;
    }

    // Final preflight check with the backend to block duplicates before DB insert
    try {
      console.log('Performing final preflight check...');
      const preflight = await fetchAvailability({
        email: formData.email?.trim(),
        phoneCountryCode: formData.phoneCountryCode ?? '+91',
        phoneNumber: formData.phoneNumber?.trim()
      });

      console.log('Preflight results:', preflight);

      if (preflight?.email?.exists) {
        newErrors.email = 'This email is already registered. Please login with this email and use "Forgot Password" if needed.';
      }
      if (preflight?.phone?.exists) {
        newErrors.phoneNumber = 'This phone number is already registered. Please login with this number.';
      }

      // Check if either email or phone is already taken - block signup
      if (Object.keys(newErrors).length > 0) {
        // Add a general message to guide user to login
        newErrors.general = 'Account already exists. Please use the login option instead of creating a new account.';
        setErrors(newErrors);
        setShowErrorDialog(true);
        setIsProcessing(false);
        return;
      }

      // All validations passed, proceed
      console.log('All validations passed, proceeding...');
      setIsProcessing(false);
      onNext();
      
    } catch (error) {
      console.error('Error during final validation:', error);
      setErrors({ general: 'Error validating data. Please try again.' });
      setShowErrorDialog(true);
      setIsProcessing(false);
    }
  };

  const getEmailHelperText = () => {
    if (isCheckingAvailability.email) return 'Checking availability...';
    if (errors.email) return errors.email;
    if (!formData.email) return 'e.g., user@example.com';
    if (availability.email === 'taken') return 'This email is already registered. Please login instead.';
    if (availability.email === 'free') return 'Email is available.';
    return formData.email.includes('@') ? '' : 'Enter a valid email address.';
  };

  const getPhoneHelperText = () => {
    if (isCheckingAvailability.phone) return 'Checking availability...';
    if (errors.phoneNumber) return errors.phoneNumber;
    if (!formData.phoneNumber) return 'e.g., 9876543210';
    if (availability.phone === 'taken') return 'This phone number is already registered. Please login instead.';
    if (availability.phone === 'free') return 'Phone number is available.';
    return /^\d{10}$/.test(formData.phoneNumber) ? '' : 'Enter a 10-digit number.';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          We need your active email and phone to set up your profile.
        </h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Account Exists Warning */}
          {(availability.email === 'taken' || availability.phone === 'taken') && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Account Already Exists!</strong>
                    <br />
                    {availability.email === 'taken' && availability.phone === 'taken' 
                      ? 'Both your email and phone number are already registered.'
                      : availability.email === 'taken' 
                      ? 'Your email is already registered.'
                      : 'Your phone number is already registered.'
                    }
                    <br />
                    Please use the login option instead. If you forgot your password, use the "Forgot Password" feature.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
              error={!!errors.email || availability.email === 'taken'}
              success={availability.email === 'free'}
              placeholder="yourname@example.com"
              helperText={getEmailHelperText()}
              disabled={isCheckingAvailability.email}
            />
          </div>

          {/* Phone Number - Row 2 */}
          <div>
            <Label>Phone Number <span className="text-red-500">*</span></Label>
            <div className="flex space-x-2">
              <TextField
                select
                name="phoneCountryCode"
                value={formData.phoneCountryCode ?? '+91'}
                onChange={handleCountryCodeChange}
                sx={{
                  minWidth: 140,
                  maxWidth: 200,
                  backgroundColor: '#fff',
                  borderRadius: 1,
                  '& .MuiInputBase-root': { height: '40px' },
                  '& .MuiInputBase-input': { padding: '8px 14px' }
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
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                required
                placeholder="1234567890"
                error={!!errors.phoneNumber || availability.phone === 'taken'}
                success={availability.phone === 'free'}
                helperText={getPhoneHelperText()}
                className="flex-1"
                disabled={isCheckingAvailability.phone}
              />
            </div>
          </div>

          {/* DOB - Row 3 */}
          <div>
            <Label>Date of Birth <span className="text-red-500">*</span></Label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year', 'month', 'day']}
                value={formData.dob ? dayjs(formData.dob) : null}
                onChange={(newValue) => {
                  const formattedDOB = newValue ? newValue.format('YYYY-MM-DD') : null;
                  handleDOBChange(formattedDOB);

                    // ---- Immediate DOB validation ----
  if (formattedDOB) {
    const dob = new Date(formattedDOB);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      setErrors(prev => ({ ...prev, dob: 'Minimum age must be 18 years.' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dob;
        return newErrors;
      });
    }
  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.dob,
                    helperText: errors.dob || (!formData.dob ? 'Date of Birth is required' : ''),
                    sx: {
                      backgroundColor: '#fff',
                      borderRadius: 1,
                      '& .MuiInputBase-root': { height: '40px' }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div className="flex space-x-2">
              <Button onClick={onPrevious} variant="outline" disabled={isProcessing}>
                Previous
              </Button>
            </div>
            
            {/* Show Login button if email or phone is already registered */}
            {(availability.email === 'taken' || availability.phone === 'taken') ? (
              <div className="flex space-x-3">
                <Button 
                  onClick={() => {
                    // Navigate to login page - adjust this path according to your routing
                    navigate('/login');
                  }} 
                  variant="secondary"
                >
                  Go to Login
                </Button>
                <Button 
                  onClick={validateAndProceed} 
                  disabled={true} 
                  variant="disabled"
                  title="Cannot signup - account already exists"
                >
                  Sign Up (Blocked)
                </Button>
              </div>
            ) : (
              <Button 
                onClick={validateAndProceed} 
                disabled={isProcessing || isCheckingAvailability.email || isCheckingAvailability.phone} 
                variant="primary"
              >
                {isProcessing ? 'Processing Profile Registration...' : 'Sign Up'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup2_ContactAndLocation;