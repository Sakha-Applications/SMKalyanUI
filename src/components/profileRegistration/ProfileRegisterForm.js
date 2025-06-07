// src/components/profileRegistration/ProfileRegisterForm.js
// This is the main component for the /profile-register route.
// It uses your useFormData hook and orchestrates the ProfileRegistration component.

import React, { useEffect } from 'react';
// Assuming useFormData is in src/hooks/useFormData.js
import useFormData from '../../hooks/useFormData'; // Adjust path as per your project structure
import ProfileRegistration from './ProfileRegistration'; // Adjust path

// Mock utility functions - replace with your actual implementations or remove if not needed directly here
// Ensure axios and getBaseUrl are configured for useApiData and any direct calls in popups.
// For this example, we'll assume they are globally available or handled by your setup.
if (!window.getBaseUrl) {
    window.getBaseUrl = () => 'https://api.example.com'; // Mock
}
if (!window.axios) {
    window.axios = { // Mock
        get: async (url) => {
            console.log(`Mock Global Axios GET request to: ${url}`);
             if (url.includes('/native-places') || url.includes('/mother-tongues') || url.includes('/guru-matha') || url.includes('/cities')) {
                if (url.includes('search=')) {
                    const query = url.split('search=')[1].toLowerCase();
                    if (query.startsWith('ka')) {
                    if (url.includes('/native-places') || url.includes('/cities')) return { data: [{ id: '1', name: 'Karkala' }, { id: '2', name: 'Kasargod' }] };
                    if (url.includes('/mother-tongues')) return { data: [{ id: '1', name: 'Kannada' }, { id: '2', name: 'Kashmiri' }] };
                    if (url.includes('/guru-matha')) return { data: [{ id: '1', name: 'Kashi Matha' }] };
                    }
                    if (query.startsWith('ud')) {
                        if(url.includes('/guru-matha')) return { data: [{id: '2', name: 'Udupi Matha'}]};
                        if(url.includes('/native-places') || url.includes('/cities')) return { data: [{id: '3', name: 'Udupi'}]};
                    }
                }
                 return { data: [] };
            }
            return { data: [] };
        }
    };
}


export default function ProfileRegisterForm() {
  const {
    formData,
    setFormData,
    handleChange,
    handleDOBChange,
    handleTimeBlur
  } = useFormData();

  // Effect to derive profileFor from gender, if not already handled in useFormData
  useEffect(() => {
    if (formData.gender) {
      let newProfileFor = '';
      if (formData.gender === "Male") {
        newProfileFor = "Bridegroom";
      } else if (formData.gender === "Female") {
        newProfileFor = "Bride";
      }
      // Only update if different to avoid infinite loops if setFormData is a dependency
      if (formData.profileFor !== newProfileFor) {
        setFormData(prevData => ({
          ...prevData,
          profileFor: newProfileFor,
        }));
      }
    }
  }, [formData.gender, formData.profileFor, setFormData]);

  // Effect to combine height, if not already handled in useFormData
   useEffect(() => {
    const { heightFeet, heightInches } = formData;
    let newHeight = '';
    if (heightFeet && heightInches) {
      newHeight = `${heightFeet}'${heightInches}"`;
    }
    if (formData.height !== newHeight) {
        setFormData(prev => ({ ...prev, height: newHeight }));
    }
  }, [formData.heightFeet, formData.heightInches, formData.height, setFormData]);


  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-700 min-h-screen flex items-center justify-center py-8 px-4 font-sans">
      <ProfileRegistration
        formData={formData}
        handleChange={handleChange}
        handleDOBChange={handleDOBChange}
        handleTimeBlur={handleTimeBlur}
        setFormData={setFormData} // Pass setFormData for popups that might need more direct updates
      />
    </div>
  );
}
