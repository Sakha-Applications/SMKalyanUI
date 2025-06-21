// components/ModifyProfile/PartnerPreferences/sections/CulturalPreferences.jsx
import React from 'react';
import MultiSelectCheckbox from '../../../common/MultiSelectCheckbox';
import { RadioGroup } from '../../../common/FormElements';
import { Label } from '../../../common/FormElements';
import { formatDisplayValue, formatSelectedValues,normalizeDisplayArray } from '../helpers/utils';

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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (name, values) => {
    setFormData((prev) => ({ ...prev, [name]: values.map(v => v.label || v.value || v) }));
  };

  if (mode === 'view') {
    console.log("👀 profileData.preferred_gotras:", profileData.preferred_gotras);
    return (
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-6 pb-2 border-b border-indigo-200">
          Cultural & Spiritual Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Sub Caste", field: "preferred_sub_castes" },
            { label: "Guru Matha", field: "preferred_guru_mathas" },
            { label: "Gotra", field: "preferred_gotras" },
            { label: "Nakshatra", field: "preferred_nakshatras" },
            { label: "Rashi", field: "preferred_rashis" },
           
          ].map(({ label, field }) => (
            <div key={field} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">{label}</h4>
              <p className="text-gray-600">
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
      <h2 className="text-xl font-semibold text-indigo-600 mb-6 pb-2 border-b border-indigo-200">
        Cultural & Spiritual Preferences
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
