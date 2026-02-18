// src/components/profileRegistration/Popup7_ContactAddress.js

import React, { useState } from 'react';
import { Label as L, Input as I, Button as B } from '../common/FormElements';
import countryData from 'country-telephone-data';
import { TextField, MenuItem } from '@mui/material';
import CountryStateCitySelector from "../common/CountryStateCitySelector";
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';

const Popup7_ContactAddress = ({
  formData,
  handleChange,
  setFormData,
  onNext,
  onPrevious,
  handleIntermediateProfileUpdate,
  setIsProcessing
}) => {
//  const [copyChecked, setCopyChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const countryCodes = countryData.allCountries.map((c) => ({
    code: `+${c.dialCode}`,
    label: `${c.name} (+${c.dialCode})`,
    iso2: c.iso2
  }));

{/*  const combineAddress = (prefix) => {
    const parts = [
      formData[`${prefix}HouseNo`] || '',
      formData[`${prefix}Street`] || '',
      formData[`${prefix}Area`] || '',
      formData[`${prefix}City`] || '',
      formData[`${prefix}State`] || '',
      formData[`${prefix}Country`] || '',
      formData[`${prefix}PIN`] || ''
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleCopyAddress = (e) => {
    const checked = e.target.checked;
    setCopyChecked(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        residenceHouseNo: prev.communicationHouseNo || '',
        residenceStreet: prev.communicationStreet || '',
        residenceArea: prev.communicationArea || '',
        residencePIN: prev.communicationPIN || '',
        residenceCountry: prev.communicationCountry || '',
        residenceState: prev.communicationState || '',
        residenceCity: prev.communicationCity || ''
      }));
    }
  };
*/}
  const validateAndProceed = async () => {
  //  const comm = combineAddress('communication');
  //  const resi = combineAddress('residence');

    const updatedFormData = {
      ...formData,
    //  communicationAddress: comm,
    //  residenceAddress: resi
    };

    // ✅ Combined required fields (address + references)
    const requiredFields = {
      reference1Name: "Reference 1 Name",
      reference1PhoneNumber: "Reference 1 Phone Number",
    };

   // const newErrors = validateRequiredFields(updatedFormData, requiredFields);
    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData(updatedFormData);
      const success = await handleIntermediateProfileUpdate({ formData: updatedFormData, setIsProcessing });
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
          Let's add your additional Contacts & References to reach out
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

          {/* Profile Info Header 
          <div className="bg-slate-100 border border-slate-300 rounded-md p-3 shadow-sm text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
            <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
            <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
          </div>
          */}

          {/* Other Contact Details */}
          <h3 className="font-semibold text-gray-800 pt-4 pb-1">Other Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alternate Phone */}
            <div className="md:col-span-2">
              <L>Alternate Phone</L>
              <L>Please enter your alternate phone number</L>
              <div className="flex space-x-2 w-full">
                <TextField
                  select
                  name="alternatePhoneCountryCode"
                  value={formData.alternatePhoneCountryCode || '+91'}
                  onChange={handleChange}
                  sx={{ width: 160, backgroundColor: "#fff" }}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.iso2 + option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <I
                  name="alternatePhoneNumber"
                  value={formData.alternatePhoneNumber || ''}
                  onChange={handleChange}
                  className="flex-1"
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Guardian Phone */}
            <div className="md:col-span-2">
              <L>Guardian Phone</L>
              <L>Please enter your guardian's phone number</L>
              <div className="flex space-x-2 w-full">
                <TextField
                  select
                  name="guardianPhoneCountryCode"
                  value={formData.guardianPhoneCountryCode || '+91'}
                  onChange={handleChange}
                  sx={{ width: 160, backgroundColor: "#fff" }}
                >
                  {countryCodes.map((option) => (
                    <MenuItem key={option.iso2 + option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <I
                  name="guardianPhoneNumber"
                  value={formData.guardianPhoneNumber || ''}
                  onChange={handleChange}
                  className="flex-1"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Communication Address 
          <h3 className="font-semibold text-gray-800 pt-2 pb-1">Communication Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><L>House No</L><I name="communicationHouseNo" value={formData.communicationHouseNo || ''} onChange={handleChange} /></div>
            <div><L>Street</L><I name="communicationStreet" value={formData.communicationStreet || ''} onChange={handleChange} /></div>
            <div><L>Area</L><I name="communicationArea" value={formData.communicationArea || ''} onChange={handleChange} /></div>

            <div className="md:col-span-3">
              <CountryStateCitySelector
                formData={formData}
                handleChange={handleChange}
                countryField="communicationCountry"
                stateField="communicationState"
                cityField="communicationCity"
                labelPrefix="Communication"
              />
            </div>

            <div><L>PIN Code</L><I name="communicationPIN" value={formData.communicationPIN || ''} onChange={handleChange} /></div>
          </div>
*/}
          {/* Residence Address 
          <h3 className="font-semibold text-gray-800 pt-2 pb-1">Residence Address</h3>
          <div className="flex items-center space-x-2 mt-2">
            <input type="checkbox" checked={copyChecked} onChange={handleCopyAddress} id="copyAddress" />
            <label htmlFor="copyAddress" className="text-sm text-gray-700">
              Copy from Communication Address if the residence address is same
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><L>House No</L><I name="residenceHouseNo" value={formData.residenceHouseNo || ''} onChange={handleChange} /></div>
            <div><L>Street</L><I name="residenceStreet" value={formData.residenceStreet || ''} onChange={handleChange} /></div>
            <div><L>Area</L><I name="residenceArea" value={formData.residenceArea || ''} onChange={handleChange} /></div>

            <div className="md:col-span-3">
              <CountryStateCitySelector
                formData={formData}
                handleChange={handleChange}
                countryField="residenceCountry"
                stateField="residenceState"
                cityField="residenceCity"
                labelPrefix="Residence"
              />
            </div>

            <div><L>PIN Code</L><I name="residencePIN" value={formData.residencePIN || ''} onChange={handleChange} /></div>
          </div>
*/}
          {/* References (merged from Popup8) */}
          <h3 className="font-semibold text-gray-800 pt-4 pb-1">References</h3>
          <L>Please provide person name who knows you better in care interested people can contact get more details about you and your family </L>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="md:col-span-2">
              <L>Reference 2 Name</L>
              <I
                name="reference2Name"
                value={formData.reference2Name || ''}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

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

export default Popup7_ContactAddress;
