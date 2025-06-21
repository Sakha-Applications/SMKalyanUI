// components/ModifyProfile/PartnerPreferences/sections/GeographicPreferences.jsx
import React from 'react';
import MultiSelectCheckbox from '../../../common/MultiSelectCheckbox';
import MultiStateCitySelector from '../../../common/MultiStateCitySelector';
import MultiCountrySelector from '../../../common/MultiCountrySelector';
import { RadioGroup } from '../../../common/FormElements';
import { Label } from '../../../common/FormElements';
import { formatDisplayValue, formatSelectedValues, normalizeDisplayArray } from '../helpers/utils';

import MultiCountryStateCitySelector from '../../../common/MultiCountryStateCitySelector';


const GeographicPreferences = ({
  mode = 'view',
  profileData = {},
  formData = {},
  setFormData = () => {},
  editModeActive,  // ✅ Fixed here
  professionOptions = [],
  professionInput = '',
  setProfessionInput = () => {},
  professionLoading = false,
  hobbyOptions = [],
  dietOptions = []
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (name, values) => {
  setFormData((prev) => ({
    ...prev,
    [name]: values.map((v) =>
      typeof v === 'object' && v !== null
        ? v
        : { label: v, value: v }
    ),
  }));
};


  if (mode === 'view') {
    console.log("👀 profileData.preferred_gotras:", profileData.preferred_gotras);
    return (
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-6 pb-2 border-b border-indigo-200">
          Geographic & Lifestyle Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Native Origins', field: 'preferred_native_origins' },
            { label: 'City Living In', field: 'preferred_cities' },
            { label: 'Country Living In', field: 'preferred_countries' },
            { label: 'Profession', field: 'preferred_professions' },

            { label: 'Hobbies', field: 'preferred_hobbies' },
          ].map(({ label, field }) => (
            <div key={field} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">{label}</h4>
              <p className="text-gray-600">{normalizeDisplayArray(profileData[field], field)}</p>

            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-indigo-600 mb-6 pb-2 border-b border-indigo-200">
        Geographic & Lifestyle Preferences
      </h2>
      <div className="space-y-6">

<MultiCountrySelector
  label="Preferred Countries"
  name="preferredCountries"
  selectedValues={
    formatSelectedValues(formData, 'preferredCountries').length
      ? formatSelectedValues(formData, 'preferredCountries')
      : formatSelectedValues(profileData, 'preferred_countries')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred countries"
/>


<MultiCountryStateCitySelector
  key={`native-${editModeActive}`}
  labelPrefix="Preferred Native Origins : "
  name="preferredNativeOrigins"
  selectedValues={
    formatSelectedValues(formData, 'preferredNativeOrigins').length
      ? formatSelectedValues(formData, 'preferredNativeOrigins')
      : formatSelectedValues(profileData, 'preferred_native_origins')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred native origins"
/>


<MultiCountryStateCitySelector
  key={`native-${editModeActive}`}
  labelPrefix="Preferred Cities : "
  name="preferredCities"
  selectedValues={
    formatSelectedValues(formData, 'preferredCities').length
      ? formatSelectedValues(formData, 'preferredCities')
      : formatSelectedValues(profileData, 'preferred_cities')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred cities"
/>

<MultiSelectCheckbox
  label="Preferred Professions"
  name="preferredProfessions"
  options={professionOptions}
  selectedValues={
    formatSelectedValues(formData, 'preferredProfessions').length
      ? formatSelectedValues(formData, 'preferredProfessions')
      : formatSelectedValues(profileData, 'preferred_professions')
  }
  onSearch={setProfessionInput}
  searchInput={professionInput}
  onChange={(name, values) => {
    handleMultiChange(name, values);
    setProfessionInput('');
  }}
  placeholder="Type to search profession (min 2 characters)"
  loading={professionLoading}
/>


<MultiSelectCheckbox
  label="Preferred Hobbies"
  name="preferredHobbies"
  options={hobbyOptions}
  selectedValues={
    formatSelectedValues(formData, 'preferredHobbies').length
      ? formatSelectedValues(formData, 'preferredHobbies')
      : formatSelectedValues(profileData, 'preferred_hobbies')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred hobbies"
/>
        



      </div>
    </section>
  );
};

export default GeographicPreferences;
