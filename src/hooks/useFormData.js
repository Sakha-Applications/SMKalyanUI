import { useState } from "react";
import dayjs from "dayjs";
import { handlePhoneFieldChange } from "../utils/combinePhoneFields";

const useFormData = () => {
  const [formData, setFormData] = useState({
    // === 📍 Popup 1: Basic Info ===
    name: "",
    profileCreatedFor: "",
    gender: "", // used for UI logic
    motherTongue: "",
    currentLocationCountry: "",     // for Residing Country (Popup 1)
    currentLocationState: "", // Add this to Popup 1 section
    currentLocation: "",
    profileFor: "", // derived from gender

    // === 📍 Popup 2: Contact & DOB ===
    phone: "",
    phoneCountryCode: "+91",
    phoneNumber: "",
    email: "",
    dob: "",
    profileId: "",

    // === 📍 Popup 3: Personal Details ===
    marriedStatus: "",
    heightFeet: "",
    heightInches: "",
    height: "", // combined feet+inches
    profileCategory: "",
    nativePlaceCountry: "",
    nativePlaceState: "",
    nativePlace: "",
    placeOfBirthCountry: "",
placeOfBirthState: "",
placeOfBirth: "",
    timeOfBirth: "",
    aboutBrideGroom: "",
    diet: [],
    hobbies: [],

    // === 📍 Popup 4: Career & Education ===
    education: "",
    profession: "",
    designation: "",
    workingStatus: "",
    countryLivingIn: "",
    annualIncome: "",

    // === 📍 Popup 5: Upload Photos ===
    // No fields yet — reserved

    // === 📍 Popup 6: Family Details ===
    fatherName: "",
    fatherProfession: "",
    motherName: "",
    motherProfession: "",
    noOfBrothers: "",
    noOfSisters: "",
    familyStatus: "",
    familyType: "",
    familyValues: "",
    siblings: "",

    // === 📍 Popup 6A: Horoscope Details ===
    gotra: "",
    rashi: "",
    nakshatra: "",
    charanaPada: "",
    guruMatha: "",
    subCaste: "",
    manglikStatus: "",

    // === 📍 Popup 7: Contact Address ===
    alternatePhone: "",
    alternatePhoneCountryCode: "+91",
    alternatePhoneNumber: "",
    guardianPhone: "",
    guardianPhoneCountryCode: "+91",
    guardianPhoneNumber: "",
    communicationHouseNo: "",
    communicationStreet: "",
    communicationArea: "",
    communicationCity: "",
    communicationPIN: "",
    residenceHouseNo: "",
    residenceStreet: "",
    residenceArea: "",
    residenceCity: "",
    residencePIN: "",
    communicationAddress: "",
    residenceAddress: "",

    // === 📍 Popup 8: References ===
    reference1Name: "",
    reference1PhoneCountryCode: "+91",
    reference1PhoneNumber: "",
    reference1Phone: "",
    reference2Name: "",
    reference2PhoneCountryCode: "+91",
    reference2PhoneNumber: "",
    reference2Phone: "",

    // === 📦 Backend-specific (not captured in popups but used later) ===
    profileStatus: "",
    howDidYouKnow: "",
    shareDetailsOnPlatform: "",

    // === 📍 Popup 9: Partner Preferences (Page 1–3) ===
    expectations: "",
    ageRange: [25, 35],
    heightRange: [150, 180],
    preferredIncomeRange: [5, 20],
    preferredEducation: [],
    preferredMotherTongues: [],
    preferredMaritalStatus: "",
    preferredBrideGroomCategory: "",
    preferredManglikStatus: "",
    preferredSubCastes: [],
    preferredGuruMathas: [],
    preferredGotras: [],
    preferredNakshatras: [],
    preferredRashis: [],
    preferredNativeOrigins: [],
    preferredCities: [],
    preferredCountries: [],
    preferredDiet: [],
    preferredProfessions: [],
    preferredHobbies: [],
  });
  
  const generateProfileId = (name, phone) => {
    // Ensure we have valid inputs
    if (!name || !phone || typeof name !== 'string' || typeof phone !== 'string') {
      console.log('❌ generateProfileId: Invalid inputs', { name, phone });
      return null;
    }
    
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    
    if (trimmedName.length < 2 || trimmedPhone.length < 5) {
      console.log('❌ generateProfileId: Insufficient length', { 
        nameLength: trimmedName.length, 
        phoneLength: trimmedPhone.length 
      });
      return null;
    }
    
    const namePrefix = trimmedName.substring(0, 2).toUpperCase();
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    
    if (phoneDigits.length < 5) {
      console.log('❌ generateProfileId: Not enough phone digits', { phoneDigits });
      return null;
    }
    
    let randomDigits = "";
    const positions = [];
    while (positions.length < 5) {
      const pos = Math.floor(Math.random() * phoneDigits.length);
      if (!positions.includes(pos)) positions.push(pos);
    }
    positions.sort((a, b) => a - b);
    for (const pos of positions) {
      randomDigits += phoneDigits[pos];
    }
    
    const generatedId = `${namePrefix}${randomDigits}`;
    console.log('✅ generateProfileId: Generated', generatedId);
    return generatedId;
  };

  function formatTime(time) {
    if (!time) return "";
    const cleanInput = time.replace(/[^\d:]/g, '');
    if ((cleanInput.match(/:/g) || []).length === 2) {
      const parts = cleanInput.split(':');
      if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length <= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2].padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
    }
    if (/^\d+$/.test(cleanInput)) {
      const digits = cleanInput.padStart(6, '0').slice(0, 6);
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
    }
    const parts = cleanInput.split(':');
    const hours = parts[0] ? parts[0].padStart(2, '0').slice(0, 2) : '00';
    const minutes = parts[1] ? parts[1].padStart(2, '0').slice(0, 2) : '00';
    const seconds = parts[2] ? parts[2].padStart(2, '0').slice(0, 2) : '00';
    return `${hours}:${minutes}:${seconds}`;
  }

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setFormData((prevData) => {
      const newData = { ...prevData };

      // Skip profileId changes to prevent manual override
      if (name === "profileId") return prevData;

      // Auto-populate profileFor from gender
      if (name === "gender") {
        newData.gender = value;
        // Set profileFor based on gender
        newData.profileFor = value === "Female" ? "Bride" : value === "Male" ? "Bridegroom" : "";
        return newData;
      }

      // Combine heightFeet and heightInches into height (e.g. 5'5")
      if (["heightFeet", "heightInches"].includes(name)) {
        const feet = name === "heightFeet" ? value : newData.heightFeet;
        const inches = name === "heightInches" ? value : newData.heightInches;
        newData[name] = value; // Update the specific field first
        if (feet && inches) {
          newData.height = `${feet}'${inches}"`;
        } else {
          newData.height = "";
        }
        return newData;
      }

      // Handle phone-related fields using the utility function
      const phoneCombined = handlePhoneFieldChange(prevData, name, value);
      if (phoneCombined) {
        // Update the changed field and the combined phone field
        newData[name] = value;
        Object.assign(newData, phoneCombined);

        // Try to generate profileId if main phone fields are updated
        if (name === "phoneCountryCode" || name === "phoneNumber") {
          const currentName = newData.name;
          const currentPhone = newData.phone;

          console.log('🔄 Phone field changed:', { name, value, currentName, currentPhone });

          if (currentName && currentPhone && currentPhone.length > 5) {
            const newProfileId = generateProfileId(currentName, currentPhone);
            if (newProfileId) {
              newData.profileId = newProfileId;
              console.log('✅ ProfileId updated after phone change:', newProfileId);
            }
          }
        }

        return newData;
      }

      // Handle time field
      if (name === "timeOfBirth") {
        newData[name] = value;
        return newData;
      }

      // Handle arrays (Multiselect or Slider ranges)
      if (Array.isArray(value)) {
        if (["ageRange", "heightRange", "preferredIncomeRange"].includes(name)) {
          newData[name] = value; // keep as number arrays
        } else {
          newData[name] = value.map((v) =>
            typeof v === "string" ? v : v.label || v.value || ""
          );
        }
        return newData;
      }

      // Handle scalar values
      if (type === "number") {
        newData[name] = value ? parseFloat(value) || 0 : 0;
      } else if (type === "date") {
        newData[name] = value || "";
      } else {
        newData[name] = value || "";
      }

      // Auto-generate profileId when name changes
      if (name === "name") {
        const currentPhone = newData.phone;
        console.log('🔄 Name changed:', { value, currentPhone });

        if (value && currentPhone && currentPhone.length > 5) {
          const newProfileId = generateProfileId(value, currentPhone);
          if (newProfileId) {
            newData.profileId = newProfileId;
            console.log('✅ ProfileId updated after name change:', newProfileId);
          }
        }
      }

      return newData;
    });
  };

  const handleTimeBlur = (event) => {
    const formattedTime = formatTime(event.target.value);
    setFormData(prev => ({
      ...prev,
      timeOfBirth: formattedTime
    }));
  };

  const handleDOBChange = (dob) => {
    const getAgeWithMonths = (dob) => {
      if (!dob) return '';
      const birth = new Date(dob);
      const today = new Date();
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();

      if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
        years--;
        months = (months + 12) % 12;
      }

      return `${years} years${months > 0 ? ` ${months} months` : ''}`;
    };

    setFormData(prev => ({
      ...prev,
      dob: dob,
      currentAge: getAgeWithMonths(dob)
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleDOBChange,
    handleTimeBlur
  };
};

export default useFormData;