// components/ModifyProfile/PartnerPreferences/sections/ReferencesSection.jsx
import React from "react";
import { Input } from "../../../common/FormElements"; // Assuming Input is from FormElements
import { TextField, MenuItem } from '@mui/material'; // For Material-UI TextField with select
import countryData from 'country-telephone-data'; // For phone number country codes

// DataRow as per our consistent styling (no individual border)
const DataRow = ({ label, value }) => (
  <div className="p-4">
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value || '-'}
    </p>
  </div>
);

// Define countryCodes here, similar to AddressDetails.jsx
const countryCodes = countryData.allCountries.map(c => ({
  code: `+${c.dialCode}`,
  label: `${c.name} (+${c.dialCode})`,
  iso2: c.iso2,
}));

const ReferencesSection = ({ profileData, formData = {}, setFormData, mode = "view" }) => {

  const handleChange = (e) => {
    // This handleChange function is general and should handle updates for country codes and phone numbers
    const { name, value } = e.target;
    setFormData?.((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
        References
      </h2>

      {/* This is the single enclosing div for the entire section's content */}
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              {/* Reference 1 Details - Edit Mode */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reference 1 Name */}
                <div>
                  <label htmlFor="reference1Name" className="block text-sm font-medium text-gray-700 mb-1">Reference 1 Name</label>
                  <Input
                    name="reference1Name"
                    value={formData?.reference1Name || ''}
                    onChange={handleChange}
                    placeholder="Enter reference 1 name"
                    className="w-full"
                  />
                </div>

                {/* Reference 1 Phone - Split into Country Code and Number */}
                <div>
                  <label htmlFor="reference1PhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Reference 1 Phone</label>
                  <div className="flex space-x-2 w-full">
                    <TextField
                      select
                      name="reference1PhoneCountryCode"
                      value={formData?.reference1PhoneCountryCode || '+91'} // Default to +91
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
                      name="reference1PhoneNumber"
                      type="tel"
                      value={formData?.reference1PhoneNumber || ''}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div> {/* End Reference 1 grid */}

              {/* Reference 2 Details - Edit Mode */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reference 2 Name */}
                <div>
                  <label htmlFor="reference2Name" className="block text-sm font-medium text-gray-700 mb-1">Reference 2 Name</label>
                  <Input
                    name="reference2Name"
                    value={formData?.reference2Name || ''}
                    onChange={handleChange}
                    placeholder="Enter reference 2 name"
                    className="w-full"
                  />
                </div>

                {/* Reference 2 Phone - Split into Country Code and Number */}
                <div>
                  <label htmlFor="reference2PhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Reference 2 Phone</label>
                  <div className="flex space-x-2 w-full">
                    <TextField
                      select
                      name="reference2PhoneCountryCode"
                      value={formData?.reference2PhoneCountryCode || '+91'} // Default to +91
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
                      name="reference2PhoneNumber"
                      type="tel"
                      value={formData?.reference2PhoneNumber || ''}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div> {/* End Reference 2 grid */}
            </>
          ) : (
            <>
              {/* View Mode - Display existing data */}
              <DataRow label="Reference 1 Name" value={profileData?.reference1Name} />
              {/* Display Reference 1 Phone as a combined string */}
              <DataRow label="Reference 1 Phone" value={`${profileData?.reference1PhoneCountryCode || ''} ${profileData?.reference1PhoneNumber || profileData?.reference1Phone || '-'}`} />
              <DataRow label="Reference 2 Name" value={profileData?.reference2Name} />
              {/* Display Reference 2 Phone as a combined string */}
              <DataRow label="Reference 2 Phone" value={`${profileData?.reference2PhoneCountryCode || ''} ${profileData?.reference2PhoneNumber || profileData?.reference2Phone || '-'}`} />
            </>
          )}
        </div>
      </div> {/* This closes the new enclosing div */}
    </section>
  );
};

export default ReferencesSection;