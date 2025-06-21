import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';
import useApiData from '../../hooks/useApiData';
import ViewMode from './PartnerPreferences/ViewMode';
import EditMode from './PartnerPreferences/EditMode';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import {
  maritalStatusOptions,
  brideGroomCategoryOptions,
  subCasteOptions,
  hobbyOptions,
  dietOptions
} from './PartnerPreferences/constants/options';
import { Country, State } from 'country-state-city';
const PartnerPreferencesPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [educationInput, setEducationInput] = useState('');
  const [motherTongueInput, setMotherTongueInput] = useState('');
  const [guruMathaInput, setGuruMathaInput] = useState('');
  const [professionInput, setProfessionInput] = useState('');

  const [educationOptions, setEducationOptions] = useState([]);
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([]);

  const [educationLoading, setEducationLoading] = useState(false);
  const [motherTongueLoading, setMotherTongueLoading] = useState(false);
  const [guruMathaLoading, setGuruMathaLoading] = useState(false);
  const [professionLoading, setProfessionLoading] = useState(false);

  const {
    gotraOptions = [],
    nakshatraOptions = [],
    rashiOptions = [],
    searchEducation,
    searchMotherTongues,
    searchGuruMatha,
    searchProfessions,
    manglikOptions = [],
  } = useApiData() || {};

  const token = sessionStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/api/modifyProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Raw API response:", response.data);

      if (response.data) {
        const enriched = {
          ...response.data,
          profileId: sessionStorage.getItem("profileId") || response.data.profileId || response.data.profile_id,
          userId: userEmail,
          name: sessionStorage.getItem("name") || response.data.name,
        };
console.log("✅ Enriched profileData:", enriched);
        console.log("✅ Enriched profileData:", enriched);
        setProfileData(enriched);
        setFormData({
          ...enriched,
  
  // Basic preferences
  expectations: enriched.expectations || '',
  ageRange: enriched.age_range?.split(',').map(Number) || [25, 35],
  heightRange: enriched.height_range?.split(',').map(Number) || [150, 180],
  preferredIncomeRange: enriched.preferred_income_range?.split(',').map(Number) || [5, 20],
  preferredMaritalStatus: enriched.preferred_marital_status || '',
  preferredBrideGroomCategory: enriched.preferred_bride_groom_category || '',
  
  // Multi-select fields - convert strings to arrays
  preferredEducation: enriched.preferred_education ? 
    (typeof enriched.preferred_education === 'string' ? 
      enriched.preferred_education.split(',').map(item => item.trim()) : 
      enriched.preferred_education) : [],
      
  preferredSubCastes: enriched.preferred_sub_castes ? 
    (typeof enriched.preferred_sub_castes === 'string' ? 
      enriched.preferred_sub_castes.split(',').map(item => item.trim()) : 
      enriched.preferred_sub_castes) : [],
      
  // Apply same pattern to all other multi-select fields
  preferredGuruMathas: enriched.preferred_guru_mathas ? 
    (typeof enriched.preferred_guru_mathas === 'string' ? 
      enriched.preferred_guru_mathas.split(',').map(item => item.trim()) : 
      enriched.preferred_guru_mathas) : [],
      
  // Continue for all other fields...
});
  
   
        console.log("✅ Initialized formData:");
      } else {
        setError("Failed to fetch profile data.");
      }
    } catch {
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (educationInput.length >= 2) {
        setEducationLoading(true);
        try {
          const results = await searchEducation(educationInput);
          setEducationOptions(results.map(item => ({
            label: item.label || item.name || item,
            value: item.label || item.name || item
          })));
        } catch {
          setEducationOptions([]);
        } finally {
          setEducationLoading(false);
        }
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [educationInput]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (motherTongueInput.length >= 2) {
        setMotherTongueLoading(true);
        try {
          const results = await searchMotherTongues(motherTongueInput);
          setMotherTongueOptions(results.map(item => ({
            label: item.mother_tongue || item.label || item,
            value: item.mother_tongue || item.label || item
          })));
        } catch {
          setMotherTongueOptions([]);
        } finally {
          setMotherTongueLoading(false);
        }
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [motherTongueInput]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (guruMathaInput.length >= 2) {
        setGuruMathaLoading(true);
        try {
          const results = await searchGuruMatha(guruMathaInput);
          setGuruMathaOptions(results.map(item => ({
            label: item.label || item,
            value: item.label || item
          })));
        } catch {
          setGuruMathaOptions([]);
        } finally {
          setGuruMathaLoading(false);
        }
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [guruMathaInput]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (professionInput.length >= 2) {
        setProfessionLoading(true);
        try {
          const results = await searchProfessions(professionInput);
          setProfessionOptions(results.map(item => ({
            label: item.label || item,
            value: item.label || item
          })));
        } catch {
          setProfessionOptions([]);
        } finally {
          setProfessionLoading(false);
        }
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [professionInput]);

const handleUpdate = async () => {
  setLoading(true);

  // 🧹 Enhanced utility to sanitize values - handles all data types
  const sanitize = (value) => {
    // Handle null, undefined, or empty values
    if (!value) return [];
    
    // If it's already a string, return as single-item array
    if (typeof value === 'string') {
      return value.trim() ? [value.trim()] : [];
    }
    
    // If it's not an array, convert to array first
    if (!Array.isArray(value)) {
      return [value];
    }
    
    // Process array items
    return value.map(item => {
      // Handle null/undefined items
      if (!item) return null;
      
      // Handle plain strings
      if (typeof item === 'string') {
        return item.trim();
      }
      
      // Handle location objects (Native Origins, Preferred Cities, City Living In, etc.)
      if (typeof item === 'object' && item !== null) {
        // Check for location format: {country, state, city}
        if ('country' in item && 'state' in item && 'city' in item) {
  const countryName = Country.getCountryByCode(item.country)?.name || item.country;
  const stateName = State.getStateByCodeAndCountry(item.state, item.country)?.name || item.state;
  const cityName = item.city || '';

  return `${countryName} / ${stateName} / ${cityName}`.trim();
}
        
        // Check for dropdown format: {label, value} or {value, label}
        if ('label' in item || 'value' in item) {
          return item.label || item.value || '';
        }
        
        // Handle other object formats (like profession objects)
        if ('name' in item) {
          return item.name;
        }
        
        // If object has a toString method or can be stringified
        if (item.toString && typeof item.toString === 'function') {
          const stringValue = item.toString();
          if (stringValue !== '[object Object]') {
            return stringValue;
          }
        }
      }
      
      // Fallback: convert to string
      return String(item);
    }).filter(item => item && item !== ''); // Remove empty/null items
  };

  // 🧹 Special function for single values (not arrays)
  const sanitizeSingle = (value) => {
    if (!value) return '';
    
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object' && value !== null) {
      // Handle location objects
      if ('country' in value && 'state' in value && 'city' in value) {
        const country = value.country || '';
        const state = value.state || '';
        const city = value.city || '';
        return `${country}/${state}/${city}`.replace(/\/+$/, '');
      }
      
      // Handle dropdown objects
      if ('label' in value || 'value' in value) {
        return value.label || value.value || '';
      }
      
      if ('name' in value) {
        return value.name;
      }
    }
    
    return String(value);
  };

  // ✅ Convert DOB to YYYY-MM-DD format
  if (formData.dob && typeof formData.dob === 'string') {
    formData.dob = formData.dob.split('T')[0];
  }

  try {
    // 🧼 Destructure to exclude camelCase keys
    const {
      profileId,
      userId,
      ageRange,
      heightRange,
      preferredIncomeRange,
      preferredEducation,
      preferredSubCastes,
      preferredGuruMathas,
      preferredGotras,
      preferredNakshatras,
      preferredRashis,
      preferredCountries,
      preferredNativeOrigins,
      preferredCities,
      preferredProfessions,
      preferredHobbies,
      preferredMaritalStatus,
      preferredBrideGroomCategory,
      // Add these fields that might be missing
      cityLivingIn,
      countryLivingIn,
      nativeOrigins,
      gotra,
      nakshatra,
      rashi,
      ...rest
    } = formData;

    // ✅ Build final payload in backend-friendly format
  const finalPayload = {
  ...rest,
  profile_id: profileId,
  user_id: userId,
  age_range: (ageRange || []).join(','),
  height_range: (heightRange || []).join(','),
  preferred_income_range: (preferredIncomeRange || []).join(','),
  preferred_marital_status: preferredMaritalStatus || profileData.preferred_marital_status || '',
  preferred_bride_groom_category: preferredBrideGroomCategory || profileData.preferred_bride_groom_category || '',

  // ✅ Array fields with fallback to profileData split
  preferred_education: sanitize(preferredEducation || profileData.preferred_education?.split(',')).join(','),
  preferred_sub_castes: sanitize(preferredSubCastes || profileData.preferred_sub_castes?.split(',')).join(','),
  preferred_guru_mathas: sanitize(preferredGuruMathas || profileData.preferred_guru_mathas?.split(',')).join(','),
  preferred_gotras: sanitize(preferredGotras || profileData.preferred_gotras?.split(',')).join(','),
  preferred_nakshatras: sanitize(preferredNakshatras || profileData.preferred_nakshatras?.split(',')).join(','),
  preferred_rashis: sanitize(preferredRashis || profileData.preferred_rashis?.split(',')).join(','),
  preferred_professions: sanitize(preferredProfessions || profileData.preferred_professions?.split(',')).join(','),
  preferred_hobbies: sanitize(preferredHobbies || profileData.preferred_hobbies?.split(',')).join(','),
  preferred_countries: sanitize(preferredCountries || profileData.preferred_countries?.split(',')).join(','),
  preferred_native_origins: sanitize(preferredNativeOrigins || profileData.preferred_native_origins?.split(',')).join(','),
  preferred_cities: sanitize(preferredCities || profileData.preferred_cities?.split(',')).join(','),

  // ✅ Single-value fields with fallback
  city_living_in: sanitizeSingle(cityLivingIn || profileData.city_living_in),
  country_living_in: sanitizeSingle(countryLivingIn || profileData.country_living_in),
  native_origins: sanitizeSingle(nativeOrigins || profileData.native_origins),
  gotra: sanitizeSingle(gotra || profileData.gotra),
  nakshatra: sanitizeSingle(nakshatra || profileData.nakshatra),
  rashi: sanitizeSingle(rashi || profileData.rashi),
};


    // 🐛 Debug logging
    console.log("🔍 Form data before sanitization:", {
      cityLivingIn,
      countryLivingIn,
      nativeOrigins,
      gotra,
      nakshatra,
      rashi
    });
    
    console.log("✅ Sending finalPayload:", JSON.stringify(finalPayload, null, 2));

    await axios.put(`${getBaseUrl()}/api/modifyProfile`, finalPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('Preferences updated successfully.');
    setIsEditing(false);
    fetchUserProfile();
  } catch (error) {
    console.error("❌ Error updating preferences:", error);
    console.error("❌ Error response:", error.response?.data);
    alert('Failed to update preferences.');
  } finally {
    setLoading(false);
  }
};

  if (!token || !userEmail) {
    return <div className="p-6 text-center text-yellow-800 bg-yellow-100 rounded-lg mt-8 max-w-2xl mx-auto">Please log in to view your preferences.</div>;
  }

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!profileData) return <div className="text-center text-gray-500 mt-10">No profile data found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold">Partner Preferences</h1>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><strong>Profile ID:</strong> {profileData.profile_id || profileData.profileId}</div>
            <div><strong>Name:</strong> {profileData.name}</div>
            <div><strong>User ID:</strong> {profileData.userId}</div>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <EditMode
              profileData={profileData}
              formData={formData}
              setFormData={setFormData}
              handleUpdate={handleUpdate}
              setIsEditing={setIsEditing}
              loading={loading}
              educationOptions={educationOptions}
              educationInput={educationInput}
              setEducationInput={setEducationInput}
              educationLoading={educationLoading}
              motherTongueOptions={motherTongueOptions}
              motherTongueInput={motherTongueInput}
              setMotherTongueInput={setMotherTongueInput}
              motherTongueLoading={motherTongueLoading}
              guruMathaOptions={guruMathaOptions}
              guruMathaInput={guruMathaInput}
              setGuruMathaInput={setGuruMathaInput}
              guruMathaLoading={guruMathaLoading}
              gotraOptions={gotraOptions}
              nakshatraOptions={nakshatraOptions}
              rashiOptions={rashiOptions}
              manglikOptions={manglikOptions}
              subCasteOptions={subCasteOptions}
              maritalStatusOptions={maritalStatusOptions}
              brideGroomCategoryOptions={brideGroomCategoryOptions}
              professionOptions={professionOptions}
              professionInput={professionInput}
              setProfessionInput={setProfessionInput}
              professionLoading={professionLoading}
              hobbyOptions={hobbyOptions}
              dietOptions={dietOptions}
              editModeActive={isEditing}
            />
          ) : (
            <ViewMode
              profileData={profileData}
              formatDisplayValue={(v) => Array.isArray(v) ? v.join(', ') : v || '-'}
              cmToFeetInches={(cm) => {
                const inches = Math.round(cm / 2.54);
                const feet = Math.floor(inches / 12);
                const remainder = inches % 12;
                return `${feet}ft ${remainder}in`;
              }}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>

      {showErrorDialog && (
        <ValidationErrorDialog errors={errors} onClose={() => setShowErrorDialog(false)} />
      )}
    </div>
  );
};

export default PartnerPreferencesPage;
