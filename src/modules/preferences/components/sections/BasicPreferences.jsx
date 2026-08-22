import React from 'react';
import RangeSliderField from "../../../../shared/forms/RangeSliderField";
import { Label, TextArea, Select } from "../../../../shared/common/FormElements";
import MultiSelectCheckbox from "../../../../shared/common/MultiSelectCheckbox";

import { cmToFeetInches, formatDisplayValue, formatSelectedValues } from '../helpers/utils';
import {
  designClasses,
} from "../../../../shared/styles/designTokens";

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

  if (mode === 'view') {
    return (
      <section>
        <div className="space-y-4">
          <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
            <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Expectations</h4>
            <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.expectations)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Age Range</h4>
              <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.age_range)} years</p>
            </div>
            <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Height Range</h4>
              <p className={designClasses.textSecondary}>
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
            <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Annual Income Range</h4>
              <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.preferred_income_range)} Lacs</p>
            </div>
            <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Marital Status</h4>
              <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.preferred_marital_status)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Mother Tongue</h4>
              <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.preferred_mother_tongues)}</p>
            </div>
            <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Bride/Groom Category</h4>
              <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.preferred_bride_groom_category)}</p>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
            <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>Education</h4>
            <p className={designClasses.textSecondary}>{formatDisplayValue(profileData.preferred_education)}</p>
          </div>
        </div>
      </section>
    );
  }

  // Edit Mode
  return (
    <section>
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

        <RangeSliderField
          label="Preferred Age Range"
          value={
            formData.ageRange ||
            [25, 35]
          }
          min={18}
          max={60}
          step={1}
          onChange={(value) =>
            handleInputChange({
              target: {
                name: "ageRange",
                value,
              },
            })
          }
          formatValue={(value) =>
            `${value} yrs`
          }
        />

        <RangeSliderField
          label="Preferred Height Range"
          value={
            formData.heightRange ||
            [150, 180]
          }
          min={120}
          max={210}
          step={1}
          onChange={(value) =>
            handleInputChange({
              target: {
                name: "heightRange",
                value,
              },
            })
          }
          formatValue={cmToFeetInches}
        />

        <RangeSliderField
          label="Preferred Annual Income"
          value={
            formData.preferredIncomeRange ||
            [5, 20]
          }
          min={0}
          max={100}
          step={1}
          onChange={(value) =>
            handleInputChange({
              target: {
                name:
                  "preferredIncomeRange",
                value,
              },
            })
          }
          formatValue={(value) =>
            `₹${value} lakh`
          }
        />

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
