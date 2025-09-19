// src/components/profileRegistration/Popup4_CareerEducation.js

import React, { useState } from 'react';
import { Label as L, Select as S, Button as B } from '../common/FormElements';
import useApiData from '../../hooks/useApiData';
import renderAutocomplete from './helpers/renderAutocomplete';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import { Country } from 'country-state-city';

const Popup4_CareerEducation = ({
  formData,
  handleChange,
  onNext,
  onPrevious,
  setIsProcessing,
  handleIntermediateProfileUpdate
}) => {
  const { searchEducation, searchProfessions, searchDesignations } = useApiData();
  const [errors, setErrors] = useState({});

  const [educationInput, setEducationInput] = useState(formData.education || '');
  const [professionInput, setProfessionInput] = useState(formData.profession || '');
  const [designationInput, setDesignationInput] = useState(formData.designation || '');

  const [educationOptions, setEducationOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  const [showEduOptions, setShowEduOptions] = useState(false);
  const [showProfOptions, setShowProfOptions] = useState(false);
  const [showDesigOptions, setShowDesigOptions] = useState(false);

  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [countries] = useState(Country.getAllCountries());


  // Fixed: Change from array of objects to array of strings
  const countryOptions = [
    'India',
    'USA',
    'UK',
    'Canada',
    'Australia',
    'Germany',
    'Singapore',
    'UAE'
  ];

  const validateAndProceed = async () => {
  const newErrors = {};
  if (!educationInput) newErrors.education = 'Education is required';
  if (!professionInput) newErrors.profession = 'Profession is required';
  if (!formData.workingStatus) newErrors.workingStatus = 'Working status is required';

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    handleChange({ target: { name: 'education', value: educationInput } });
    handleChange({ target: { name: 'profession', value: professionInput } });
    handleChange({ target: { name: 'designation', value: designationInput } });

    const success = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
    if (success) onNext();
  } else {
    setShowErrorDialog(true); // Show dialog on error
  }
};


  return (
    <div className="space-y-6">
      <ValidationErrorDialog 
  errors={errors}
  isOpen={showErrorDialog}
  onClose={() => setShowErrorDialog(false)}
/>

      {/* Top Bar */}
      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 mb-4 shadow-sm text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderAutocomplete({
          label: 'Education *',
          name: 'education',
          inputValue: educationInput,
          inputSetter: setEducationInput,
          show: showEduOptions,
          setShow: setShowEduOptions,
          options: educationOptions,
          setOptions: setEducationOptions,
          searchFn: searchEducation,
          handleChange,
          errors
        })}

        {renderAutocomplete({
          label: 'Profession *',
          name: 'profession',
          inputValue: professionInput,
          inputSetter: setProfessionInput,
          show: showProfOptions,
          setShow: setShowProfOptions,
          options: professionOptions,
          setOptions: setProfessionOptions,
          searchFn: searchProfessions,
          handleChange,
          errors
        })}

        {renderAutocomplete({
          label: 'Designation',
          name: 'designation',
          inputValue: designationInput,
          inputSetter: setDesignationInput,
          show: showDesigOptions,
          setShow: setShowDesigOptions,
          options: designationOptions,
          setOptions: setDesignationOptions,
          searchFn: searchDesignations,
          handleChange,
          errors
        })}

<div>
  <L htmlFor="currentCompany">Current Company</L>
  <input
    type="text"
    name="current_company"
    value={formData.current_company || ''}
    onChange={handleChange}
    className="w-full border rounded px-2 py-1"
    placeholder="Enter your current company"
  />
</div>



        <div>
          <L>Working Status <span className="text-red-500">*</span></L>
          <S
            name="workingStatus"
            value={formData.workingStatus || ''}
            onChange={handleChange}
            required
            error={!!errors.workingStatus}
            helperText={errors.workingStatus}
          >
            <option value="">Select</option>
            <option value="Working in Private Company">Working in Private Company</option>
            <option value="Working in Government / Public Sector">Working in Government / Public Sector</option>
            <option value="Business / Self Employed">Business / Self Employed</option>
            <option value="Defense / Civil Services">Defense / Civil Services</option>
            <option value="Not working">Not working</option>
            <option value="Others">Others</option>
          </S>
        </div>
<div>
    <L htmlFor="countryLivingIn">Country Living In</L>
<S
  name="countryLivingIn"
  value={formData.countryLivingIn || ''}
  onChange={handleChange}
  className="w-full"
>
  <option value="">-- Select Country --</option>
  {countries.map((country) => (
    <option key={country.isoCode} value={country.name}>
      {country.name}
    </option>
  ))}
</S>
</div>
        

        <div>
          <L>Annual Income in INR</L>
          <S name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange}>
            <option value="">Select Income Range</option>
            <option value="Below ₹2 Lakh">Below ₹2 Lakh</option>
            <option value="₹2 to ₹4 Lakh">₹2 to ₹4 Lakh</option>
            <option value="₹4 to ₹6 Lakh">₹4 to ₹6 Lakh</option>
            <option value="₹6 to ₹10 Lakh">₹6 to ₹10 Lakh</option>
            <option value="₹10 to ₹15 Lakh">₹10 to ₹15 Lakh</option>
            <option value="₹15 to ₹25 Lakh">₹15 to ₹25 Lakh</option>
            <option value="₹25 to ₹50 Lakh">₹25 to ₹50 Lakh</option>
            <option value="₹50 Lakh to ₹1 Crore">₹50 Lakh to ₹1 Crore</option>
            <option value="Above ₹1 Crore">Above ₹1 Crore</option>
          </S>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <B variant="outline" onClick={onPrevious}>Previous</B>
        <B onClick={validateAndProceed}>Save & Next</B>
      </div>
    </div>
  );
};

export default Popup4_CareerEducation;