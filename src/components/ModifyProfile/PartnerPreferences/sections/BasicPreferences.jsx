// components/ModifyProfile/PartnerPreferences/sections/BasicPreferences.jsx
import React from 'react';
import { Slider } from '@mui/material';
import { Label, TextArea, Select } from '../../../common/FormElements';
import MultiSelectCheckbox from '../../../common/MultiSelectCheckbox';

import { RadioGroup } from '../../../common/FormElements';


import { cmToFeetInches, formatDisplayValue, formatSelectedValues } from '../helpers/utils';

const BasicPreferences = ({
  mode = 'view', // 'view' or 'edit'
  profileData = {},
  formData = {},
  setFormData = () => {},
  educationOptions = [],
  educationInput = '',
  setEducationInput = () => {},
  educationLoading = false,
  maritalStatusOptions = [],
  brideGroomCategoryOptions = []
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? [...value] : value
    }));
  };

  console.log("🧠 formData.preferredEducation:", formData.preferredEducation);
console.log("🎓 formatted:", formatSelectedValues(formData, 'preferredEducation'));
  if (mode === 'view') {
    return (
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-6 pb-2 border-b border-indigo-200">Basic Preferences</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Expectations</h4>
            <p className="text-gray-600">{formatDisplayValue(profileData.expectations)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Age Range</h4>
              <p className="text-gray-600">{formatDisplayValue(profileData.age_range)} years</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Height Range</h4>
              <p className="text-gray-600">
                {profileData.height_range
                  ? profileData.height_range
                      .split(',')
                      .map((h) => cmToFeetInches(parseInt(h.trim())))
                      .join(' - ')
                  : '-'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Annual Income Range</h4>
              <p className="text-gray-600">{formatDisplayValue(profileData.preferred_income_range)} Lacs</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Marital Status</h4>
              <p className="text-gray-600">{formatDisplayValue(profileData.preferred_marital_status)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Mother Tongue</h4>
              <p className="text-gray-600">{formatDisplayValue(profileData.preferred_mother_tongues)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Bride/Groom Category</h4>
              <p className="text-gray-600">{formatDisplayValue(profileData.preferred_bride_groom_category)}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Education</h4>
            <p className="text-gray-600">{formatDisplayValue(profileData.preferred_education)}</p>
          </div>
        </div>
      </section>
    );
  }

  // Edit Mode
  return (
    <section>
      <h2 className="text-xl font-semibold text-indigo-600 mb-6 pb-2 border-b border-indigo-200">Basic Preferences</h2>
      <div className="space-y-6">
        <div>
          <Label>Expectations</Label>
          <TextArea
            name="expectations"
            value={formData.expectations || ''}
            onChange={handleInputChange}
            placeholder="Write something about your preferred match..."
            rows={3}
          />
        </div>

        <div>
          <Label>Preferred Age Range</Label>
          <Slider
  value={formData.ageRange || [25, 35]}
  onChange={(e, val) => handleInputChange({ target: { name: 'ageRange', value: val } })}
  valueLabelDisplay="on"
  valueLabelFormat={(val) => `${val} yrs`}
  min={18}
  max={60}
  step={1}
  className="mt-4"
/>

        </div>

        <div>
          <Label>Preferred Height Range</Label>
          <Slider
            value={formData.heightRange || [150, 180]}
            onChange={(e, val) => handleInputChange({ target: { name: 'heightRange', value: val } })}
            valueLabelDisplay="on"
            min={120}
            max={210}
            marks={[120, 150, 180, 210].map((val) => ({ value: val, label: cmToFeetInches(val) }))}
            valueLabelFormat={(value) => cmToFeetInches(value)}
            className="mt-4"
          />
        </div>

        <div>
          <Label>Annual Income Range (INR Lacs)</Label>
    <Slider
  value={formData.preferredIncomeRange || [5, 20]}
  onChange={(e, val) => handleInputChange({ target: { name: 'preferredIncomeRange', value: val } })}
  valueLabelDisplay="on"
  valueLabelFormat={(val) => `${val} L`}
  min={0}
  max={100}
  step={1}
  className="mt-4"
/>


        </div>

        <div>
          <Label>Preferred Marital Status</Label>
          <Select
            name="preferredMaritalStatus"
            value={formData.preferredMaritalStatus || formData.preferred_marital_status || ''}
            onChange={handleInputChange}
          >
            <option value="">-- Select --</option>
            {maritalStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Preferred Bride/Groom Category</Label>
          <Select
            name="preferredBrideGroomCategory"
            value={formData.preferredBrideGroomCategory || formData.preferred_bride_groom_category || ''}
            onChange={handleInputChange}
          >
            <option value="">-- Select --</option>
            {brideGroomCategoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

<MultiSelectCheckbox
  label="Preferred Education"
  name="preferredEducation"
  options={educationOptions}
  selectedValues={
    formatSelectedValues(formData, 'preferredEducation') ||
    formatSelectedValues(profileData, 'preferred_education') || // Add fallback to profileData
    []
  }
  onSearch={setEducationInput}
  searchInput={educationInput}
  onChange={(name, values) => {
    handleInputChange({
      target: {
        name,
        value: values.map((v) => v.label || v.value || v)
      }
    });
    setEducationInput('');
  }}
  placeholder="Type to search education (min 2 characters)"
  loading={educationLoading}
/>

      </div>
    </section>
  );
};

export default BasicPreferences;
