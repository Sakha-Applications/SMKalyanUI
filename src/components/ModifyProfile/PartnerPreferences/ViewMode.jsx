// components/ModifyProfile/PartnerPreferences/ViewMode.jsx
import React from "react";
import BasicPreferences from './sections/BasicPreferences';
import CulturalPreferences from './sections/CulturalPreferences';
import GeographicPreferences from './sections/GeographicPreferences';
import { RadioGroup } from '../../common/FormElements';
import { useNavigate } from 'react-router-dom'; // at the top of your file

const SectionBox = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const DataRow = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-700 mb-1">{label}</h4>
    <p className="text-gray-600">{value}</p>
  </div>
);

const ViewMode = ({ profileData, formatDisplayValue, cmToFeetInches, setIsEditing }) => {
console.log("👀 ViewMode - profileData:", profileData);  
const navigate = useNavigate(); // inside your ViewMode component
  const heightRange = profileData.height_range?.split(',').map(h => cmToFeetInches(parseInt(h.trim()))).join(' - ');
console.log("👀 ViewMode - profileData:", profileData);
console.log("👀 ViewMode - profileData fields:");
  return (
    <div className="space-y-8">
  
<BasicPreferences
  mode="view"
  profileData={profileData}
/>
  
<CulturalPreferences
  mode="view"
  profileData={profileData}
/>

  
<GeographicPreferences
  mode="view"
  profileData={profileData}
/>


      <div className="flex justify-center pt-6 gap-8">
        <button
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => setIsEditing(true)}
        >
          ✏️ Edit Preferences
        </button>
      
      <div className="flex justify-center pt-6 gap-8">
        </div><button
    className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
    onClick={() => navigate('/dashboard')} // or your actual route
  >
    ❌ Cancel
  </button>  
      </div>
    </div>
  );
};

export default ViewMode;
