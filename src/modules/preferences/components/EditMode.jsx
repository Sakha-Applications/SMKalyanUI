import React, { useState } from "react";

import BasicPreferences from "./sections/BasicPreferences";
import CulturalPreferences from "./sections/CulturalPreferences";
import GeographicPreferences from "./sections/GeographicPreferences";

import CollapsibleSection from "../../../shared/components/CollapsibleSection";


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
  dietOptions
}) => {


  const [activeSection, setActiveSection] = useState("basic");

  const toggleSection = (sectionId) => {
    setActiveSection((current) =>
      current === sectionId ? null : sectionId
    );
  };

  return (
    <div className="space-y-8">
      <CollapsibleSection
        number={1}
        title="Basic Expectations"
        description="Age, height, income, marital status, category and education preferences."
        open={activeSection === "basic"}
        onToggle={() => toggleSection("basic")}
      >
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
      </CollapsibleSection>

      <CollapsibleSection
        number={2}
        title="Cultural & Spiritual Expectations"
        description="Sub caste, Guru Matha, Gotra, Nakshatra and Rashi preferences."
        open={activeSection === "cultural"}
        onToggle={() => toggleSection("cultural")}
      >
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
      </CollapsibleSection>

      <CollapsibleSection
        number={3}
        title="Geographic & Lifestyle Expectations"
        description="Country, native origin, location, profession, diet and hobby preferences."
        open={activeSection === "geographic"}
        onToggle={() => toggleSection("geographic")}
      >
        <GeographicPreferences
          mode="edit"
          profileData={profileData}
          formData={formData}
          setFormData={setFormData}
          editModeActive={editModeActive}
          professionOptions={professionOptions}
          professionInput={professionInput}
          setProfessionInput={setProfessionInput}
          professionLoading={professionLoading}
          dietOptions={dietOptions}
        />
      </CollapsibleSection>
      <div className="flex flex-col justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row">
        <button
          type="button"
          className="rounded-lg border border-[#00264D] bg-white px-6 py-2.5 font-semibold text-[#00264D] transition hover:bg-gray-50"
          onClick={() => setIsEditing(false)}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-lg bg-[#00264D] px-6 py-2.5 font-semibold text-white transition hover:bg-[#001D3D] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Expectations"}
        </button>
      </div>
    </div>
  );
};

export default EditMode;
