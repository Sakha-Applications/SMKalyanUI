import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Autocomplete, CircularProgress, MenuItem } from "@mui/material";
import FormNavigation from "../FormNavigation";
import axios from "axios";
import getBaseUrl from '../../utils/GetUrl';
import countryData from "country-telephone-data"; // Import country-telephone-data


// Define countryCodes globally within this file, similar to ContactDetailsTab
const countryCodes = countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2
}));

const ModifyProfileFamilyDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex, isActive }) => {
    // Father's Profession state
    const [isFatherProfessionLoading, setIsFatherProfessionLoading] = useState(false);
    const [fatherProfessionError, setFatherProfessionError] = useState(null);
    const [professionOptions, setProfessionOptions] = useState([]);
    const [fatherProfessionInputValue, setFatherProfessionInputValue] = useState('');
    const [fatherProfessionSelectedValue, setFatherProfessionSelectedValue] = useState(null);
    
    // Mother's Profession state
    const [isMotherProfessionLoading, setIsMotherProfessionLoading] = useState(false);
    const [motherProfessionError, setMotherProfessionError] = useState(null);
    const [motherProfessionInputValue, setMotherProfessionInputValue] = useState('');
    const [motherProfessionSelectedValue, setMotherProfessionSelectedValue] = useState(null);

    // Initialize selected values if formData has them
    useEffect(() => {
        // Initialize Father's Profession value
        if (formData.fatherProfession && !fatherProfessionSelectedValue) {
            setFatherProfessionSelectedValue({
                label: formData.fatherProfession,
                value: formData.fatherProfession
            });
            setFatherProfessionInputValue(formData.fatherProfession);
        }
        
        // Initialize Mother's Profession value
        if (formData.motherProfession && !motherProfessionSelectedValue) {
            setMotherProfessionSelectedValue({
                label: formData.motherProfession,
                value: formData.motherProfession
            });
            setMotherProfessionInputValue(formData.motherProfession);
        }
    }, [formData]);

    // Search professions when father profession input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (fatherProfessionInputValue && fatherProfessionInputValue.length >= 2) {
                searchProfessions(fatherProfessionInputValue, "fatherProfession");
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [fatherProfessionInputValue]);

    // Search professions when mother profession input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (motherProfessionInputValue && motherProfessionInputValue.length >= 2) {
                searchProfessions(motherProfessionInputValue, "motherProfession");
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [motherProfessionInputValue]);

    // Function to search professions
    const searchProfessions = async (searchText, fieldType) => {
        if (!searchText || searchText.length < 2) return;
        
        // Set loading state based on field type
        if (fieldType === "fatherProfession") {
            setIsFatherProfessionLoading(true);
            setFatherProfessionError(null);
        } else {
            setIsMotherProfessionLoading(true);
            setMotherProfessionError(null);
        }
        
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${getBaseUrl()}/api//profession?search=${encodeURIComponent(searchText)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (Array.isArray(response.data)) {
                // Map to options with NAMES as values, not IDs
                const options = response.data.map((item) => ({
                    label: item.ProfessionName,
                    value: item.ProfessionName // Store name instead of ID
                }));
                
                // Update professions list
                setProfessionOptions(options);
            } else {
                console.error(`Unexpected ${fieldType} response format:`, response.data);
                
                // Set error based on field type
                if (fieldType === "fatherProfession") {
                    setFatherProfessionError("Invalid data format received");
                } else {
                    setMotherProfessionError("Invalid data format received");
                }
            }
        } catch (error) {
            console.error(`Error searching ${fieldType}:`, error);
            
            // Set error based on field type
            if (fieldType === "fatherProfession") {
                setFatherProfessionError(`Failed to search professions: ${error.message}`);
            } else {
                setMotherProfessionError(`Failed to search professions: ${error.message}`);
            }
        } finally {
            // Clear loading state based on field type
            if (fieldType === "fatherProfession") {
                setIsFatherProfessionLoading(false);
            } else {
                setIsMotherProfessionLoading(false);
            }
        }
    };

    // Initial loading of professions
    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${getBaseUrl()}/api//profession`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (Array.isArray(response.data)) {
                    // Map to options with NAMES as values, not IDs
                    const options = response.data.map((item) => ({
                        label: item.ProfessionName,
                        value: item.ProfessionName // Store name instead of ID
                    }));
                    setProfessionOptions(options);
                }
            } catch (error) {
                console.error("Error fetching professions:", error);
                setFatherProfessionError("Failed to load professions");
                setMotherProfessionError("Failed to load professions");
            }
        };
        
        fetchProfessions();
    }, []);

    // Handle selection of father's profession
    const handleFatherProfessionChange = (event, newValue) => {
        setFatherProfessionSelectedValue(newValue);
        
        // Update the parent form data with the value (name, not ID)
        const syntheticEvent = {
            target: {
                name: 'fatherProfession',
                value: newValue ? newValue.value : '' // Store profession name directly
            }
        };
        handleChange(syntheticEvent);
    };

    // Handle selection of mother's profession
    const handleMotherProfessionChange = (event, newValue) => {
        setMotherProfessionSelectedValue(newValue);
        
        // Update the parent form data with the value (name, not ID)
        const syntheticEvent = {
            target: {
                name: 'motherProfession',
                value: newValue ? newValue.value : '' // Store profession name directly
            }
        };
        handleChange(syntheticEvent);
    };

    // Helper function for handling reference phone number changes
const handleReferencePhoneChange = (e) => {
    const { name, value } = e.target;
    // The name will be 'reference1PhoneNumber' or 'reference2PhoneNumber'
    // The corresponding country code field will be 'reference1CountryCode' or 'reference2CountryCode'
     const countryCodeFieldName = name.replace('PhoneNumber', 'CountryCode');
    const combinedPhoneFieldName = name.replace('PhoneNumber', 'Phone');
    
    const countryCode = formData[countryCodeFieldName] || "";
    const fullPhone = countryCode + value;

    // Determine the combined phone number field name (e.g., 'reference1Phone')
    

    // Update the combined phone number in formData
 handleChange({ target: { name: combinedPhoneFieldName, value: fullPhone } });
    // Update the specific phone number field (e.g., 'reference1PhoneNumber')
    handleChange({ target: { name, value } });
};

// Helper function for handling reference country code changes
const handleReferenceCountryCodeChange = (e) => {
    const { name, value } = e.target;
    // The name will be 'reference1CountryCode' or 'reference2CountryCode'
    // The corresponding phone number field will be 'reference1PhoneNumber' or 'reference2PhoneNumber'
 const phoneNumberFieldName = name.replace('CountryCode', 'PhoneNumber');
    const combinedPhoneFieldName = name.replace('CountryCode', 'Phone');

     const number = formData[phoneNumberFieldName] || "";
    const fullPhone = value + number;

    // Determine the combined phone number field name (e.g., 'reference1Phone')
    
    // Update the combined phone number in formData
    handleChange({ target: { name: combinedPhoneFieldName, value: fullPhone } });
    // Update the specific country code field (e.g., 'reference1CountryCode')
    handleChange({ target: { name, value } });
};

    // Prevent rendering if tab is not active
    if (!isActive) return null;

    return (
        <Box
            sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4-column grid
                gap: 3,
                alignItems: "center",
                p: 4,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 2,
                maxWidth: "150%",
                margin: "auto"
            }}
        >
            {/* Father's Name */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Father's Name:</Typography>
            <TextField 
                name="fatherName" 
                value={formData.fatherName || ""} 
                onChange={handleChange} 
                fullWidth 
                sx={{ backgroundColor: "#fff", borderRadius: 1 }} 
            />

            {/* Father's Profession - AUTOCOMPLETE VERSION */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Father's Profession:</Typography>
            <Autocomplete
                value={fatherProfessionSelectedValue}
                onChange={handleFatherProfessionChange}
                inputValue={fatherProfessionInputValue}
                onInputChange={(event, newInputValue) => {
                    setFatherProfessionInputValue(newInputValue);
                }}
                options={professionOptions}
                loading={isFatherProfessionLoading}
                loadingText="Searching..."
                noOptionsText={fatherProfessionInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                freeSolo // Allow custom values
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={fatherProfessionError || "Start typing to search professions"}
                        error={!!fatherProfessionError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isFatherProfessionLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Mother's Name */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother's Name:</Typography>
            <TextField 
                name="motherName" 
                value={formData.motherName || ""} 
                onChange={handleChange} 
                fullWidth 
                sx={{ backgroundColor: "#fff", borderRadius: 1 }} 
            />

            {/* Mother's Profession - AUTOCOMPLETE VERSION */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother's Profession:</Typography>
            <Autocomplete
                value={motherProfessionSelectedValue}
                onChange={handleMotherProfessionChange}
                inputValue={motherProfessionInputValue}
                onInputChange={(event, newInputValue) => {
                    setMotherProfessionInputValue(newInputValue);
                }}
                options={professionOptions}
                loading={isMotherProfessionLoading}
                loadingText="Searching..."
                noOptionsText={motherProfessionInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                freeSolo // Allow custom values
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={motherProfessionError || "Start typing to search professions"}
                        error={!!motherProfessionError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isMotherProfessionLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

{/* NEW FIELD: About the bride/bridegroom */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>
    About the bride/bridegroom:
    <br />
    ವಧು/ವರ ರ ಬಗ್ಗೆ ವಿವರ (ಅವರ ಕುಟುಂಬ, ಹವ್ಯಾಸ, ಅಪೇಕ್ಷೆ, ಜೀವನ ಶೈಲಿ, ಧಾರ್ಮಿಕ/ಸಾಮಾಜಿಕ ಚಿಂತನೆಗಳ ಬಗ್ಗೆ ಕೆಲವು ವಿಷಯ ತಿಳಿಸಿ)
</Typography>
<TextField
    name="aboutBrideGroom" // Use the new field name
    value={formData.aboutBrideGroom || ""} // Bind to the new formData field
    onChange={handleChange}
    fullWidth
    multiline
    rows={4} // Similar to expectations
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
/>


            {/* Your Expectations */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Your Expectations:</Typography>
            <TextField 
                name="expectations" 
                value={formData.expectations || ""} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={4} 
                sx={{ backgroundColor: "#fff", borderRadius: 1 }} 
            />

            {/* Sibling Details */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sibling Details:</Typography>
            <TextField 
                name="siblings" 
                value={formData.siblings || ""} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={4} 
                sx={{ backgroundColor: "#fff", borderRadius: 1 }} 
            />

{/* NEW FIELD: Reference 1 */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>
    Reference 1 - Provide name and phone number:
    <br />
    1 ವಧು/ವರ ನ/ಕುಟುಂಬದ ಬಗ್ಗೆ ಚೆನ್ನಾಗಿ ಪರಿಚಯ ವಿರುವವರ ಹೆಸರು, ದೂರವಾಣಿ ವಿವರ
</Typography>
<TextField
    name="reference1Name"
    value={formData.reference1Name || ""}
    onChange={handleChange}
    fullWidth
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} // Span across remaining columns
/>

{/* Reference 1 Phone Number with Country Code */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Reference 1 Phone:</Typography>
<TextField
    select
    name="reference1CountryCode"
    value={formData.reference1CountryCode || "+91"}
    onChange={handleReferenceCountryCodeChange} // Use new handler
    fullWidth
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 1" }} // Occupy 1 column
>
    {countryCodes.map((option) => (
        <MenuItem key={option.iso2 + option.code} value={option.code}>
            {option.label}
        </MenuItem>
    ))}
</TextField>
<TextField
    name="reference1PhoneNumber"
    value={formData.reference1PhoneNumber || ""}
    onChange={handleReferencePhoneChange} // Use new handler
    fullWidth
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "3 / span 2" }} // Occupy 2 columns
/>

{/* NEW FIELD: Reference 2 */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>
    Reference 2 - Provide name and phone number:
    <br />
    2 ವಧು/ವರ ನ/ಕುಟುಂಬದ ಬಗ್ಗೆ ಚೆನ್ನಾಗಿ ಪರಿಚಯ ವಿರುವವರ ಹೆಸರು, ದೂರವಾಣಿ ವಿವರ
</Typography>
<TextField
    name="reference2Name"
    value={formData.reference2Name || ""}
    onChange={handleChange}
    fullWidth
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
/>

{/* Reference 2 Phone Number with Country Code */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Reference 2 Phone:</Typography>
<TextField
    select
    name="reference2CountryCode"
    value={formData.reference2CountryCode || "+91"}
    onChange={handleReferenceCountryCodeChange} // Use new handler
    fullWidth
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 1" }}
>
    {countryCodes.map((option) => (
        <MenuItem key={option.iso2 + option.code} value={option.code}>
            {option.label}
        </MenuItem>
    ))}
</TextField>
<TextField
    name="reference2PhoneNumber"
    value={formData.reference2PhoneNumber || ""}
    onChange={handleReferencePhoneChange} // Use new handler
    fullWidth
    sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "3 / span 2" }}
/>




            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};
  
export default ModifyProfileFamilyDetailsTab;