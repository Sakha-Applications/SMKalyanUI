import React, { useEffect, useState } from 'react';
import useApiData from "../../hooks/useApiData";
import profileService from "../../services/profileService";

import ViewMode from "./components/ViewMode";
import EditMode from "./components/EditMode";

import ValidationErrorDialog from "../../components/common/ValidationErrorDialog";
import MemberLayout from "../../shared/layouts/MemberLayout";
import NotificationBanner from "../../shared/components/NotificationBanner";
import { designClasses } from "../../shared/styles/designTokens";
import {
  maritalStatusOptions,
  brideGroomCategoryOptions,
  subCasteOptions,
  dietOptions,
} from "../../shared/config/profileOptions";
import { Country, State } from 'country-state-city';

import {
  preferredAgeRangeConfig,
  preferredHeightRangeConfig,
  preferredIncomeRangeConfig,
} from "../../shared/config/profileOptions";

const parseStoredRange = (
  value,
  defaultValue
) => {
  const defaults = Array.isArray(defaultValue)
    ? [...defaultValue]
    : [];

  if (
    Array.isArray(value) &&
    value.length >= 2
  ) {
    const parsed = value
      .slice(0, 2)
      .map(Number);

    if (
      parsed.every(Number.isFinite)
    ) {
      return parsed;
    }
  }

  if (
    typeof value === "string"
  ) {
    const parsed = value
      .split(",")
      .map((item) =>
        Number(item.trim())
      )
      .filter(Number.isFinite);

    if (parsed.length >= 2) {
      return parsed.slice(0, 2);
    }

    if (
      parsed.length === 1 &&
      defaults.length === 2
    ) {
      return [
        parsed[0],
        defaults[1],
      ];
    }
  }

  return defaults;
};

const PartnerPreferencesPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

    const [
    notification,
    setNotification,
  ] = useState({
    message: "",
    type: "success",
  });

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

  const userEmail =
  sessionStorage.getItem("userEmail");

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const data =
  await profileService.getMyProfile();

if (data) {
  const enriched = {
    ...data,
    profileId:
      sessionStorage.getItem("profileId") ||
      data.profileId ||
      data.profile_id,
    userId: userEmail,
    name:
      sessionStorage.getItem("name") ||
      data.name,
  };

        setProfileData(enriched);
        setFormData({
          ...enriched,
  
  // Basic preferences
  expectations: enriched.expectations || '',
  ageRange: parseStoredRange(
    enriched.age_range,
    preferredAgeRangeConfig.defaultValue
  ),

  heightRange: parseStoredRange(
    enriched.height_range,
    preferredHeightRangeConfig.defaultValue
  ),

  preferredIncomeRange: parseStoredRange(
    enriched.preferred_income_range,
    preferredIncomeRangeConfig.defaultValue
  ),
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
  preferredDiet: enriched.preferred_diet
  ? (
      typeof enriched.preferred_diet === "string"
        ? enriched.preferred_diet.split(",").map((item) => item.trim())
        : enriched.preferred_diet
    )
  : [],
});

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

  // Load the member profile once when this page opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (educationInput.length < 2) {
      setEducationOptions([]);
      setEducationLoading(false);
      return undefined;
    }

    const delay = setTimeout(async () => {
      setEducationLoading(true);

      try {
        const results =
          await searchEducation(
            educationInput
          );

        setEducationOptions(
          (results || []).map((item) => ({
            label:
              item.label ||
              item.name ||
              item,
            value:
              item.label ||
              item.name ||
              item,
          }))
        );
      } catch {
        setEducationOptions([]);
      } finally {
        setEducationLoading(false);
      }
    }, 300);

    return () =>
      clearTimeout(delay);

    // Search function comes from useApiData;
    // rerun only when the typed value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educationInput]);

  useEffect(() => {
    if (
      motherTongueInput.length < 2
    ) {
      setMotherTongueOptions([]);
      setMotherTongueLoading(false);
      return undefined;
    }

    const delay = setTimeout(async () => {
      setMotherTongueLoading(true);

      try {
        const results =
          await searchMotherTongues(
            motherTongueInput
          );

        setMotherTongueOptions(
          (results || []).map((item) => ({
            label:
              item.mother_tongue ||
              item.label ||
              item,
            value:
              item.mother_tongue ||
              item.label ||
              item,
          }))
        );
      } catch {
        setMotherTongueOptions([]);
      } finally {
        setMotherTongueLoading(false);
      }
    }, 300);

    return () =>
      clearTimeout(delay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motherTongueInput]);

  useEffect(() => {
    if (guruMathaInput.length < 2) {
      setGuruMathaOptions([]);
      setGuruMathaLoading(false);
      return undefined;
    }

    const delay = setTimeout(async () => {
      setGuruMathaLoading(true);

      try {
        const results =
          await searchGuruMatha(
            guruMathaInput
          );

        setGuruMathaOptions(
          (results || []).map((item) => ({
            label:
              item.label || item,
            value:
              item.label || item,
          }))
        );
      } catch {
        setGuruMathaOptions([]);
      } finally {
        setGuruMathaLoading(false);
      }
    }, 300);

    return () =>
      clearTimeout(delay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guruMathaInput]);

  useEffect(() => {
    if (professionInput.length < 2) {
      setProfessionOptions([]);
      setProfessionLoading(false);
      return undefined;
    }

    const delay = setTimeout(async () => {
      setProfessionLoading(true);

      try {
        const results =
          await searchProfessions(
            professionInput
          );

        setProfessionOptions(
          (results || []).map((item) => ({
            label:
              item.label || item,
            value:
              item.label || item,
          }))
        );
      } catch {
        setProfessionOptions([]);
      } finally {
        setProfessionLoading(false);
      }
    }, 300);

    return () =>
      clearTimeout(delay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionInput]);

const handleUpdate = async () => {
  setLoading(true);

  // Sanitize values across supported data types.
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

  // Sanitize single-value fields.
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

  // Convert DOB to YYYY-MM-DD format.
  if (formData.dob && typeof formData.dob === 'string') {
    formData.dob = formData.dob.split('T')[0];
  }

  try {
    // Exclude camelCase keys from the backend payload.
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
preferredDiet,
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

    // Build the final backend-compatible payload.
  const finalPayload = {
  ...rest,
  profile_id: profileId,
  user_id: userId,
  age_range: (ageRange || []).join(','),
  height_range: (heightRange || []).join(','),
  preferred_income_range: (preferredIncomeRange || []).join(','),
  preferred_marital_status: preferredMaritalStatus || profileData.preferred_marital_status || '',
  preferred_bride_groom_category: preferredBrideGroomCategory || profileData.preferred_bride_groom_category || '',

  // Array fields with fallback to existing profile data.
  preferred_education: sanitize(preferredEducation || profileData.preferred_education?.split(',')).join(','),
  preferred_sub_castes: sanitize(preferredSubCastes || profileData.preferred_sub_castes?.split(',')).join(','),
  preferred_guru_mathas: sanitize(preferredGuruMathas || profileData.preferred_guru_mathas?.split(',')).join(','),
  preferred_gotras: sanitize(preferredGotras || profileData.preferred_gotras?.split(',')).join(','),
  preferred_nakshatras: sanitize(preferredNakshatras || profileData.preferred_nakshatras?.split(',')).join(','),
  preferred_rashis: sanitize(preferredRashis || profileData.preferred_rashis?.split(',')).join(','),
  preferred_professions: sanitize(preferredProfessions || profileData.preferred_professions?.split(',')).join(','),
  preferred_hobbies: sanitize(preferredHobbies || profileData.preferred_hobbies?.split(',')).join(','),
  preferred_diet: sanitize(
  preferredDiet || profileData.preferred_diet?.split(",")
).join(","),
  preferred_countries: sanitize(preferredCountries || profileData.preferred_countries?.split(',')).join(','),
  preferred_native_origins: sanitize(preferredNativeOrigins || profileData.preferred_native_origins?.split(',')).join(','),
  preferred_cities: sanitize(preferredCities || profileData.preferred_cities?.split(',')).join(','),

  // Single-value fields with fallback to existing profile data.
  city_living_in: sanitizeSingle(cityLivingIn || profileData.city_living_in),
  country_living_in: sanitizeSingle(countryLivingIn || profileData.country_living_in),
  native_origins: sanitizeSingle(nativeOrigins || profileData.native_origins),
  gotra: sanitizeSingle(gotra || profileData.gotra),
  nakshatra: sanitizeSingle(nakshatra || profileData.nakshatra),
  rashi: sanitizeSingle(rashi || profileData.rashi),
};

    await profileService.updateMyProfile(
  finalPayload
);

    setNotification({
      message:
        "Partner expectations updated successfully.",
      type:
        "success",
    });

    setIsEditing(false);

    await fetchUserProfile();
  } catch (error) {
  console.error(
    "Unable to update partner expectations:",
    error
  );

  setNotification({
    message:
      error?.response?.data
        ?.message ||
      "Failed to update partner expectations.",
    type:
      "error",
  });
  } finally {
    setLoading(false);
  }
};
if (!userEmail) {
  return (
    <div className="p-6 text-center text-yellow-800 bg-yellow-100 rounded-lg mt-8 max-w-2xl mx-auto">
      Please log in to view your preferences.
    </div>
  );
}

  if (loading) {
  return (
    <div
      className={`mt-10 text-center ${designClasses.textSecondary}`}
    >
      Loading...
    </div>
  );
}
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!profileData) {
  return (
    <div
      className={`mt-10 text-center ${designClasses.textSecondary}`}
    >
      No profile data found.
    </div>
  );
}

  return (
    <MemberLayout>
      <div className="w-full space-y-4">
        <NotificationBanner
          message={
            notification.message
          }
          type={
            notification.type
          }
          onClose={() =>
            setNotification({
              message: "",
              type: "success",
            })
          }
        />
        <div
          className={`overflow-hidden rounded-2xl border ${designClasses.border} ${designClasses.surface}`}
        >
          <div className={`border-b p-5 sm:p-6 ${designClasses.border}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1
                  className={`text-2xl font-bold ${designClasses.textPrimary}`}
                >
                  Partner Expectations
                </h1>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Review and maintain your partner expectations used to find suitable matches.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <div className={designClasses.textSecondary}>
                    Profile ID
                  </div>

                  <div
                    className={`font-semibold ${designClasses.textPrimary}`}
                  >
                    {profileData.profile_id ||
                      profileData.profileId ||
                      "-"}
                  </div>
                </div>

                <div>
                  <div className={designClasses.textSecondary}>
                    Name
                  </div>

                  <div
                    className={`font-semibold ${designClasses.textPrimary}`}
                  >
                    {profileData.name || "-"}
                  </div>
                </div>

                <div>
                  <div className={designClasses.textSecondary}>
                    Login ID
                  </div>

                  <div
                    className={`font-semibold ${designClasses.textPrimary}`}
                  >
                    {profileData.userId || "-"}
                  </div>
                </div>
              </div>
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

          {showErrorDialog && (
            <ValidationErrorDialog
              errors={errors}
              onClose={() => setShowErrorDialog(false)}
            />
          )}
        </div>
      </div>
    </MemberLayout>
  );
};

export default PartnerPreferencesPage;
