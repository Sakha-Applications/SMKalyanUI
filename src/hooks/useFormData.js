import { useState } from "react";
import dayjs from "dayjs";

const useFormData = () => {
    const [formData, setFormData] = useState({
        id: 0,
        profileId: "",
        name: "",
        profileCreatedFor: "",
        profileFor: "",
        motherTongue: "",
        nativePlace: "",
        currentLocation: "",
        profileStatus: "",
        marriedStatus: "",
        shareDetailsOnPlatform: "", // Initial default value
        gotra: "",
        guruMatha: "",
        dob: null,
        timeOfBirth: "",
        placeOfBirth: "",
        currentAge: 0, // Auto-calculated
        subCaste: "",
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
        annualIncome: 0
    });

    // Generate Profile ID
    const generateProfileId = (name, phone) => {
        if (!name || !phone || name.length < 2 || phone.length < 5) return "";
        
        // Get first 2 characters of name
        const namePrefix = name.substring(0, 2).toUpperCase();
        
        // Get 5 random digits from phone number
        const phoneDigits = phone.replace(/\D/g, ''); // Remove non-digits
        let randomDigits = "";
        
        if (phoneDigits.length >= 5) {
            // Generate 5 random positions within the phone number
            const positions = [];
            while (positions.length < 5) {
                const pos = Math.floor(Math.random() * phoneDigits.length);
                if (!positions.includes(pos)) {
                positions.push(pos);
                }
            }
            
            // Sort positions to maintain the original order of digits
            positions.sort((a, b) => a - b);
            
            // Extract digits at those positions
            for (const pos of positions) {
                randomDigits += phoneDigits[pos];
            }
        }
        
        return `${namePrefix}${randomDigits}`;
    };

    // Format time
    function formatTime(time) {
        if (!time) return "";
        
        // Strip any non-digit or non-colon characters
        const cleanInput = time.replace(/[^\d:]/g, '');
        
        // If it has exactly 2 colons, it's likely already in HH:MM:SS format
        if ((cleanInput.match(/:/g) || []).length === 2) {
          const parts = cleanInput.split(':');
          // Validate each part
          if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length <= 2) {
            // Format each part correctly
            const hours = parts[0].padStart(2, '0');
            const minutes = parts[1].padStart(2, '0');
            const seconds = parts[2].padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
          }
        }
        
        // If it's a pure numeric input (like "123456")
        if (/^\d+$/.test(cleanInput)) {
          const digits = cleanInput.padStart(6, '0').slice(0, 6);
          return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
        }
        
        // Handle partial formats with colons
        const parts = cleanInput.split(':');
        const hours = parts[0] ? parts[0].padStart(2, '0').slice(0, 2) : '00';
        const minutes = parts[1] ? parts[1].padStart(2, '0').slice(0, 2) : '00';
        const seconds = parts[2] ? parts[2].padStart(2, '0').slice(0, 2) : '00';
        
        return `${hours}:${minutes}:${seconds}`;
    }

    const handleChange = (event) => {
        const { name, value, type } = event.target;
        
        setFormData((prevData) => {
            let newData = { ...prevData };
            
            if (name === "timeOfBirth") {
                // Only format when the input loses focus or user presses Enter
                // For normal typing, just store the raw input
                newData[name] = value;
            } else if (name === "profileId") {
                // Don't update profileId from direct input
                return prevData;
            } else {
                newData[name] = type === "number"
                    ? value ? parseFloat(value) || 0 : 0
                    : type === "date"
                    ? value || ""
                    : value || "";
            }
            
            // Auto-generate profileId when name or phone is updated
            if ((name === "name" || name === "phone") && 
                (name === "name" ? value : prevData.name) && 
                (name === "phone" ? value : prevData.phone)) {
                
                const newProfileId = generateProfileId(
                    name === "name" ? value : prevData.name,
                    name === "phone" ? value : prevData.phone
                );
                
                if (newProfileId) {
                    newData.profileId = newProfileId;
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
        setFormData(prev => ({
            ...prev,
            dob: dob, // Use formatted dob from DatePicker
            currentAge: dob ? dayjs().diff(dayjs(dob), "year") : 0 // Calculate Age
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