// src/components/ModifyProfile/MyProfilePage.jsx
import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';
import useApiData from '../../hooks/useApiData';

import EditModeProfile from './PartnerPreferences/EditModeProfile';

import ValidationErrorDialog from '../common/ValidationErrorDialog';
import {
  maritalStatusOptions,
  brideGroomCategoryOptions,
  subCasteOptions,
  hobbyOptions,
  dietOptions
} from './PartnerPreferences/constants/options';
import { Country, State } from 'country-state-city';
import countryData from 'country-telephone-data'; 
import ViewModeProfile from './PartnerPreferences/ViewModeProfile';

// ADD THIS HELPER FUNCTION
const calculateAge = (dobString) => {
  if (!dobString) {
    return '';
  }
  try {
    // Parse DOB string (e.g., '1997-04-26T18:30:00.000Z' -> '1997-04-26')
    const dobDate = new Date(dobString.split('T')[0]);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return `${age} years`; // Displaying only years as requested for simplicity
  } catch (e) {
    console.error("Error calculating age:", e);
    return '';
  }
};

// ADD THESE TWO HELPER FUNCTIONS (if not already present and correct)
const getCountryName = (isoCode) => {
  const countryObj = Country.getAllCountries().find(c => c.isoCode === isoCode);
  return countryObj ? countryObj.name : isoCode; // Return name, fallback to code if not found
};

const getStateName = (stateIsoCode, countryIsoCode) => {
  if (!countryIsoCode || !stateIsoCode) return stateIsoCode;
  const countryObj = Country.getAllCountries().find(c => c.isoCode === countryIsoCode);
  if (!countryObj) return stateIsoCode; // If country not found, can't map state name
  const stateObj = State.getStatesOfCountry(countryObj.isoCode).find(s => s.isoCode === stateIsoCode);
  return stateObj ? stateObj.name : stateIsoCode; // Return name, fallback to code if not found
};

const MyProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

    const skipNextEducationSearch = useRef(false);
    const skipNextMotherTongueSearch = useRef(false);
  const skipNextProfessionSearch = useRef(false);
  const skipNextGuruMathaSearch = useRef(false);
const skipNextDesignationSearch = useRef(false);

  const [educationInput, setEducationInput] = useState('');
  const [motherTongueInput, setMotherTongueInput] = useState('');
  const [guruMathaInput, setGuruMathaInput] = useState('');
  const [professionInput, setProfessionInput] = useState('');
const [designationInput, setDesignationInput] = useState('');

  const [educationOptions, setEducationOptions] = useState([]);
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([]);
const [designationOptions, setDesignationOptions] = useState([]);

  const [educationLoading, setEducationLoading] = useState(false);
  const [motherTongueLoading, setMotherTongueLoading] = useState(false);
  const [guruMathaLoading, setGuruMathaLoading] = useState(false);
  const [professionLoading, setProfessionLoading] = useState(false);
const [designationLoading, setDesignationLoading] = useState(false); 

 const [fatherProfessionInput, setFatherProfessionInput] = useState(''); // ADD THIS
  const [motherProfessionInput, setMotherProfessionInput] = useState(''); // ADD THIS


  const {
     gotraOptions = [],
  rashiOptions = [],
  nakshatraOptions = [],
    searchEducation,
    searchMotherTongues,
    searchGuruMatha,
    searchProfessions,
    searchDesignations,
    manglikOptions = [],
  } = useApiData() || {};

  
const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const token = sessionStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  console.log("MyProfilePage: Initial render check for token and userEmail");
  console.log("MyProfilePage: sessionStorage.getItem('token'):", sessionStorage.getItem('token'));
  console.log("MyProfilePage: localStorage.getItem('userEmail'):", localStorage.getItem('userEmail'));


useEffect(() => {
console.log("useEffect condition check: gotraOptions.length:", gotraOptions.length);
    console.log("useEffect condition check: rashiOptions.length:", rashiOptions.length);
    console.log("useEffect condition check: nakshatraOptions.length:", nakshatraOptions.length);
    console.log("useEffect condition check: hasFetchedProfile:", hasFetchedProfile); // Add this
  if (
    gotraOptions.length > 0 &&
    rashiOptions.length > 0 &&
    nakshatraOptions.length > 0 &&
    !hasFetchedProfile
  ) {
    fetchUserProfile();
      setHasFetchedProfile(true);
  }
}, [gotraOptions, rashiOptions, nakshatraOptions, hasFetchedProfile]);

  // src/components/ModifyProfile/MyProfilePage.jsx

// ... (existing imports, especially Country and State from 'country-state-city') ...

// ... (other code before fetchUserProfile) ...

  // === START OF REVISED READY-TO-PASTE fetchUserProfile FUNCTION ===
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/api/modifyProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Raw API response:", response.data);

      if (response.data) {
        console.log("DEBUG_BACKEND_RAW: response.data.communication_address:", response.data.communication_address);
        console.log("DEBUG_BACKEND_RAW: response.data.residence_address:", response.data.residence_address);

        const enriched = {
          ...response.data,
          profileId: sessionStorage.getItem("profileId") || response.data.profileId || response.data.profile_id,
          userId: userEmail,
          name: sessionStorage.getItem("name") || response.data.name,
        };
        console.log("✅ Enriched profileData (raw hobbies):", enriched.hobbies, typeof enriched.hobbies);
        console.log("✅ Enriched profileData:", enriched);

        // These logs confirm the values coming directly from 'enriched' (snake_case from DB)
        console.log("DEBUG_MYPROFILEPAGE: Raw Enriched native_place_country:", enriched.native_place_country);
        console.log("DEBUG_MYPROFILEPAGE: Raw Enriched native_place_state:", enriched.native_place_state);
        console.log("DEBUG_MYPROFILEPAGE: Raw Enriched native_place:", enriched.native_place);
        console.log("DEBUG_MYPROFILEPAGE: Raw Enriched current_location_country:", enriched.current_location_country);
        console.log("DEBUG_MYPROFILEPAGE: Raw Enriched current_location_state:", enriched.current_location_state);
        console.log("DEBUG_MYPROFILEPAGE: Raw Enriched current_location:", enriched.current_location);

        console.log("DEBUG_ENRICHED: enriched.communication_address:", enriched.communication_address);
        console.log("DEBUG_ENRICHED: enriched.residence_address:", enriched.residence_address);


        // Helper to parse phone strings for TextField select (Self-contained in fetchUserProfile)
        const parsePhoneNumberForInput = (fullNumberString) => {
          if (!fullNumberString || typeof fullNumberString !== 'string') {
            return { code: '', number: '' };
          }
          fullNumberString = fullNumberString.trim();
          let bestMatchCode = '';
          let bestMatchNumber = fullNumberString;
          const sortedCountryCodes = countryData.allCountries
            .map(c => `+${c.dialCode}`)
            .sort((a, b) => b.length - a.length);

          for (const dialCode of sortedCountryCodes) {
            if (fullNumberString.startsWith(dialCode)) {
              bestMatchCode = dialCode;
              bestMatchNumber = fullNumberString.substring(dialCode.length);
              break;
            }
            if (dialCode.startsWith('+') && fullNumberString.startsWith(dialCode.substring(1))) {
              bestMatchCode = dialCode;
              bestMatchNumber = fullNumberString.substring(dialCode.length - 1);
              break;
            }
          }
          if (!bestMatchCode) {
            bestMatchCode = '+91';
            bestMatchNumber = fullNumberString.replace(/^\+/, '');
          }
          return { code: bestMatchCode, number: bestMatchNumber.trim() };
        };

        // Helper to parse address strings for both view and edit mode inputs (Self-contained in fetchUserProfile)
        const parseCombinedAddressDetails = (addressString) => {
          const parsed = { houseNo: '', street: '', area: '', city: '', state: '', country: '', pin: '' };
          if (!addressString || typeof addressString !== 'string') {
            console.log("DEBUG_PARSE: Address string is empty or invalid. Returning empty parsed object.");
            return parsed;
          }
          const parts = addressString.split(',').map(s => s.trim());
          const numParts = parts.length;

          console.log(`DEBUG_PARSE: Raw address string: "${addressString}"`);
          console.log("DEBUG_PARSE: Split parts (after initialization):", parts);
          console.log("DEBUG_PARSE: Number of parts:", numParts);
          console.log(`DEBUG_PARSE: Extracted City (index ${numParts - 4}): "${(numParts >= 4) ? (parts[numParts - 4] || '') : ''}"`);
          console.log(`DEBUG_PARSE: Extracted State (index ${numParts - 3}): "${(numParts >= 3) ? (parts[numParts - 3] || '') : ''}"`);
          console.log(`DEBUG_PARSE: Extracted Country (index ${numParts - 2}): "${(numParts >= 2) ? (parts[numParts - 2] || '') : ''}"`);
          console.log(`DEBUG_PARSE: Extracted PIN (index ${numParts - 1}): "${(numParts >= 1) ? (parts[numParts - 1] || '') : ''}"`);

          parsed.pin = (numParts >= 1) ? (parts[numParts - 1] || '') : '';
          parsed.country = (numParts >= 2) ? (parts[numParts - 2] || '') : ''; // This will be whatever is in the string, likely Name
          parsed.state = (numParts >= 3) ? (parts[numParts - 3] || '') : '';   // This will be whatever is in the string, likely Name
          parsed.city = (numParts >= 4) ? (parts[numParts - 4] || '') : '';

          parsed.houseNo = (numParts >= 1) ? (parts[0] || '') : '';
          parsed.street = (numParts >= 2) ? (parts[1] || '') : '';
          parsed.area = (numParts >= 3) ? (parts[2] || '') : '';

          for (const key in parsed) {
            if (typeof parsed[key] === 'string') {
              parsed[key] = parsed[key].trim();
            }
          }
          console.log("DEBUG_PARSE: Final parsed object for address:", parsed);
          return parsed;
        };


        const phoneDetails = parsePhoneNumberForInput(enriched.phone);
        const alternatePhoneDetails = parsePhoneNumberForInput(enriched.alternate_phone);
        const guardianPhoneDetails = parsePhoneNumberForInput(enriched.guardian_phone);

// Parse reference phone numbers using the helper
const reference1PhoneDetails = parsePhoneNumberForInput(enriched.reference1_phone);
const reference2PhoneDetails = parsePhoneNumberForInput(enriched.reference2_phone);



        console.log("DEBUG: Parsed Phone Details:", { phone: phoneDetails, alternate: alternatePhoneDetails, guardian: guardianPhoneDetails });

        const communicationAddressDetails = parseCombinedAddressDetails(enriched.communication_address);
        console.log("DEBUG: enriched.communication_address:", enriched.communication_address);
        console.log("DEBUG: Parsed communicationAddressDetails:", communicationAddressDetails);
        const residenceAddressDetails = parseCombinedAddressDetails(enriched.residence_address);
        console.log("DEBUG: enriched.residence_address:", enriched.residence_address);
        console.log("DEBUG: Parsed residenceAddressDetails:", residenceAddressDetails);


        // --- Helper to convert Name to ISO Code (used below for formData) ---
        const getCountryIsoCode = (countryName) => {
          if (!countryName) return '';
          const countryObj = Country.getAllCountries().find(c => c.name === countryName);
          return countryObj ? countryObj.isoCode : countryName; // Return ISO, fallback to name if not found
        };

        const getStateIsoCode = (stateName, countryIsoCode) => {
          if (!stateName || !countryIsoCode) return '';
          const countryObj = Country.getAllCountries().find(c => c.isoCode === countryIsoCode);
          if (!countryObj) return stateName; // If country not found by ISO, can't map state
          const stateObj = State.getStatesOfCountry(countryObj.isoCode).find(s => s.name === stateName);
          return stateObj ? stateObj.isoCode : stateName; // Return ISO, fallback to name if not found
        };

        // --- Prepare viewReadyProfileData (for ViewModeProfile display) ---
        const viewReadyProfileData = {
          ...enriched,
          phoneCountryCode: phoneDetails.code,
          phoneNumber: phoneDetails.number,
          alternatePhoneCountryCode: alternatePhoneDetails.code,
          alternatePhoneNumber: alternatePhoneDetails.number,
          guardianPhoneCountryCode: guardianPhoneDetails.code,
          guardianPhoneNumber: guardianPhoneDetails.number,
   
           // Add these lines for reference phones in view mode
        reference1PhoneCountryCode: reference1PhoneDetails.code,
        reference1PhoneNumber: reference1PhoneDetails.number,
        reference2PhoneCountryCode: reference2PhoneDetails.code,
        reference2PhoneNumber: reference2PhoneDetails.number,
   
   
          communicationHouseNo: communicationAddressDetails.houseNo,
          communicationStreet: communicationAddressDetails.street,
          communicationArea: communicationAddressDetails.area,
          communicationPIN: communicationAddressDetails.pin,
          communicationCity: communicationAddressDetails.city,
          communicationState: getStateName(communicationAddressDetails.state, getCountryIsoCode(communicationAddressDetails.country)), // Ensure country is ISO for getStateName
          communicationCountry: getCountryName(getCountryIsoCode(communicationAddressDetails.country)), // Convert parsed name to ISO, then ISO to Name for View
          residenceHouseNo: residenceAddressDetails.houseNo,
          residenceStreet: residenceAddressDetails.street,
          residenceArea: residenceAddressDetails.area,
          residencePIN: residenceAddressDetails.pin,
          residenceCity: residenceAddressDetails.city,
          residenceState: getStateName(residenceAddressDetails.state, getCountryIsoCode(residenceAddressDetails.country)), // Ensure country is ISO for getStateName
          residenceCountry: getCountryName(getCountryIsoCode(residenceAddressDetails.country)), // Convert parsed name to ISO, then ISO to Name for View

          // Place of Birth - Ensure enriched.place_of_birth_country/state are ISOs for getCountryName/getStateName
          placeOfBirthCountry: getCountryName(enriched.place_of_birth_country), // Assume enriched has ISO for View
          placeOfBirthState: getStateName(enriched.place_of_birth_state, enriched.place_of_birth_country), // Assume enriched has ISO for View
          placeOfBirth: enriched.place_of_birth || '', // City name

          // Native/Current Location - Already correct for View, assume enriched has ISOs
          nativePlaceCountry: getCountryName(enriched.native_place_country),
          nativePlaceState: getStateName(enriched.native_place_state, enriched.native_place_country),
          nativePlace: enriched.native_place || '', // City name
          currentLocationCountry: getCountryName(enriched.current_location_country),
          currentLocationState: getStateName(enriched.current_location_state, enriched.current_location_country),
          currentLocation: enriched.current_location || '', // City name


          hobbies: (() => {
            if (Array.isArray(enriched.hobbies)) {
              return enriched.hobbies.map(item => String(item).trim());
            }
            if (typeof enriched.hobbies === 'string' && enriched.hobbies.trim() !== '') {
              return enriched.hobbies.split(',').map(item => item.trim());
            }
            return [];
          })(),

          profileCreatedFor: enriched.profile_created_for || '',
          profileFor: enriched.profile_for || '',
          profileStatus: enriched.profile_status || '',
          marriedStatus: enriched.married_status || enriched.marriedStatus || '',
          profileCategory: enriched.profile_category || enriched.profileCategory || '',
          profileCategoryNeed: enriched.profile_category_need || enriched.profileCategoryNeed || '',
          howDidYouKnow: enriched.how_did_you_know || '',
          shareDetailsOnPlatform: enriched.share_details_on_platform || '',

          heightFeet: (() => {
            if (enriched.height && typeof enriched.height === 'string') {
              const match = enriched.height.match(/(\d+)'(\d+)"/);
              return match ? parseInt(match[1], 10) : '';
            }
            return '';
          })(),
          heightInches: (() => {
            if (enriched.height && typeof enriched.height === 'string') {
              const match = enriched.height.match(/(\d+)'(\d+)"/);
              return match ? parseInt(match[2], 10) : '';
            }
            return '';
          })(),
        };

        setProfileData(viewReadyProfileData);

        // Debug logs before setFormData for the formData object
        console.log("DEBUG_MYPROFILEPAGE: --- Pre-setFormData values for all Location fields (from enriched/parsed) ---");
        console.log("DEBUG_MYPROFILEPAGE: Native: Country:", enriched.native_place_country, "State:", enriched.native_place_state, "City:", enriched.native_place);
        console.log("DEBUG_MYPROFILEPAGE: Current: Country:", enriched.current_location_country, "State:", enriched.current_location_state, "City:", enriched.current_location);
        console.log("DEBUG_MYPROFILEPAGE: CommAddr: Country:", communicationAddressDetails.country, "State:", communicationAddressDetails.state, "City:", communicationAddressDetails.city);
        console.log("DEBUG_MYPROFILEPAGE: ResAddr: Country:", residenceAddressDetails.country, "State:", residenceAddressDetails.state, "City:", residenceAddressDetails.city);
        console.log("DEBUG_MYPROFILEPAGE: PlaceOfBirth: Country:", enriched.place_of_birth_country, "State:", enriched.place_of_birth_state, "City:", enriched.place_of_birth);
        console.log("DEBUG_MYPROFILEPAGE: ----------------------------------------------------");

        // --- Prepare formData for EditModeProfile inputs ---
        setFormData({
          ...enriched, // Include original enriched, but override specific fields

          phoneCountryCode: phoneDetails.code,
          phoneNumber: phoneDetails.number,
          alternatePhoneCountryCode: alternatePhoneDetails.code,
          alternatePhoneNumber: alternatePhoneDetails.number,
          guardianPhoneCountryCode: guardianPhoneDetails.code,
          guardianPhoneNumber: guardianPhoneDetails.number,

          // Communication Address (Pass ISO codes to CountryStateCitySelector)
          communicationHouseNo: communicationAddressDetails.houseNo,
          communicationStreet: communicationAddressDetails.street,
          communicationArea: communicationAddressDetails.area,
          communicationPIN: communicationAddressDetails.pin,
          communicationCity: communicationAddressDetails.city,
          communicationState: getStateIsoCode(communicationAddressDetails.state, getCountryIsoCode(communicationAddressDetails.country)), // Convert name to ISO
          communicationCountry: getCountryIsoCode(communicationAddressDetails.country), // Convert name to ISO

          // Residence Address (Pass ISO codes to CountryStateCitySelector)
          residenceHouseNo: residenceAddressDetails.houseNo,
          residenceStreet: residenceAddressDetails.street,
          residenceArea: residenceAddressDetails.area,
          residencePIN: residenceAddressDetails.pin,
          residenceCity: residenceAddressDetails.city,
          residenceState: getStateIsoCode(residenceAddressDetails.state, getCountryIsoCode(residenceAddressDetails.country)), // Convert name to ISO
          residenceCountry: getCountryIsoCode(residenceAddressDetails.country), // Convert name to ISO

          // Place of Birth (Pass ISO codes to CountryStateCitySelector)
          placeOfBirthCountry: getCountryIsoCode(enriched.place_of_birth_country) || enriched.place_of_birth_country || '', // Convert name to ISO, fallback to already ISO or empty
          placeOfBirthState: getStateIsoCode(enriched.place_of_birth_state, getCountryIsoCode(enriched.place_of_birth_country)) || enriched.place_of_birth_state || '', // Convert name to ISO, fallback
          placeOfBirth: enriched.place_of_birth || '', // City name

          // Native Location (Pass ISO codes to CountryStateCitySelector) - Already correct
          nativePlaceCountry: enriched.native_place_country || '', // ISO Code directly from enriched
          nativePlaceState: enriched.native_place_state || '',     // ISO Code directly from enriched
          nativePlace: enriched.native_place || '',                // City Name

          // Current Location (Pass ISO codes to CountryStateCitySelector) - Already correct
          currentLocationCountry: enriched.current_location_country || '', // ISO Code directly from enriched
          currentLocationState: enriched.current_location_state || '',     // ISO Code directly from enriched
          currentLocation: enriched.current_location || '',                // City Name


          // --- ALL OTHER formData fields (snake_case to camelCase mapping) ---
          profileId: enriched.profile_id,
          name: enriched.name || '',
          profileCreatedFor: enriched.profile_created_for || '',
          profileFor: enriched.profile_for || '',
          dob: enriched.dob || '', // Ensure DOB is just 'YYYY-MM-DD'
          timeOfBirth: enriched.time_of_birth || enriched.timeOfBirth || '',
          currentAge: enriched.current_age || '',
          subCaste: enriched.sub_caste || '',
          charanaPada: enriched.charana_pada || '',
          email: enriched.email || '',
          fatherName: enriched.father_name || enriched.fatherName || '',
          motherName: enriched.mother_name || enriched.motherName || '',
          fatherProfession: enriched.father_profession || enriched.fatherProfession || '',
          motherProfession: enriched.mother_profession || enriched.motherProfession || '',
          expectations: enriched.expectations || '',
          siblings: enriched.siblings || '',
          aboutBrideGroom: enriched.about_bride_groom || enriched.aboutBrideGroom || '',
          reference1Name: enriched.reference1_name || enriched.reference1Name || '',
reference1PhoneCountryCode: reference1PhoneDetails.code,
    reference1PhoneNumber: reference1PhoneDetails.number,


          
          reference2Name: enriched.reference2_name || enriched.reference2Name || '',
           reference2PhoneCountryCode: reference2PhoneDetails.code,
    reference2PhoneNumber: reference2PhoneDetails.number,
          
          
          howDidYouKnow: enriched.how_did_you_know || enriched.howDidYouKnow || '',
          workingStatus: enriched.working_status || enriched.workingStatus || '',
          education: enriched.education || '',
          profession: enriched.profession || '',
          designation: enriched.designation || '',
          currentCompany: enriched.current_company || enriched.currentCompany || '',
          annualIncome: enriched.annual_income || enriched.annualIncome || '',
          shareDetailsOnPlatform: enriched.share_details_on_platform || enriched.shareDetailsOnPlatform || '',
          marriedStatus: enriched.married_status || enriched.marriedStatus || '',
          profileCategory: enriched.profile_category || enriched.profileCategory || '',
          profileCategoryNeed: enriched.profile_category_need || enriched.profileCategoryNeed || '',

          hobbies: (() => {
            if (Array.isArray(enriched.hobbies)) {
              return enriched.hobbies.map(item => String(item).trim());
            }
            if (typeof enriched.hobbies === 'string' && enriched.hobbies.trim() !== '') {
              return enriched.hobbies.split(',').map(item => item.trim());
            }
            return [];
          })(),
          motherTongue: (() => {
            if (typeof enriched.mother_tongue === 'object' && enriched.mother_tongue !== null) {
              return enriched.mother_tongue;
            }
            if (enriched.mother_tongue) {
              return { label: enriched.mother_tongue, value: enriched.mother_tongue };
            }
            return null;
          })(),
          heightFeet: (() => {
            if (enriched.height && typeof enriched.height === 'string') {
              const match = enriched.height.match(/(\d+)'(\d+)"/);
              return match ? parseInt(match[1], 10) : '';
            }
            return '';
          })(),
          heightInches: (() => {
            if (enriched.height && typeof enriched.height === 'string') {
              const match = enriched.height.match(/(\d+)'(\d+)"/);
              return match ? parseInt(match[2], 10) : '';
            }
            return '';
          })(),

          gotra: (() => {
            if (typeof enriched.gotra === 'object' && enriched.gotra !== null) {
              return enriched.gotra;
            }
            if (enriched.gotra) {
              return gotraOptions.find(opt =>
                opt.label === enriched.gotra || opt.value === enriched.gotra
              ) || { label: enriched.gotra, value: enriched.gotra };
            }
            return null;
          })(),
          rashi: (() => {
            if (typeof enriched.rashi === 'object' && enriched.rashi !== null) {
              return enriched.rashi;
            }
            if (enriched.rashi) {
              return rashiOptions.find(opt =>
                opt.label === enriched.rashi || opt.value === enriched.rashi
              ) || { label: enriched.rashi, value: enriched.rashi };
            }
            return null;
          })(),
          nakshatra: (() => {
            if (typeof enriched.nakshatra === 'object' && enriched.nakshatra !== null) {
              return enriched.nakshatra;
            }
            if (enriched.nakshatra) {
              return nakshatraOptions.find(opt =>
                opt.label === enriched.nakshatra || opt.value === enriched.nakshatra
              ) || { label: enriched.nakshatra, value: enriched.nakshatra };
            }
            return null;
          })(),
          guruMatha: (() => {
            if (typeof enriched.guru_matha === 'object' && enriched.guru_matha !== null) {
              return enriched.guru_matha;
            }
            if (enriched.guru_matha) {
              return { label: enriched.guru_matha, value: enriched.guru_matha };
            }
            return null;
          })(),

          education: enriched.education || '',
          profession: enriched.profession || '',
          designation: enriched.designation || '',

          currentCompany: enriched.current_company || enriched.currentCompany || '',
          annualIncome: enriched.annual_income || enriched.annualIncome || '',
        });
        // --- END: setFormData ---

        console.log("✅ formData AFTER initialization (may not be fully updated yet):", formData);
        console.log("✅ Initialized formData with proper objects");

      } else {
        setError("Failed to fetch profile data.");
      }
    } catch (error) {
      console.error("❌ Error fetching profile data:", error);
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };
  // === END OF REVISED READY-TO-PASTE fetchUserProfile FUNCTION ===

  

  useEffect(() => {
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: Current formData in parent component after render:", formData);
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: nativePlaceCountry:", formData.nativePlaceCountry);
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: nativePlaceState:", formData.nativePlaceState);
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: nativePlace:", formData.nativePlace);
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: currentLocationCountry:", formData.currentLocationCountry);
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: currentLocationState:", formData.currentLocationState);
    console.log("DEBUG_MYPROFILEPAGE_RENDERED_STATE: currentLocation:", formData.currentLocation);
}, [formData]); // Thi

  // ✅ FIXED: Search effects with proper debouncing
    useEffect(() => {
  const delay = setTimeout(async () => {
    if (skipNextEducationSearch.current) {
      skipNextEducationSearch.current = false;
      return;
    }

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
    } else {
      setEducationOptions([]);
    }
  }, 300);
  return () => clearTimeout(delay);
}, [educationInput, searchEducation]); // <--- REMOVED setEducationOptions

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
      } else {
        setMotherTongueOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [motherTongueInput]);

  // ✅ FIXED: Guru Matha search effect
  
  useEffect(() => {
  const delay = setTimeout(async () => {
    if (skipNextGuruMathaSearch.current) {
      skipNextGuruMathaSearch.current = false;
      return;
    }

    if (guruMathaInput.length >= 2) {
      setGuruMathaLoading(true);
      try {
        const results = await searchGuruMatha(guruMathaInput);
        setGuruMathaOptions(results.map(item => ({
          label: item.label || item,
          value: item.label || item
        })));
      } catch (error) {
        console.error("Error searching Guru Matha:", error);
        setGuruMathaOptions([]);
      } finally {
        setGuruMathaLoading(false);
      }
    } else {
      setGuruMathaOptions([]);
    }
  }, 300);
  return () => clearTimeout(delay);
}, [guruMathaInput, searchGuruMatha]); // <--- REMOVED setGuruMathaOptions

  useEffect(() => {
  const delay = setTimeout(async () => {
    if (skipNextProfessionSearch.current) {
      console.log("SKIPPING profession search due to flag");
      skipNextProfessionSearch.current = false;
      return;
    }

    if (professionInput.length >= 2) {
       console.log("Profession search triggered for:", professionInput);
      setProfessionLoading(true);
      try {
        const results = await searchProfessions(professionInput);
        setProfessionOptions(
          results.map(item => ({
            label: item.ProfessionName || item.label || item.name || String(item),
            value: item.ProfessionName || item.label || item.name || String(item)
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching profession options:", error);
        setProfessionOptions([]);
      } finally {
        setProfessionLoading(false);
      }
    } else {
      setProfessionOptions([]);
    }
  }, 300);

  return () => clearTimeout(delay);
}, [professionInput, searchProfessions]); // <--- REMOVED setProfessionOptions

useEffect(() => {
  const delay = setTimeout(async () => {
    if (skipNextDesignationSearch.current) {
      skipNextDesignationSearch.current = false;
      return;
    }

    if (designationInput.length >= 2) {
      setDesignationLoading(true);
      try {
        const results = await searchDesignations(designationInput);
         console.log("🔍 Raw Designation API results:", results);
        setDesignationOptions(results.map(item => ({

          label: item.DesignationName || item.label || item.name || String(item), // Make robust like Profession
          value: item.id || item.value || String(item) // Make robust like Profession (item.id if id is value, else add fallbacks)


        })));
      } catch (error) {
        console.error("❌ Error fetching designation options:", error);
        setDesignationOptions([]);
      } finally {
        setDesignationLoading(false);
      }
    } else {
      setDesignationOptions([]);
    }
  }, 300);
 return () => clearTimeout(delay);
}, [designationInput, searchDesignations]);


// ... (other useEffects above this one) ...

// ✅ CORRECTED: Initialize input fields when entering/exiting edit mode
// This useEffect initializes input fields when entering/exiting edit mode
useEffect(() => { // <--- This is the start of the useEffect callback
    if (isEditing) {
        // Education
        if (formData.education) {
            const educationText = typeof formData.education === 'object'
                ? formData.education.label || formData.education.value
                : formData.education;
            setEducationInput(educationText);
            skipNextEducationSearch.current = true;
        } else {
            setEducationInput('');
        }

        // Profession
        if (formData.profession) {
            const professionText = typeof formData.profession === 'object'
                ? formData.profession.label || formData.profession.value
                : formData.profession;
            setProfessionInput(professionText);
            skipNextProfessionSearch.current = true;
        } else {
            setProfessionInput('');
        }

        // Mother Tongue
        if (formData.motherTongue) {
            const motherTongueText = typeof formData.motherTongue === 'object'
                ? formData.motherTongue.label || formData.motherTongue.value
                : formData.motherTongue;
            setMotherTongueInput(motherTongueText);
            skipNextMotherTongueSearch.current = true;
        } else {
            setMotherTongueInput('');
        }

        // Guru Matha
        if (formData.guruMatha) {
            const guruMathaText = typeof formData.guruMatha === 'object'
                ? formData.guruMatha.label || formData.guruMatha.value
                : formData.guruMatha;
            setGuruMathaInput(guruMathaText);
            skipNextGuruMathaSearch.current = true;
        } else {
            setGuruMathaInput('');
        }

        // Designation Initialization
        if (formData.designation) {
            const designationText = typeof formData.designation === 'object'
                ? formData.designation.label || formData.designation.value
                : formData.designation;
            setDesignationInput(designationText);
            skipNextDesignationSearch.current = true;
        } else {
            setDesignationInput('');
        }

        // === ADDITIONS FOR FATHER'S AND MOTHER'S PROFESSION INPUTS ===
        // Father's Profession
        if (formData.fatherProfession) {
            const fatherProfessionText = typeof formData.fatherProfession === 'object'
                ? formData.fatherProfession.label || formData.fatherProfession.value
                : formData.fatherProfession;
            setFatherProfessionInput(fatherProfessionText);
            // No skipNextProfessionSearch.current for individual father/mother input fields,
            // as they use the main professionOptions and search.
        } else {
            setFatherProfessionInput('');
        }

        // Mother's Profession
        if (formData.motherProfession) {
            const motherProfessionText = typeof formData.motherProfession === 'object'
                ? formData.motherProfession.label || formData.motherProfession.value
                : formData.motherProfession;
            setMotherProfessionInput(motherProfessionText);
            // No skipNextProfessionSearch.current for individual father/mother input fields.
        } else {
            setMotherProfessionInput('');
        }
        // === END OF ADDITIONS ===

    } else { // This 'else' correctly belongs to the 'if (isEditing)' above
        // When exiting edit mode, clear inputs and reset flags for next edit session
        setEducationInput('');
        setProfessionInput('');
        setMotherTongueInput('');
        setGuruMathaInput('');
        setDesignationInput('');
        // === ADDITIONS FOR CLEARING FATHER'S AND MOTHER'S PROFESSION INPUTS ===
        setFatherProfessionInput('');
        setMotherProfessionInput('');
        // === END OF ADDITIONS ===


        skipNextEducationSearch.current = false;
        skipNextProfessionSearch.current = false;
        skipNextGuruMathaSearch.current = false;
        skipNextMotherTongueSearch.current = false;
        skipNextDesignationSearch.current = false;

        // Clear options (This part is generally fine for resetting on exit, as it's not a direct loop source in *this* useEffect)
        setEducationOptions([]);
        setProfessionOptions([]);
        setMotherTongueOptions([]);
        setGuruMathaOptions([]);
        setDesignationOptions([]);
    }
}, [
    isEditing,
    formData.education, formData.profession, formData.motherTongue, formData.guruMatha, formData.designation,
    // === ADD THESE TO DEPENDENCY ARRAY ===
    formData.fatherProfession, formData.motherProfession,
    // === END OF ADDITIONS ===
    setEducationInput, setProfessionInput, setMotherTongueInput, setGuruMathaInput, setDesignationInput,
    // === ADD THESE SETTERS TO DEPENDENCY ARRAY ===
    setFatherProfessionInput, setMotherProfessionInput,
    // === END OF ADDITIONS ===
    setEducationOptions, setProfessionOptions, setMotherTongueOptions, setGuruMathaOptions, setDesignationOptions
]); // <--- This closes the useEffect dependency array


  useEffect(() => {
    console.log("🎯 gotraOptions:", gotraOptions);
    console.log("🎯 rashiOptions:", rashiOptions);
    console.log("🎯 nakshatraOptions:", nakshatraOptions);
  }, [gotraOptions, rashiOptions, nakshatraOptions]);

const handleUpdate = async () => {
  setLoading(true);

  // ✅ Convert DOB to YYYY-MM-DD format
  if (formData.dob && typeof formData.dob === 'string') {
    formData.dob = formData.dob.split('T')[0];
  }

  try {
    // 🧼 Destructure to exclude camelCase keys
    const {
      profileId,
      userId,
      name,
      profileCreatedFor,
      profileFor,
      dob,
      timeOfBirth,
      placeOfBirth,
      placeOfBirthState,
      placeOfBirthCountry,
      currentAge,
       heightFeet, // <--- ADD THIS LINE
      heightInches, // <--- ADD THIS LINE
      motherTongue,
      subCaste,
      gotra,
      rashi,
      nakshatra,
      charanaPada,
      guruMatha,
      marriedStatus,
      profileCategory,
      profileStatus,
      email,
  // --- START: ADD/CONFIRM THESE PHONE AND ADDRESS FIELDS ---
      phoneCountryCode,
      phoneNumber,
      alternatePhoneCountryCode,
      alternatePhoneNumber,
      guardianPhoneCountryCode, // Add this
      guardianPhoneNumber,      // Add this

      communicationHouseNo,
      communicationStreet,
      communicationArea,
      communicationCity,
      communicationState,
      communicationCountry,
      communicationPIN, // Make sure this is present

      residenceHouseNo,
      residenceStreet,
      residenceArea,
      residenceCity,
      residenceState,
      residenceCountry,
      residencePIN, // Make sure this is present

  
  
  
  
      phone,
      alternatePhone,
      communicationAddress,
      communication_state,
      communication_city,
      residenceAddress,
      residence_state,
      residence_city,
      nativePlace,
      native_place_state,
      native_place_country,
      currentLocation,
      current_location_state,
      current_location_country,
      fatherName,
      fatherProfession,
      motherName,
      motherProfession,
      siblings,

       // --- ADD THESE MISSING FIELDS FROM formData ---
      noOfBrothers,
      noOfSisters,
      familyStatus,
      familyType,
      familyValues,
      // --- END ADDITIONS ---
      education,
      profession,
      designation,
      currentCompany,
      workingStatus,
      annualIncome,
      expectations,
      aboutBrideGroom,
      howDidYouKnow,
      shareDetailsOnPlatform,
      reference1Name,
reference1PhoneCountryCode, // <-- ADD THIS
reference2PhoneCountryCode,      

      reference1Phone,
      reference2Name,
      reference2Phone,
      reference1CountryCode,
      reference1PhoneNumber,
      reference2CountryCode,
      reference2PhoneNumber,
      ...rest
    } = formData;

    
    // ✅ Build final payload in backend-friendly format
    const finalPayload = {
      ...rest,
      profile_id: profileId,
      user_id: userId,
      name,
      profile_created_for: profileCreatedFor,
      profile_for: profileFor,
      dob,
      time_of_birth: timeOfBirth,
      place_of_birth: placeOfBirth,
      place_of_birth_state: placeOfBirthState,
      place_of_birth_country: placeOfBirthCountry,
      current_age: currentAge,
            // Combine heightFeet and heightInches into "feet'inches"" string format for backend
       height: (heightFeet && heightInches) ? `${heightFeet}'${heightInches}"` : null,
      
            

      mother_tongue: typeof motherTongue === 'object' && motherTongue !== null ? motherTongue.label : motherTongue,
      sub_caste: subCaste,
      
      // ✅ FIXED: Extract label from objects for backend
      gotra: typeof gotra === 'object' && gotra !== null ? gotra.label : gotra,
      rashi: typeof rashi === 'object' && rashi !== null ? rashi.label : rashi,
      nakshatra: typeof nakshatra === 'object' && nakshatra !== null ? nakshatra.label : nakshatra,
      guru_matha: typeof guruMatha === 'object' && guruMatha !== null ? guruMatha.label : guruMatha,
      
      charana_pada: charanaPada,
      married_status: marriedStatus,
      profile_category: profileCategory,
      profile_status: profileStatus,
      email,
      phone,
 alternate_phone: (alternatePhoneCountryCode && alternatePhoneNumber) ? `${alternatePhoneCountryCode}${alternatePhoneNumber}` : (alternatePhoneNumber || null),
  // Assuming guardian_phone is also combined if separate fields exist. If not in DB, it will be null from frontend.
  guardian_phone: (guardianPhoneCountryCode && guardianPhoneNumber) ? `${guardianPhoneCountryCode}${guardianPhoneNumber}` : (guardianPhoneNumber || null),

  
communication_address: [
    communicationHouseNo,
    communicationStreet,
    communicationArea,
    communicationCity,
    communicationState,   // Full state name
    communicationCountry, // Full country name
    communicationPIN,
  ].filter(Boolean).join(', '),

   communication_state: (() => {
    const stateObj = State.getStatesOfCountry(
        Country.getAllCountries().find(c => c.name === communicationCountry)?.isoCode || ''
      ).find(s => s.name === communicationState);
    return stateObj ? stateObj.isoCode : communicationState || null; // Send ISO code, fallback to name or null
  })(),
  communication_country: (() => {
    const countryObj = Country.getAllCountries().find(c => c.name === communicationCountry);
    return countryObj ? countryObj.isoCode : communicationCountry || null; // Send ISO code, fallback to name or null
  })(),
      communication_city,

      // Combine ALL residence address fields into a single string for backend
  residence_address: [
    residenceHouseNo,
    residenceStreet,
    residenceArea,
    residenceCity,
    residenceState,   // Full state name
    residenceCountry, // Full country name
    residencePIN,
  ].filter(Boolean).join(', '),

  // Send residence City, State, Country, PIN as separate fields (ISO codes for state/country)
  // These might be redundant if residence_address is the primary field, but send them if your backend expects them.
  residence_city: residenceCity || null,
  residence_state: (() => {
    const stateObj = State.getStatesOfCountry(
        Country.getAllCountries().find(c => c.name === residenceCountry)?.isoCode || ''
      ).find(s => s.name === residenceState);
    return stateObj ? stateObj.isoCode : residenceState || null;
  })(),
  residence_country: (() => {
    const countryObj = Country.getAllCountries().find(c => c.name === residenceCountry);
    return countryObj ? countryObj.isoCode : residenceCountry || null;
  })(),

  residence_city,
      native_place: nativePlace,
      native_place_state,
      native_place_country,
      current_location: currentLocation,
      current_location_state,
      current_location_country,
      father_name: fatherName,
      father_profession: fatherProfession,
      mother_name: motherName,
      mother_profession: motherProfession,
      siblings,
no_of_brothers: noOfBrothers || null, // Map camelCase to snake_case
      no_of_sisters: noOfSisters || null, 
   family_status: familyStatus || null,
      family_type: familyType || null,
      family_values: familyValues || null,

education: typeof education === 'object' && education !== null ? education.label : education, // Transform to label
      profession: typeof profession === 'object' && profession !== null ? profession.label : profession, // Transform to label
      designation: typeof designation === 'object' && designation !== null ? designation.label : designation, // Transform to label

      
      current_company: currentCompany,
      working_status: workingStatus,
      annual_income: annualIncome,
      expectations,
      about_bride_groom: aboutBrideGroom,
      how_did_you_know: howDidYouKnow,
      share_details_on_platform: shareDetailsOnPlatform,
      reference1_name: reference1Name,
      reference1_phone: (reference1PhoneCountryCode && reference1PhoneNumber) ? `${reference1PhoneCountryCode}${reference1PhoneNumber}` : (reference1PhoneNumber || null),
reference2_phone: (reference2PhoneCountryCode && reference2PhoneNumber) ? `${reference2PhoneCountryCode}${reference2PhoneNumber}` : (reference2PhoneNumber || null),

      reference2_name: reference2Name,

      reference1_country_code: reference1CountryCode,
      reference1_phone_number: reference1PhoneNumber,
      reference2_country_code: reference2CountryCode,
      reference2_phone_number: reference2PhoneNumber,
    };

    // 🐛 Debug logging
    console.log("🔍 Form data before sanitization:", { gotra, nakshatra, rashi, guruMatha });
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
          <h1 className="text-2xl font-bold">Profile Details</h1>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><strong>Profile ID:</strong> {profileData.profile_id || profileData.profileId}</div>
            <div><strong>Name:</strong> {profileData.name}</div>
            <div><strong>User ID:</strong> {profileData.userId}</div>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <EditModeProfile
              profileData={profileData}
              formData={formData}
              setFormData={setFormData}
              handleUpdate={handleUpdate}
              setIsEditing={setIsEditing}
              loading={loading}

              // ✅ FIXED: Horoscope Dropdown Props
              gotraOptions={gotraOptions}
              rashiOptions={rashiOptions}
              nakshatraOptions={nakshatraOptions}
              guruMathaOptions={guruMathaOptions}
              guruMathaInput={guruMathaInput}
              setGuruMathaInput={setGuruMathaInput}
              guruMathaLoading={guruMathaLoading}
              setGuruMathaOptions={setGuruMathaOptions}
              searchGuruMatha={searchGuruMatha}

              // Other dropdowns
              educationOptions={educationOptions}
              educationInput={educationInput}
              setEducationInput={setEducationInput}
              educationLoading={educationLoading}
              setEducationOptions={setEducationOptions}
              searchEducation={searchEducation}

              motherTongueOptions={motherTongueOptions}
              motherTongueInput={motherTongueInput}
              setMotherTongueInput={setMotherTongueInput}
              motherTongueLoading={motherTongueLoading}

              professionOptions={professionOptions}
              professionInput={professionInput}
              setProfessionInput={setProfessionInput}
              professionLoading={professionLoading}
  setProfessionOptions={setProfessionOptions}
    searchProfessions={searchProfessions}

    // Pass the new input states and setters for father's and mother's professions
        fatherProfessionInput={fatherProfessionInput}
        setFatherProfessionInput={setFatherProfessionInput}
        motherProfessionInput={motherProfessionInput}
        setMotherProfessionInput={setMotherProfessionInput}
        
    

      // ADD THESE: Designation Autocomplete Props
  designationOptions={designationOptions}
  designationInput={designationInput}
  setDesignationInput={setDesignationInput}
  designationLoading={designationLoading}
  setDesignationOptions={setDesignationOptions}
  searchDesignations={searchDesignations}
    
              maritalStatusOptions={maritalStatusOptions}
              brideGroomCategoryOptions={brideGroomCategoryOptions}
              subCasteOptions={subCasteOptions}
              manglikOptions={manglikOptions}
              hobbyOptions={hobbyOptions}
              dietOptions={dietOptions}
              editModeActive={isEditing}
            />
          ) : (
            <ViewModeProfile
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

export default MyProfilePage;