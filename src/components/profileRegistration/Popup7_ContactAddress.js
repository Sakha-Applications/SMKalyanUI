import React, { useState, useEffect } from 'react';
import { Label as L, Input as I, Button as B, Select as S } from '../common/FormElements';
import countryData from 'country-telephone-data';
import useApiData from '../../hooks/useApiData';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import StateCitySelector from '../common/StateCitySelector';
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
  const [copyChecked, setCopyChecked] = useState(false);

  const { searchPlaces } = useApiData();
  const countryCodes = countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2
  }));

  const [commCityInput, setCommCityInput] = useState(formData.communicationCity || '');
  const [commCityOptions, setCommCityOptions] = useState([]);
  const [showCommCity, setShowCommCity] = useState(false);

  const [resCityInput, setResCityInput] = useState(formData.residenceCity || '');
  const [resCityOptions, setResCityOptions] = useState([]);
  const [showResCity, setShowResCity] = useState(false);

  const [errors, setErrors] = useState({});
const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleAutocompleteSelect = (field, value, inputSetter, showSetter) => {
    inputSetter(value.label);
    showSetter(false);
    handleChange({ target: { name: field, value: value.label } });
  };

  const renderAutocomplete = (label, inputVal, inputSetter, options, show, setShow, fieldName) => (
    <div className="autocomplete-dropdown relative">
      <L>{label}</L>
      <I
        value={inputVal}
        onChange={async (e) => {
          const val = e.target.value;
          inputSetter(val);
          if (val.length >= 2) {
            const results = await searchPlaces(val);
            setShow(true);
            if (fieldName === 'communicationCity') setCommCityOptions(results);
            else setResCityOptions(results);
          } else {
            setShow(false);
            if (fieldName === 'communicationCity') setCommCityOptions([]);
            else setResCityOptions([]);
          }
        }}
        placeholder={`Start typing ${label.toLowerCase()}.`}
      />
      {show && options.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full max-h-48 overflow-y-auto z-10 mt-1 shadow-md">
          {options.map((opt) => (
            <li
              key={opt.label}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAutocompleteSelect(fieldName, opt, inputSetter, setShow)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

const combineAddress = (prefix) => {
  const parts = [
    formData[`${prefix}HouseNo`] || '',
    formData[`${prefix}Street`] || '',
    formData[`${prefix}Area`] || '',

    formData[`${prefix}City`] || '',
    formData[`${prefix}State`] || '',     // ✅ Added state
    formData[`${prefix}PIN`] || ''
  ].filter(Boolean);

  return parts.join(', ');
};

const handleCopyAddress = (e) => {
  const checked = e.target.checked;
  setCopyChecked(checked);

  if (checked) {
    const updatedCity = formData.communicationCity || '';
    const updatedState = formData.communicationState || '';

    setFormData((prev) => ({
      ...prev,
      residenceHouseNo: prev.communicationHouseNo || '',
      residenceStreet: prev.communicationStreet || '',
      residenceArea: prev.communicationArea || '',
      residencePIN: prev.communicationPIN || '',
      residenceCity: updatedCity,
      residenceState: updatedState
    }));

    // 🔧 ensure inputs reflect copied values
    setResCityInput(updatedCity);
  }
};

  const validateAndProceed = async () => {
  const comm = combineAddress('communication');
  const resi = combineAddress('residence');

  // Compose the updated formData for validation
  const updatedFormData = {
    ...formData,
    communicationAddress: comm,
    residenceAddress: resi
  };

  const requiredFields = [
    { name: 'communicationAddress', label: 'Communication Address' },
    { name: 'residenceAddress', label: 'Residence Address' }
  ];

  const newErrors = validateRequiredFields(updatedFormData, requiredFields);
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    setFormData((prev) => ({
  ...prev,
  communicationAddress: comm,
  residenceAddress: resi
}));

    const success = await handleIntermediateProfileUpdate({ formData: updatedFormData, setIsProcessing });
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

      {/* Summary */}
      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>
<h3 className="font-semibold text-gray-800 pt-4 pb-1">Other Contact Details</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Alternate Phone - full width row */}
  <div className="md:col-span-2">
    <L>Alternate Phone</L>
    <div className="flex space-x-2 w-full">
      <TextField
        select
        name="alternatePhoneCountryCode"
        value={formData.alternatePhoneCountryCode || '+91'}
        onChange={handleChange}
        sx={{
          width: 160,
          backgroundColor: "#fff",
          borderRadius: 1,
          '& .MuiInputBase-root': {
            height: '40px',
          },
          '& .MuiInputBase-input': {
            padding: '8px 14px',
          }
        }}
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

  {/* Guardian Phone - full width row */}
  <div className="md:col-span-2">
    <L>Guardian Phone</L>
    <div className="flex space-x-2 w-full">
      <TextField
        select
        name="guardianPhoneCountryCode"
        value={formData.guardianPhoneCountryCode || '+91'}
        onChange={handleChange}
        sx={{
          width: 160,
          backgroundColor: "#fff",
          borderRadius: 1,
          '& .MuiInputBase-root': {
            height: '40px',
          },
          '& .MuiInputBase-input': {
            padding: '8px 14px',
          }
        }}
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


      <h3 className="font-semibold text-gray-800 pt-2 pb-1">Communication Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><L>House No</L><I name="communicationHouseNo" value={formData.communicationHouseNo || ''} onChange={handleChange} /></div>
        <div><L>Street</L><I name="communicationStreet" value={formData.communicationStreet || ''} onChange={handleChange} /></div>
        <div><L>Area</L><I name="communicationArea" value={formData.communicationArea || ''} onChange={handleChange} /></div>
        
         {/* ✅ Replace city input with this */}
  <div className="md:col-span-3">
    <StateCitySelector
      formData={formData}
      handleChange={handleChange}
      cityField="communicationCity"
      stateField="communicationState"
      labelPrefix="Communication"
    />
  </div>
        
        
        <div><L>PIN Code</L><I name="communicationPIN" value={formData.communicationPIN || ''} onChange={handleChange} /></div>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <input type="checkbox" checked={copyChecked} onChange={handleCopyAddress} id="copyAddress" />
        <label htmlFor="copyAddress" className="text-sm text-gray-700">Same as Communication Address</label>
      </div>

      <h3 className="font-semibold text-gray-800 pt-2 pb-1">Residence Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><L>House No</L><I name="residenceHouseNo" value={formData.residenceHouseNo || ''} onChange={handleChange} /></div>
        <div><L>Street</L><I name="residenceStreet" value={formData.residenceStreet || ''} onChange={handleChange} /></div>
        <div><L>Area</L><I name="residenceArea" value={formData.residenceArea || ''} onChange={handleChange} /></div>
         {/* ✅ Replace city input with this */}
  <div className="md:col-span-3">
    <StateCitySelector
      formData={formData}
      handleChange={handleChange}
      cityField="residenceCity"
      stateField="residenceState"
      labelPrefix="Residence"
    />
  </div>
        
        
        
        
        <div><L>PIN Code</L><I name="residencePIN" value={formData.residencePIN || ''} onChange={handleChange} /></div>
      </div>

      
      <div className="flex justify-between pt-6">
        <B variant="outline" onClick={onPrevious}>⬅️ Previous</B>
        <B onClick={validateAndProceed}>Save & Next ➡️</B>
      </div>
    </div>
  );
};

export default Popup7_ContactAddress;
