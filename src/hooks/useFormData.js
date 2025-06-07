import { useState } from "react";
import dayjs from "dayjs";

const useFormData = () => {
    const [formData, setFormData] = useState({
        id: 0,
        profileId: "",
        name: "",
        profileCreatedFor: "Self",
        profileFor: "",
        motherTongue: "",
        nativePlace: "",
        currentLocation: "",
        profileStatus: "",
        marriedStatus: "Single(Never Married)",
        shareDetailsOnPlatform: "",
        gotra: "",
        guruMatha: "",
        manglikStatus: "",
        dob: null,
        timeOfBirth: "",
        placeOfBirth: "",
        currentAge: "",
        subCaste: "Madhva (ಮಾಧ್ವ)",
        rashi: "",
        height: 0,
        nakshatra: "",
        charanaPada: "",
        howDidYouKnow: "",
        email: "",
        phone: "",
        alternatePhone: "",
        communicationAddress: "",
        residenceAddress: "",
        fatherName: "",
        fatherProfession: "",
        motherName: "",
        motherProfession: "",
        aboutBrideGroom: "",
        diet: [],
        hobbies: [],
        expectations: "",
        reference1Name: "",
        reference1PhoneNumber: "",
        reference2Name: "",
        reference2PhoneNumber: "",
        siblings: "",
        workingStatus: "",
        education: "",
        profession: "",
        designation: "",
        currentCompany: "",
        annualIncome: 0,
        countryLivingIn: "",

        // Partner Preferences
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
        preferredHobbies: []
    });

    const generateProfileId = (name, phone) => {
        if (!name || !phone || name.length < 2 || phone.length < 5) return "";
        const namePrefix = name.substring(0, 2).toUpperCase();
        const phoneDigits = phone.replace(/\D/g, '');
        let randomDigits = "";
        if (phoneDigits.length >= 5) {
            const positions = [];
            while (positions.length < 5) {
                const pos = Math.floor(Math.random() * phoneDigits.length);
                if (!positions.includes(pos)) positions.push(pos);
            }
            positions.sort((a, b) => a - b);
            for (const pos of positions) randomDigits += phoneDigits[pos];
        }
        return `${namePrefix}${randomDigits}`;
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

    if (name === "profileId") return prevData;

    // Handle time field
    if (name === "timeOfBirth") {
      newData[name] = value;
      return newData;
    }

    // ✅ Handle arrays (Multiselect or Slider ranges)
    if (Array.isArray(value)) {
      // For slider ranges (ageRange, heightRange, preferredIncomeRange), keep as numbers
      if (name === "ageRange" || name === "heightRange" || name === "preferredIncomeRange") {
        newData[name] = value; // Keep as array of numbers
      } else {
        // For multiselect arrays, convert to strings
        newData[name] = value.map((v) =>
          typeof v === "string" ? v : v.label || v.value || ""
        );
      }
      return newData;
    }

    // ✅ Safely handle scalar values with possible missing `type`
    if (type === "number") {
      newData[name] = value ? parseFloat(value) || 0 : 0;
    } else if (type === "date") {
      newData[name] = value || "";
    } else {
      newData[name] = value || "";
    }

    // Auto-generate profileId if both name and phone are present
    if ((name === "name" || name === "phone") &&
        (name === "name" ? value : prevData.name) &&
        (name === "phone" ? value : prevData.phone)) {
      const newProfileId = generateProfileId(
        name === "name" ? value : prevData.name,
        name === "phone" ? value : prevData.phone
      );
      if (newProfileId) newData.profileId = newProfileId;
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
