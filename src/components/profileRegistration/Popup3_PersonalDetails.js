import React, { useState } from 'react';
import { Label as L, Input as I, Select as S, TextArea, Button as B } from '../common/FormElements';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import StateCitySelector from "../common/StateCitySelector";
import CountryStateCitySelector from "../common/CountryStateCitySelector";

const Popup3_PersonalDetails = ({
  formData,
  handleChange,
  handleTimeBlur,
  onNext,
  onPrevious,
  setIsProcessing,
  handleIntermediateProfileUpdate
}) => {
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const dietOptions = [
    { label: 'Vegetarian' },
    { label: 'Eggetarian' },
    { label: 'Non-Vegetarian' },
    { label: 'Vegan' },
    { label: "Doesn't Matter" }
  ];

  const hobbyOptions = [
    { label: 'Reading' },
    { label: 'Traveling' },
    { label: 'Music' },
    { label: 'Sports' },
    { label: 'Art & Craft' },
    { label: 'Cooking' },
    { label: 'Meditation' },
    { label: 'Gardening' },
    { label: 'Photography' }
  ];

  const getAgeWithMonths = (dob) => {
    if (!dob) return '';
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months = (months + 12) % 12;
    }

    return `${years} years${months > 0 ? ` ${months} months` : ''}`;
  };

  const validateAndProceed = async () => {
    const newErrors = {};
    if (!formData.marriedStatus) newErrors.marriedStatus = "Married Status is required";
    if (!formData.heightFeet || !formData.heightInches) newErrors.height = "Height is required";
    if (!formData.profileCategory) newErrors.profileCategory = "Bride/Groom category is required";
    if (!formData.nativePlace) newErrors.nativePlace = "Native place is required";
    if (!formData.placeOfBirth) newErrors.placeOfBirth = "Place of birth is required";
    if (!formData.timeOfBirth) newErrors.timeOfBirth = "Time of birth is required";
    if (!formData.aboutBrideGroom) newErrors.aboutBrideGroom = "About Yourself is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const success = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
      console.log("Update Success:", success);
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

      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 mb-4 shadow-sm text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <L>Date of Birth</L>
          <I type="text" value={formData.dob || ''} readOnly />
        </div>

        <div>
          <L>Current Age</L>
          <I type="text" value={getAgeWithMonths(formData.dob) || ''} readOnly />
        </div>

        <div>
          <L htmlFor="marriedStatus">Married Status <span className="text-red-500">*</span></L>
          <S name="marriedStatus" value={formData.marriedStatus} onChange={handleChange} required error={!!errors.marriedStatus}>
            <option value="">Select</option>
            <option value="Single (Never Married)">Single (Never Married)</option>
            <option value="Divorced">Divorced</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
          </S>
        </div>

        <div>
          <L>Height <span className="text-red-500">*</span></L>
          <div className="flex space-x-2">
            <S name="heightFeet" value={formData.heightFeet || ''} onChange={handleChange} required className="w-1/2" error={!!errors.height}>
              <option value="">Feet</option>
              {[4, 5, 6, 7].map(f => <option key={f} value={f}>{f} ft</option>)}
            </S>
            <S name="heightInches" value={formData.heightInches || ''} onChange={handleChange} required className="w-1/2" error={!!errors.height}>
              <option value="">Inches</option>
              {[...Array(12).keys()].map(i => <option key={i} value={i}>{i} in</option>)}
            </S>
          </div>
        </div>

        <div>
          <L htmlFor="profileCategory">Bride/Groom Category <span className="text-red-500">*</span></L>
          <S
            name="profileCategory"
            value={formData.profileCategory || ''}
            onChange={handleChange}
            required
            error={!!errors.profileCategory}
            className="w-full"
          >
            <option value="">Select Category</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
            <option value="Vaidhik">Vaidhik</option>
            <option value="Anyone">Anyone</option>
          </S>
        </div>

        <div>
          <L htmlFor="timeOfBirth">Time of Birth <span className="text-red-500">*</span></L>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={formData.timeOfBirth ? dayjs(formData.timeOfBirth, 'HH:mm:ss') : null}
              onChange={(time) => {
                const formatted = time ? time.format('HH:mm:ss') : '';
                handleChange({ target: { name: 'timeOfBirth', value: formatted } });
              }}
              renderInput={(params) => (
                <I
                  {...params}
                  name="timeOfBirth"
                  required
                  error={!!errors.timeOfBirth}
                  helperText={errors.timeOfBirth}
                  className="w-full"
                />
              )}
            />
          </LocalizationProvider>
          <div>
            <small>Select time of birth in hh:mm AM/PM format (e.g. 08:30 AM)</small>
          </div>
        </div>

<CountryStateCitySelector
  formData={formData}
  handleChange={handleChange}
  countryField="nativePlaceCountry"
  stateField="nativePlaceState"
  cityField="nativePlace"
  labelPrefix="Native"
/>

  <CountryStateCitySelector
  formData={formData}
  handleChange={handleChange}
  countryField="placeOfBirthCountry"
  stateField="placeOfBirthState"
  cityField="placeOfBirth"
  labelPrefix="Place of Birth"
/>

        <MultiSelectCheckbox
          label="Hobbies"
          name="hobbies"
          options={hobbyOptions}
          selectedValues={(formData.hobbies || []).map(item => ({ label: item, value: item }))}
          onChange={(name, values) =>
            handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } })
          }
        />

        <div className="md:col-span-2">
          <L htmlFor="aboutBrideGroom">About Yourself <span className="text-red-500">*</span></L>
          <TextArea
            name="aboutBrideGroom"
            value={formData.aboutBrideGroom || ''}
            onChange={handleChange}
            rows={5}
            required
            error={!!errors.aboutBrideGroom}
            placeholder="Write something about yourself..."
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <B variant="outline" onClick={onPrevious} disabled>Previous</B>
        <B onClick={validateAndProceed}>Save & Next</B>
      </div>
    </div>
  );
};

export default Popup3_PersonalDetails;
