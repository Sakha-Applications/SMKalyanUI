// components/ModifyProfile/PartnerPreferences/ViewModeProfile.jsx

import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import BasicProfile from './sections/BasicProfile';
import BirthAndAstro from './sections/BirthAndAstro';
import EducationJobDetails from './sections/EducationJobDetails';

// ✅ Newly added section imports
import ContactDetails from './sections/ContactDetails';
import FamilyDetails from './sections/FamilyDetails';
import HoroscopeDetails from './sections/HoroscopeDetails';
import AddressDetails from './sections/AddressDetails';
import ReferencesSection from './sections/ReferencesSection';

const DataRow = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-700 mb-1">{label}</h4>
    <p className="text-gray-600">{value || '-'}</p>
  </div>
);

const SectionBox = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const ViewModeProfile = ({ profileData, formatDisplayValue, cmToFeetInches, setIsEditing }) => {
  useEffect(() => {
    console.log("👀 ViewMode - profileData:", profileData);
  }, [profileData]); // ✅ Only logs when profileData actually changes

  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Basic Profile Section */}
      <BasicProfile profileData={profileData} />

      {/* ✅ Modular: Address Info Section */}
      <AddressDetails profileData={profileData} />

      {/* Education & Work Section */}
      <EducationJobDetails profileData={profileData} />
      
      {/* ✅ Modular: Family Info Section */}
      <FamilyDetails profileData={profileData} />


      {/* ✅ Modular: Horoscope Info Section */}
      <HoroscopeDetails profileData={profileData} />


      {/* ✅ Modular: References Section */}
      <ReferencesSection profileData={profileData} />

      {/* Action Buttons */}
      <div className="flex justify-center pt-6 gap-8">
        <button
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => setIsEditing(true)}
        >
          ✏️ Edit Preferences
        </button>

        <button
          className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => navigate('/dashboard')}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default ViewModeProfile;
