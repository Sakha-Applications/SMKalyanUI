// components/ModifyProfile/PartnerPreferences/sections/AddressDetails.jsx
import React, { useState, useEffect } from "react";
import { Input, Select, TextArea } from "../../../common/FormElements";
import CountryStateCitySelector from "../../../common/CountryStateCitySelector"; // For Communication & Residence Address
import countryData from 'country-telephone-data'; // For phone number country codes
import { MenuItem, TextField } from '@mui/material'; // For Material-UI Select/TextField for country codes
import { Country, State } from 'country-state-city'; // For converting ISO codes to names in view mode


const DataRow = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value || '-'}
    </p>
  </div>
);

// Helper function to get country name from isoCode
const getCountryName = (isoCode) => {
  const countryObj = Country.getAllCountries().find(c => c.isoCode === isoCode);
  return countryObj ? countryObj.name : isoCode;
};

// Helper function to get state name from isoCode and country isoCode
const getStateName = (stateIsoCode, countryIsoCode) => {
  if (!countryIsoCode || !stateIsoCode) return stateIsoCode;
  const stateObj = State.getStatesOfCountry(countryIsoCode).find(s => s.isoCode === stateIsoCode);
  return stateObj ? stateObj.name : stateIsoCode;
};

const countryCodes = countryData.allCountries.map(c => ({
  code: `+${c.dialCode}`,
  label: `${c.name} (+${c.dialCode})`,
  iso2: c.iso2,
}));

const AddressDetails = ({ profileData, formData = {}, setFormData, mode = "view" }) => {
  const [copyChecked, setCopyChecked] = useState(false);

  // Effect to manage the "Copy Address" checkbox state when formData changes
  // This ensures the checkbox is unchecked if user manually changes residence fields after copying
// Initialize copyChecked state only once when component mounts or profileData changes
  // This prevents the infinite loop caused by `setCopyChecked` within the effect's dependencies.
  useEffect(() => {
    // Only set the initial state of copyChecked if in edit mode
    if (mode === "edit") {
        if (
            formData.communicationHouseNo === formData.residenceHouseNo &&
            formData.communicationStreet === formData.residenceStreet &&
            formData.communicationArea === formData.residenceArea &&
            formData.communicationPIN === formData.residencePIN &&
            formData.communicationCountry === formData.residenceCountry &&
            formData.communicationState === formData.residenceState &&
            formData.communicationCity === formData.residenceCity
        ) {
            // Only set to true if it's not already true to avoid unnecessary state updates
            if (!copyChecked) {
                setCopyChecked(true);
            }
        } else {
            // Only set to false if it's not already false
            if (copyChecked) {
                setCopyChecked(false);
            }
        }
    }
  }, [
      mode,
      formData.communicationHouseNo, formData.communicationStreet, formData.communicationArea, formData.communicationPIN,
      formData.communicationCountry, formData.communicationState, formData.communicationCity,
      formData.residenceHouseNo, formData.residenceStreet, formData.residenceArea, formData.residencePIN,
      formData.residenceCountry, formData.residenceState, formData.residenceCity
      // Removed copyChecked from dependencies to break the potential loop
  ]);


  const handleChange = (e) => {
    if (e.target && e.target.name) {
      const { name, value } = e.target;
      setFormData?.((prev) => ({ ...prev, [name]: value }));
    } else { // Handles cases where e is { name, value } (e.g., from MultiSelectCheckbox or custom components)
      const { name, value } = e;
      setFormData?.((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCopyAddress = (e) => {
    const checked = e.target.checked;
    setCopyChecked(checked);

    if (checked) {
      // ✅ Step 1: Update residence fields from communication fields
      setFormData((prev) => ({
        ...prev,
        residenceHouseNo: prev.communicationHouseNo || '',
        residenceStreet: prev.communicationStreet || '',
        residenceArea: prev.communicationArea || '',
        residencePIN: prev.communicationPIN || '',
        residenceCountry: prev.communicationCountry || '', // Copy the country name
        residenceState: prev.communicationState || '',     // Copy the state name
        residenceCity: prev.communicationCity || ''        // Copy the city name
      }));
    } else {
        // If unchecked, you might want to clear residence fields or leave them as is.
        // For now, let's just allow them to be edited independently.
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
        Contact & Address Details
      </h2>
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              {/* Email ID - Typically not editable here */}
              <DataRow label="Email ID" value={profileData?.email} />

               {/* Phone Number - THIS IS THE SECTION TO CHANGE */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex space-x-2 w-full">
                  {/* Phone Country Code (already made read-only in previous step) */}
                  <TextField
                    name="phoneCountryCode"
                    value={formData?.phoneCountryCode || '+91'}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true
                    }}
                    variant="standard"
                    sx={{
                      minWidth: 140,
                      maxWidth: 200,
                      backgroundColor: '#f0f0f0', // Uniform background color
                      borderRadius: 1,
                      '& .MuiInputBase-root': { height: '40px' },
                      '& .MuiInputBase-input': { padding: '8px 14px' }
                    }}
                  />
                  {/* ********** START OF IMPACTED CODE FOR PHONE NUMBER ********** */}
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={formData?.phoneNumber || ''}
                    // Remove onChange if you want it strictly non-editable (like email)
                    // If you want it non-editable, remove onChange:
                    // onChange={handleChange}
                    readOnly // Add readOnly prop
                    className="flex-1"
                    // Add styling for consistency
                    style={{
                      backgroundColor: '#f0f0f0', // Uniform background color
                      pointerEvents: 'none',     // Prevent interaction
                      cursor: 'default',         // Change cursor to default
                      color: '#6b7280'           // Optional: Dim text color slightly
                    }}
                  />
                  {/* ********** END OF IMPACTED CODE FOR PHONE NUMBER ********** */}
                </div>
              </div>

              {/* Alternate Phone */}
              <div>
                <label htmlFor="alternatePhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                <div className="flex space-x-2 w-full">
                  <TextField
                    select
                    name="alternatePhoneCountryCode"
                    value={formData?.alternatePhoneCountryCode || '+91'}
                    onChange={handleChange}
                    sx={{
                      minWidth: 140,
                      maxWidth: 200,
                      backgroundColor: '#fff',
                      borderRadius: 1,
                      '& .MuiInputBase-root': { height: '40px' },
                      '& .MuiInputBase-input': { padding: '8px 14px' }
                    }}
                  >
                    {countryCodes.map(option => (
                      <MenuItem key={option.iso2 + option.code} value={option.code}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Input
                    name="alternatePhoneNumber"
                    type="tel"
                    value={formData?.alternatePhoneNumber || ''}
                    onChange={handleChange}
                    placeholder="Alternate phone number"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Guardian Phone */}
              <div>
                <label htmlFor="guardianPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                <div className="flex space-x-2 w-full">
                  <TextField
                    select
                    name="guardianPhoneCountryCode"
                    value={formData?.guardianPhoneCountryCode || '+91'}
                    onChange={handleChange}
                    sx={{
                      minWidth: 140,
                      maxWidth: 200,
                      backgroundColor: '#fff',
                      borderRadius: 1,
                      '& .MuiInputBase-root': { height: '40px' },
                      '& .MuiInputBase-input': { padding: '8px 14px' }
                    }}
                  >
                    {countryCodes.map(option => (
                      <MenuItem key={option.iso2 + option.code} value={option.code}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Input
                    name="guardianPhoneNumber"
                    type="tel"
                    value={formData?.guardianPhoneNumber || ''}
                    onChange={handleChange}
                    placeholder="Guardian phone number"
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* View Mode - Contact Info Section */}
              <DataRow label="Email ID" value={profileData?.email} />
              <DataRow label="Phone Number" value={`${profileData?.phoneCountryCode || ''}${profileData?.phoneNumber || '-'}`} />
              {/* Corrected Alternate Phone Display */}
              <DataRow label="Alternate Phone" value={`${profileData?.alternatePhoneCountryCode || ''}${profileData?.alternatePhoneNumber || '-'}`} />
              {/* Guardian Phone Display (assuming this structure is consistent) */}
              <DataRow label="Guardian Phone" value={`${profileData?.guardianPhoneCountryCode || ''}${profileData?.guardianPhoneNumber || '-'}`} />
            </>
          )}
        </div>
      </div>

      {/* Communication Address Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Communication Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              <div>
                <label htmlFor="communicationHouseNo" className="block text-sm font-medium text-gray-700 mb-1">House No</label>
                <Input name="communicationHouseNo" value={formData.communicationHouseNo || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="communicationStreet" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <Input name="communicationStreet" value={formData.communicationStreet || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="communicationArea" className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <Input name="communicationArea" value={formData.communicationArea || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="communicationPIN" className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <Input name="communicationPIN" value={formData.communicationPIN || ''} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <CountryStateCitySelector
                  formData={formData}
                  handleChange={handleChange}
                  countryField="communicationCountry"
                  stateField="communicationState"
                  cityField="communicationCity"
                  labelPrefix="Communication"
                />
              </div>
            </>
          ) : (
            <>
              {/* View Mode - Communication Address */}
              <DataRow label="House No" value={profileData?.communicationHouseNo} />
              <DataRow label="Street" value={profileData?.communicationStreet} />
              <DataRow label="Area" value={profileData?.communicationArea} />
              <DataRow label="PIN Code" value={profileData?.communicationPIN} />
              <DataRow label="City" value={profileData?.communicationCity} />
              <DataRow label="State" value={getStateName(profileData?.communicationState, profileData?.communicationCountry)} />
              <DataRow label="Country" value={getCountryName(profileData?.communicationCountry)} />
              {/* Fallback to combined string if individual fields aren't populated */}
              {(!profileData?.communicationHouseNo && !profileData?.communicationStreet && !profileData?.communicationArea && !profileData?.communicationPIN && !profileData?.communicationCity && !profileData?.communicationState && !profileData?.communicationCountry) && (
                 <div className="md:col-span-2">
                    <DataRow label="Communication Address" value={profileData?.communicationAddress} />
                 </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Residence Address Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Residence Address</h3>
        {mode === "edit" && (
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="copyResidenceAddress"
              checked={copyChecked}
              onChange={handleCopyAddress}
              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            />
            <label htmlFor="copyResidenceAddress" className="text-sm text-gray-700">
              Copy from Communication Address if residence address is same
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              <div>
                <label htmlFor="residenceHouseNo" className="block text-sm font-medium text-gray-700 mb-1">House No</label>
                <Input name="residenceHouseNo" value={formData.residenceHouseNo || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="residenceStreet" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <Input name="residenceStreet" value={formData.residenceStreet || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="residenceArea" className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <Input name="residenceArea" value={formData.residenceArea || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="residencePIN" className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <Input name="residencePIN" value={formData.residencePIN || ''} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <CountryStateCitySelector
                  formData={formData}
                  handleChange={handleChange}
                  countryField="residenceCountry"
                  stateField="residenceState"
                  cityField="residenceCity"
                  labelPrefix="Residence"
                />
              </div>
            </>
          ) : (
            <>
              {/* View Mode - Residence Address */}
              <DataRow label="House No" value={profileData?.residenceHouseNo} />
              <DataRow label="Street" value={profileData?.residenceStreet} />
              <DataRow label="Area" value={profileData?.residenceArea} />
              <DataRow label="PIN Code" value={profileData?.residencePIN} />
              <DataRow label="City" value={profileData?.residenceCity} />
              <DataRow label="State" value={getStateName(profileData?.residenceState, profileData?.residenceCountry)} />
              <DataRow label="Country" value={getCountryName(profileData?.residenceCountry)} />
              {/* Fallback to combined string if individual fields aren't populated */}
              {(!profileData?.residenceHouseNo && !profileData?.residenceStreet && !profileData?.residenceArea && !profileData?.residencePIN && !profileData?.residenceCity && !profileData?.residenceState && !profileData?.residenceCountry) && (
                 <div className="md:col-span-2">
                    <DataRow label="Residence Address" value={profileData?.residenceAddress} />
                 </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddressDetails;