// components/ModifyProfile/PartnerPreferences/sections/BirthAndAstro.jsx
import React, { useEffect } from "react";

const DataRow = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-700 mb-1">{label}</h4>
    <p className="text-gray-600">{value || '-'}</p>
  </div>
);

// ✅ Logging moved into useEffect to avoid flooding
const BirthAndAstro = ({ profileData, mode }) => {
  useEffect(() => {
    console.log("🧪 BirthAndAstro ENTRY - mode:", mode);
    console.log("🧪 BirthAndAstro - profileData:", profileData);
    console.log("🧪 BirthAndAstro - profileData keys:", Object.keys(profileData || {}));
    console.log("🧪 BirthAndAstro - Specific values:", {
      dob: profileData?.dob,
      time_of_birth: profileData?.time_of_birth,
      timeOfBirth: profileData?.timeOfBirth,
      current_age: profileData?.current_age,
      sub_caste: profileData?.sub_caste,
      place_of_birth: profileData?.place_of_birth
    });
    console.log("🧪 BIRTH ASTRO CHECK:", {
      dob: profileData?.dob,
      gotra: profileData?.gotra,
      nakshatra: profileData?.nakshatra,
      rashi: profileData?.rashi
    });
  }, [profileData, mode]);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
        Birth Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataRow label="Date of Birth" value={profileData?.dob ? profileData.dob.split('T')[0] : '-'} />
        <DataRow label="Time of Birth" value={profileData?.time_of_birth || profileData?.timeOfBirth} />
        <DataRow label="Current Age" value={profileData?.current_age} />
        <DataRow label="Place of Birth" value={profileData?.place_of_birth} />
        <DataRow label="Place of Birth State" value={profileData?.place_of_birth_state} />
        <DataRow label="Place of Birth Country" value={profileData?.place_of_birth_country} />
      </div>
    </section>
  );
};

export default BirthAndAstro;
