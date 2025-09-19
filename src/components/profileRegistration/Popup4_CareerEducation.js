import React, { useState } from 'react';
import { Label as L, Select as S, Button as B } from '../common/FormElements';
import useApiData from '../../hooks/useApiData';
import renderAutocomplete from './helpers/renderAutocomplete';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import { Country } from 'country-state-city';

const Popup4_CareerEducation = ({
  formData,
  handleChange,
  onNext,
  onPrevious,
  setIsProcessing,
  handleIntermediateProfileUpdate,
  // 👇 NEW: for triggering confirm dialog
  setShowPopup4ConfirmDialog
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
      if (success) {
        // ⛔ do not auto-navigate, open confirmation dialog
        if (typeof setShowPopup4ConfirmDialog === 'function') {
          setShowPopup4ConfirmDialog(true);
        }
      }
    } else {
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          Let's cover your Career & Education Details
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

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderAutocomplete({
              label: 'Your Highest Qualification',
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
              label: 'Profession ',
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

            {/* Fields Grid 
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
            */}

            <div>
              <L>Annual Income in INR<span className="text-red-500">*</span></L>
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

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>Previous</B>
            {/* 🔁 Renamed + confirm flow */}
            <B onClick={validateAndProceed}>Create Profile</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup4_CareerEducation;
