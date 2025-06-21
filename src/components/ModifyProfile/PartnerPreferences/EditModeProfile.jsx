// components/ModifyProfile/PartnerPreferences/EditModeProfile.jsx

import React from "react";
import BasicProfile from './sections/BasicProfile';
import BirthAndAstro from './sections/BirthAndAstro';
import ContactDetails from './sections/ContactDetails';
import EducationJobDetails from './sections/EducationJobDetails';
import FamilyDetails from './sections/FamilyDetails';
import HoroscopeDetails from './sections/HoroscopeDetails';
import AddressDetails from './sections/AddressDetails';
import ReferencesSection from './sections/ReferencesSection';

const EditModeProfile = ({
  profileData,
  formData,
  setFormData,
  handleUpdate,
  loading,
  setIsEditing,
  // Horoscope dropdown props
  gotraOptions,
  rashiOptions,
  nakshatraOptions,
  guruMathaOptions,
  guruMathaInput,
  setGuruMathaInput,
  guruMathaLoading,
  setGuruMathaOptions,
  searchGuruMatha,
  // Education/Profession autocomplete props
  educationOptions,
  educationInput,
  setEducationInput,
  educationLoading,
  motherTongueOptions,
  motherTongueInput,
  setMotherTongueInput,
  motherTongueLoading,
   setMotherTongueOptions, // Add this if you haven't already added it to EditModeProfile props
        searchMotherTongues,
  professionOptions,
  professionInput,
  setProfessionInput,
  professionLoading,
   setProfessionOptions,
  searchProfessions,
    setEducationOptions,
  searchEducation,

    designationOptions,
  designationInput,
  setDesignationInput,
  designationLoading,
  setDesignationOptions,
  searchDesignations,

fatherProfessionInput, // This will need to come from MyProfilePage's state
  setFatherProfessionInput, // This will need to come from MyProfilePage's state setter
  motherProfessionInput, // This will need to come from MyProfilePage's state
  setMotherProfessionInput, // Thi


  // Static options
  maritalStatusOptions,
  brideGroomCategoryOptions,
  subCasteOptions,
  manglikOptions,
  hobbyOptions,
}) => {

  // ADD THESE LOGS AT THE TOP OF THE COMPONENT FUNCTION
  console.log("DEBUG_EDITMODEPROFILE: formData received (Native/Current Location):", {
      nativePlaceCountry: formData?.nativePlaceCountry,
      nativePlaceState: formData?.nativePlaceState,
      nativePlace: formData?.nativePlace,
      currentLocationCountry: formData?.currentLocationCountry,
      currentLocationState: formData?.currentLocationState,
      currentLocation: formData?.currentLocation
  });
  console.log("DEBUG_EDITMODEPROFILE: Full formData object received:", formData);

  return (
    <div className="space-y-8">
      <BasicProfile mode="edit" profileData={profileData} formData={formData} 
      setFormData={setFormData}
       motherTongueOptions={motherTongueOptions}
        motherTongueInput={motherTongueInput}
        setMotherTongueInput={setMotherTongueInput}
        motherTongueLoading={motherTongueLoading} 
        setMotherTongueOptions={setMotherTongueOptions} // Add this if you haven't already added it to EditModeProfile props
        searchMotherTongues={searchMotherTongues}
        maritalStatusOptions={maritalStatusOptions}
      brideGroomCategoryOptions={brideGroomCategoryOptions}
      hobbyOptions={hobbyOptions} 
        />
  <AddressDetails mode="edit" profileData={profileData} formData={formData} setFormData={setFormData} />
  
  {/* ✅ FIXED: Pass all required props to EducationJobDetails */}
      <EducationJobDetails 
        mode="edit" 
        profileData={profileData} 
        formData={formData} 
        setFormData={setFormData}
        educationOptions={educationOptions}
        educationInput={educationInput}
        setEducationInput={setEducationInput}
        educationLoading={educationLoading}
        setEducationOptions={setEducationOptions}
        searchEducations={searchEducation}
        professionOptions={professionOptions}
        professionInput={professionInput}
        setProfessionInput={setProfessionInput}
        professionLoading={professionLoading}
        setProfessionOptions={setProfessionOptions} 
         searchProfessions={searchProfessions}
          designationOptions={designationOptions} // Pass this
    designationInput={designationInput}     // Pass this
    setDesignationInput={setDesignationInput} // Pass this
    designationLoading={designationLoading}   // Pass this
    setDesignationOptions={setDesignationOptions} // Pass this
    searchDesignations={searchDesignations}   // Pass this
      />
    {/* ✅ FIXED: Pass all required props to HoroscopeDetails */}
      <HoroscopeDetails
        mode="edit"
        profileData={profileData}
        formData={formData}
        setFormData={setFormData}
        gotraOptions={gotraOptions}
        rashiOptions={rashiOptions}
        nakshatraOptions={nakshatraOptions}
        guruMathaOptions={guruMathaOptions}
        guruMathaInput={guruMathaInput}
        setGuruMathaInput={setGuruMathaInput}
        guruMathaLoading={guruMathaLoading}
        setGuruMathaOptions={setGuruMathaOptions}
        searchGuruMatha={searchGuruMatha}
      />
  
      
      <FamilyDetails mode="edit" profileData={profileData} formData={formData} 
      setFormData={setFormData}
      // These are the new input states for father/mother professions
        fatherProfessionInput={fatherProfessionInput}
        setFatherProfessionInput={setFatherProfessionInput}
        motherProfessionInput={motherProfessionInput}
        setMotherProfessionInput={setMotherProfessionInput}
        // These profession-related props are already coming from MyProfilePage for EducationJobDetails, just reuse them:
        professionOptions={professionOptions}
        professionLoading={professionLoading}
        setProfessionOptions={setProfessionOptions}
        searchProfessions={searchProfessions} />
      
      
      <ReferencesSection mode="edit" profileData={profileData} formData={formData} setFormData={setFormData} />

      <div className="flex justify-center pt-6 gap-8">
        <button
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
          onClick={handleUpdate}
          disabled={loading}
        >
          💾 {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200"
          onClick={() => setIsEditing(false)}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default EditModeProfile;