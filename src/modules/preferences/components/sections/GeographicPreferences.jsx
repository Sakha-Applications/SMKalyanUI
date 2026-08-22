import React from 'react';
import MultiSelectCheckbox from '../../../../shared/common/MultiSelectCheckbox';
import MultiCountrySelector from '../../../../shared/common/MultiCountrySelector';
import { normalizeDisplayArray } from '../helpers/utils';

import MultiCountryStateCitySelector from '../../../../shared/common/MultiCountryStateCitySelector';
import FullWidthHobbiesGrid from '../../../../shared/components/FullWidthHobbiesGrid';


const GeographicPreferences = ({
  mode = 'view',
  profileData = {},
  formData = {},
  setFormData = () => {},
  editModeActive,  // Ã¢Å“â€¦ Fixed here
  professionOptions = [],
  professionInput = '',
  setProfessionInput = () => {},
  professionLoading = false,
   dietOptions = []
}) => {
   const handleMultiChange = (name, values) => {
     setFormData((prev) => ({
       ...prev,
       [name]: values.map((v) =>
         typeof v === "object" && v !== null
           ? v
           : { label: v, value: v }
       ),
     }));
   };

   const handleHobbyChange = (e) => {
     const { name, value } = e.target;

     setFormData((prev) => ({
       ...prev,
       [name]: Array.isArray(value) ? value : [],
     }));
   };


  if (mode === 'view') {
    console.log("Ã°Å¸â€˜â‚¬ profileData.preferred_gotras:", profileData.preferred_gotras);
    return (
      <section>
        
        <div className="space-y-6">
          {[
            { label: "Preferred Native Origins", field: "preferred_native_origins" },
{ label: "Preferred Locations", field: "preferred_cities" },
{ label: "Preferred Countries", field: "preferred_countries" },
{ label: "Preferred Profession", field: "preferred_professions" },
{ label: "Preferred Diet", field: "preferred_diet" },
{ label: "Preferred Hobbies", field: "preferred_hobbies" },
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
        Geographic & Lifestyle Expectations
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
  labelPrefix="Preferred Native Origins (Country / State / City) : "
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
  key={`cities-${editModeActive}`}
labelPrefix="Preferred Locations (Country / State / City) : "
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
  label="Preferred Diet"
  name="preferredDiet"
  options={dietOptions}
  selectedValues={
    formatSelectedValues(formData, "preferredDiet").length
      ? formatSelectedValues(formData, "preferredDiet")
      : formatSelectedValues(profileData, "preferred_diet")
  }
  onChange={handleMultiChange}
  placeholder="Select preferred diet"
/>

<FullWidthHobbiesGrid
  label="Preferred Hobbies"
  fieldName="preferredHobbies"
  formData={{
    ...formData,
    preferredHobbies:
      formatSelectedValues(formData, "preferredHobbies").length
        ? formatSelectedValues(formData, "preferredHobbies")
        : formatSelectedValues(profileData, "preferred_hobbies"),
  }}
  handleChange={handleHobbyChange}
/>
        



      </div>
    </section>
  );
};

export default GeographicPreferences;
