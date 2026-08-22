import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import BasicPreferences from "./sections/BasicPreferences";
import CulturalPreferences from "./sections/CulturalPreferences";
import GeographicPreferences from "./sections/GeographicPreferences";

import CollapsibleSection from "../../../shared/components/CollapsibleSection";

import {
  designClasses,
} from "../../../shared/styles/designTokens";

const ViewMode = ({ profileData, setIsEditing }) => {
  const navigate = useNavigate();
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
          mode="view"
          profileData={profileData}
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
          mode="view"
          profileData={profileData}
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
          mode="view"
          profileData={profileData}
        />
      </CollapsibleSection>


      <div className="flex flex-col justify-end gap-3 pt-6 sm:flex-row">
        <button
          type="button"
          className={`rounded-lg px-6 py-2.5 font-semibold transition ${designClasses.secondaryButton}`}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

        <button
          type="button"
          className={`rounded-lg px-6 py-2.5 font-semibold transition ${designClasses.primaryButton}`}
          onClick={() => setIsEditing(true)}
        >
          Edit Expectations
        </button>
      </div>
    </div>
  );
};

export default ViewMode;
