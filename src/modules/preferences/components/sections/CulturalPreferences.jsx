import React from 'react';
import MultiSelectCheckbox from "../../../../shared/common/MultiSelectCheckbox";
import {
  formatSelectedValues,
  normalizeDisplayArray,
} from "../helpers/utils";

import {
  designClasses,
} from "../../../../shared/styles/designTokens";

const CulturalPreferences = ({
  mode = 'view',
  profileData = {},
  formData = {},
  setFormData = () => {},
  subCasteOptions = [],
  guruMathaOptions = [],
  gotraOptions = [],
  nakshatraOptions = [],
  rashiOptions = [],
  manglikOptions = [],
  guruMathaInput = '',
  setGuruMathaInput = () => {},
  guruMathaLoading = false
}) => {
  const handleMultiChange = (name, values) => {
    setFormData((prev) => ({ ...prev, [name]: values.map(v => v.label || v.value || v) }));
  };

  if (mode === 'view') {
    return (
      <section>
       <div className="space-y-6">
          {[
            { label: "Sub Caste", field: "preferred_sub_castes" },
            { label: "Guru Matha", field: "preferred_guru_mathas" },
            { label: "Gotra", field: "preferred_gotras" },
            { label: "Nakshatra", field: "preferred_nakshatras" },
            { label: "Rashi", field: "preferred_rashis" },
           
          ].map(({ label, field }) => (
            <div key={field} className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}>
              <h4 className={`mb-2 font-semibold ${designClasses.textPrimary}`}>{label}</h4>
              <p className={designClasses.textSecondary}>
  {normalizeDisplayArray(profileData[field])}
</p>

            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2
  className={designClasses.formSectionHeading}
>
  Cultural & Spiritual Expectations
</h2>
      <div className="space-y-6">
<MultiSelectCheckbox
  label="Preferred Sub Caste"
  name="preferredSubCastes"
  options={subCasteOptions}
  selectedValues={
    formatSelectedValues(formData, 'preferredSubCastes') || 
    formatSelectedValues(profileData, 'preferred_sub_castes') || 
    []
  }
  onChange={handleMultiChange}
  placeholder="Select preferred sub castes"
/>

<MultiSelectCheckbox
  label="Preferred Guru Matha"
  name="preferredGuruMathas"
  options={guruMathaOptions}
  selectedValues={
    formatSelectedValues(formData, 'preferredGuruMathas') || 
    formatSelectedValues(profileData, 'preferred_guru_mathas') || 
    []
  }
  onSearch={setGuruMathaInput}
  searchInput={guruMathaInput}
  onChange={handleMultiChange}
  placeholder="Type to search guru matha (min 2 characters)"
  loading={guruMathaLoading}
/>
        <MultiSelectCheckbox
  label="Preferred Gotra"
  name="preferredGotras"
  options={gotraOptions.map(item => ({
    label: item.gotra || item.label || item,
    value: item.gotra || item.value || item
  }))}
  selectedValues={
    formatSelectedValues(formData, 'preferredGotras').length
      ? formatSelectedValues(formData, 'preferredGotras')
      : formatSelectedValues(profileData, 'preferred_gotras')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred gotras"
/>


<MultiSelectCheckbox
  label="Preferred Nakshatra"
  name="preferredNakshatras"
  options={nakshatraOptions.map(item => ({
    label: item.nakshatra || item.label || item,
    value: item.nakshatra || item.value || item
  }))}
  selectedValues={
    formatSelectedValues(formData, 'preferredNakshatras').length
      ? formatSelectedValues(formData, 'preferredNakshatras')
      : formatSelectedValues(profileData, 'preferred_nakshatras')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred nakshatras"
/>

<MultiSelectCheckbox
  label="Preferred Rashi"
  name="preferredRashis"
  options={rashiOptions.map(item => ({
    label: item.rashi || item.label || item,
    value: item.rashi || item.value || item
  }))}
  selectedValues={
    formatSelectedValues(formData, 'preferredRashis').length
      ? formatSelectedValues(formData, 'preferredRashis')
      : formatSelectedValues(profileData, 'preferred_rashis')
  }
  onChange={handleMultiChange}
  placeholder="Select preferred rashis"
/>

  
      </div>
    </section>
  );
};

export default CulturalPreferences;
