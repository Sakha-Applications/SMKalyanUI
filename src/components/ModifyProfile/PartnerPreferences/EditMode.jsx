// components/ModifyProfile/PartnerPreferences/EditMode.jsx
import React, { useEffect } from 'react';
import { Slider } from '@mui/material';
import { Label, TextArea, Select } from '../../common/FormElements';
import MultiSelectCheckbox from '../../common/MultiSelectCheckbox';
import { RadioGroup } from '../../common/FormElements';

import { cmToFeetInches, formatSelectedValues } from './helpers/utils';
import BasicPreferences from './sections/BasicPreferences';
import CulturalPreferences from './sections/CulturalPreferences';
import GeographicPreferences from './sections/GeographicPreferences';


const EditMode = ({
  profileData,
  formData,
  setFormData,
  editModeActive,
  handleUpdate,
  setIsEditing,
  loading,
  educationOptions,
  educationInput,
  setEducationInput,
  educationLoading,
  motherTongueOptions,
  motherTongueInput,
  setMotherTongueInput,
  motherTongueLoading,
  guruMathaOptions,
  guruMathaInput,
  setGuruMathaInput,
  guruMathaLoading,
  gotraOptions,
  nakshatraOptions,
  rashiOptions,
  manglikOptions,
  subCasteOptions,
  maritalStatusOptions,
  brideGroomCategoryOptions,
  professionOptions,
  professionInput,
  setProfessionInput,
  professionLoading,
  hobbyOptions,
  dietOptions
}) => {


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Array.isArray(value) ? [...value] : value
    }));
  };
console.log("✏️ EditMode - formData:", formData);

  return (
    <div className="space-y-8">
      {/* Basic Preferences */}

      {/* TODO: Add other sections as needed (Cultural, Geographic, etc.) */}
<BasicPreferences
  mode="edit"
  profileData={profileData}
  formData={formData}
  setFormData={setFormData}
  educationOptions={educationOptions}
  educationInput={educationInput}
  setEducationInput={setEducationInput}
  educationLoading={educationLoading}
  maritalStatusOptions={maritalStatusOptions}
  brideGroomCategoryOptions={brideGroomCategoryOptions}
/>

<CulturalPreferences
  mode="edit"
  profileData={profileData}
  formData={formData}
  setFormData={setFormData}
  subCasteOptions={subCasteOptions}
  guruMathaOptions={guruMathaOptions}
  gotraOptions={gotraOptions}
  nakshatraOptions={nakshatraOptions}
  rashiOptions={rashiOptions}
  manglikOptions={manglikOptions}
  guruMathaInput={guruMathaInput}
  setGuruMathaInput={setGuruMathaInput}
  guruMathaLoading={guruMathaLoading}
/>

<GeographicPreferences
  mode="edit"
  profileData={profileData}
  formData={formData}
  setFormData={setFormData}
  professionOptions={professionOptions}
  professionInput={professionInput}
  setProfessionInput={setProfessionInput}
  professionLoading={professionLoading}
  hobbyOptions={hobbyOptions}
  dietOptions={dietOptions}
/>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-200">
        <button
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </div>
          ) : (
            <>💾 Save Preferences</>
          )}
        </button>

        <button
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => setIsEditing(false)}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default EditMode;
