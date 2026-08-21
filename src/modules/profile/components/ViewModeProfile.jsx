
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CollapsibleSection from "../../../shared/components/CollapsibleSection";

import BasicProfile from "./sections/BasicProfile";
import AddressDetails from "./sections/AddressDetails";
import EducationJobDetails from "./sections/EducationJobDetails";
import FamilyDetails from "./sections/FamilyDetails";
import HoroscopeDetails from "./sections/HoroscopeDetails";
import ReferencesSection from "./sections/ReferencesSection";

const ViewModeProfile = ({
  profileData,
  formatDisplayValue,
  cmToFeetInches,
  setIsEditing
}) => {
  const [activeSection, setActiveSection] = useState("basic");

  const toggleSection = (sectionId) => {
    setActiveSection((current) =>
      current === sectionId ? null : sectionId
    );
  };
  
  const navigate = useNavigate();

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
    <BasicProfile profileData={profileData} />
  </CollapsibleSection>

  <CollapsibleSection
    number={2}
    title="Contact & Address"
    description="Contact, native place and address information."
    open={activeSection === "address"}
    onToggle={() => toggleSection("address")}
  >
    <AddressDetails profileData={profileData} />
  </CollapsibleSection>

  <CollapsibleSection
    number={3}
    title="Education & Career"
    description="Education, profession and employment details."
    open={activeSection === "career"}
    onToggle={() => toggleSection("career")}
  >
    <EducationJobDetails profileData={profileData} />
  </CollapsibleSection>

  <CollapsibleSection
    number={4}
    title="Family Details"
    description="Family background and family information."
    open={activeSection === "family"}
    onToggle={() => toggleSection("family")}
  >
    <FamilyDetails profileData={profileData} />
  </CollapsibleSection>

  <CollapsibleSection
    number={5}
    title="Horoscope & Cultural Details"
    description="Gotra, Rashi, Nakshatra and related information."
    open={activeSection === "horoscope"}
    onToggle={() => toggleSection("horoscope")}
  >
    <HoroscopeDetails profileData={profileData} />
  </CollapsibleSection>

  <CollapsibleSection
    number={6}
    title="References"
    description="Reference contact information."
    open={activeSection === "references"}
    onToggle={() => toggleSection("references")}
  >
    <ReferencesSection profileData={profileData} />
  </CollapsibleSection>
</div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-center gap-3 pt-6 sm:flex-row">
  <button
    type="button"
    className="rounded-lg bg-[#002B55] px-6 py-2.5 font-semibold text-white transition hover:bg-[#001f3d]"
    onClick={() => setIsEditing(true)}
  >
    Ã¢Å“ÂÃ¯Â¸Â Edit Your Profile
  </button>

  <button
    type="button"
    className="rounded-lg border border-[#002B55] bg-white px-6 py-2.5 font-semibold text-[#002B55] transition hover:bg-gray-50"
    onClick={() => navigate("/dashboard")}
  >
     Ã¢ÂÅ’ Back to Dashboard
  </button>
</div>
    </div>
  );
};

export default ViewModeProfile;

