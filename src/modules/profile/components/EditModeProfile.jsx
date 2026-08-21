
import React, { useState } from "react";
import CollapsibleSection from "../../../shared/components/CollapsibleSection";
import BasicProfile from "./sections/BasicProfile";
import EducationJobDetails from "./sections/EducationJobDetails";
import FamilyDetails from "./sections/FamilyDetails";
import HoroscopeDetails from "./sections/HoroscopeDetails";
import AddressDetails from "./sections/AddressDetails";
import ReferencesSection from "./sections/ReferencesSection";

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

fatherProfessionInput, // This will need to come from ProfilePage state
  setFatherProfessionInput, // This will need to come from ProfilePage state setter
  motherProfessionInput, // This will need to come from ProfilePage state
  setMotherProfessionInput, // Thi


  // Static options
  maritalStatusOptions,
  brideGroomCategoryOptions,
  subCasteOptions,
  manglikOptions,
  hobbyOptions,
}) => {
  const [activeSection, setActiveSection] = useState("basic");

  const toggleSection = (sectionId) => {
    setActiveSection((current) =>
      current === sectionId ? null : sectionId
    );
  };

    
  return (

    
    <div className="space-y-8">
      <div className="space-y-4">
  <CollapsibleSection
    number={1}
    title="Personal Details"
    description="Basic profile and personal information."
    open={activeSection === "basic"}
    onToggle={() => toggleSection("basic")}
  >
    <BasicProfile
      mode="edit"
      profileData={profileData}
      formData={formData}
      setFormData={setFormData}
      motherTongueOptions={motherTongueOptions}
      motherTongueInput={motherTongueInput}
      setMotherTongueInput={setMotherTongueInput}
      motherTongueLoading={motherTongueLoading}
      setMotherTongueOptions={setMotherTongueOptions}
      searchMotherTongues={searchMotherTongues}
      maritalStatusOptions={maritalStatusOptions}
      brideGroomCategoryOptions={brideGroomCategoryOptions}
      hobbyOptions={hobbyOptions}
    />
  </CollapsibleSection>

  <CollapsibleSection
    number={2}
    title="Contact & Address"
    description="Contact, native place and address information."
    open={activeSection === "address"}
    onToggle={() => toggleSection("address")}
  >
    <AddressDetails
      mode="edit"
      profileData={profileData}
      formData={formData}
      setFormData={setFormData}
    />
  </CollapsibleSection>

  <CollapsibleSection
    number={3}
    title="Education & Career"
    description="Education, profession and employment details."
    open={activeSection === "career"}
    onToggle={() => toggleSection("career")}
  >
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
      searchEducation={searchEducation}
      professionOptions={professionOptions}
      professionInput={professionInput}
      setProfessionInput={setProfessionInput}
      professionLoading={professionLoading}
      setProfessionOptions={setProfessionOptions}
      searchProfessions={searchProfessions}
      designationOptions={designationOptions}
      designationInput={designationInput}
      setDesignationInput={setDesignationInput}
      designationLoading={designationLoading}
      setDesignationOptions={setDesignationOptions}
      searchDesignations={searchDesignations}
    />
  </CollapsibleSection>

  <CollapsibleSection
    number={4}
    title="Family Details"
    description="Family background and family information."
    open={activeSection === "family"}
    onToggle={() => toggleSection("family")}
  >
    <FamilyDetails
      mode="edit"
      profileData={profileData}
      formData={formData}
      setFormData={setFormData}
      fatherProfessionInput={fatherProfessionInput}
      setFatherProfessionInput={setFatherProfessionInput}
      motherProfessionInput={motherProfessionInput}
      setMotherProfessionInput={setMotherProfessionInput}
      professionOptions={professionOptions}
      professionLoading={professionLoading}
      setProfessionOptions={setProfessionOptions}
      searchProfessions={searchProfessions}
    />
  </CollapsibleSection>

  <CollapsibleSection
    number={5}
    title="Horoscope & Cultural Details"
    description="Gotra, Rashi, Nakshatra and related information."
    open={activeSection === "horoscope"}
    onToggle={() => toggleSection("horoscope")}
  >
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
  </CollapsibleSection>

  <CollapsibleSection
    number={6}
    title="References"
    description="Reference contact information."
    open={activeSection === "references"}
    onToggle={() => toggleSection("references")}
  >
    <ReferencesSection
      mode="edit"
      profileData={profileData}
      formData={formData}
      setFormData={setFormData}
    />
        </CollapsibleSection>
    </div>

    <div className="flex flex-col justify-center gap-3 pt-6 sm:flex-row">
      <button
        type="button"
        className="rounded-lg bg-[#002B55] px-6 py-2.5 font-semibold text-white transition hover:bg-[#001f3d] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        className="rounded-lg border border-[#002B55] bg-white px-6 py-2.5 font-semibold text-[#002B55] transition hover:bg-gray-50"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </div>
  </div>
);
};

export default EditModeProfile;
