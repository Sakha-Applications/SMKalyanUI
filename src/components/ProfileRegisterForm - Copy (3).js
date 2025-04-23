import React, { useState } from "react";
import { Tabs, Tab, Box, TextField, Button, Paper, Typography } from "@mui/material";
import { FormControl, Select, MenuItem } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";  // Ensure useEffect is imported

const ProfileDetails = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [gotraOptions, setGotraOptions] = useState([]);
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
        gotra: "",
        guruMatha: "",
        dob: null,
        timeOfBirth: "",
        currentAge: 0, // Auto-calculated
        subCaste: "",
        rashi: "",
        height: 0,
        nakshatra: "",
        charanaPada: "",
        email: "",
        phone: "",
        alternatePhone: "",
        communicationAddress: "",
        residenceAddress: "",
        fatherName: "",
        fatherProfession: "",
        motherName: "",
        motherProfession: "",
        expectations: "",
        siblings: "",
        workingStatus: "",
        education: "",
        profession: "",
        designation: "",
        currentCompany: "",
        annualIncome: 0
    });
        
    const [isLoading, setIsLoading] = useState(true); // for loading state
const [error, setError] = useState(null);         // for error handling
const [rashiOptions, setRashiOptions] = useState([]);   
const [nakshatraOptions, setNakshatraOptions] = useState([]);   

useEffect(() => {
    axios.get("http://localhost:3001/api/rashis")
        .then((response) => {
            console.log("Rashis API Response:", response.data);
            if (Array.isArray(response.data)) {
                setRashiOptions(response.data);
            } else {
                console.error("Unexpected Rashi response format:", response.data);
                setError("Invalid Rashi data format received.");
            }
        })
        .catch((error) => {
            console.error("Error fetching Rashis:", error);
            setError("Failed to load Rashis.");
        });
}, []);

useEffect(() => {
    axios.get("http://localhost:3001/api/nakshatras")
        .then((response) => {
            console.log("Nakshatras API Response:", response.data);
            if (Array.isArray(response.data)) {
                setNakshatraOptions(response.data);
            } else {
                console.error("Unexpected Nakshatra response format:", response.data);
                setError("Invalid Nakshatra data format received.");
            }
        })
        .catch((error) => {
            console.error("Error fetching Nakshatra:", error);
            setError("Failed to load Nakshatra.");
        });
}, []);


useEffect(() => {
            axios.get("http://localhost:3001/api/gotras")
                .then((response) => {
                    console.log("Gotras API Response:", response.data); // ✅ Debug log
                    console.log("First gotra item:", response.data[0]); // ✅ Add this line
                    setGotraOptions(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching Gotras:", error);
                });
        }, []);
        
        useEffect(() => {
    axios.get("http://localhost:3001/api/gotras")
        .then((response) => {
            console.log("Gotras API Response:", response.data); // ✅ Debug log
            
            if (Array.isArray(response.data)) { // ✅ Ensure response is an array
                setGotraOptions(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setError("Invalid data format received.");
            }
        })
        .catch((error) => {
            console.error("Error fetching Gotras:", error);
            setError("Failed to load Gotras.");
        })
        .finally(() => {
            setIsLoading(false); // ✅ Stop loading after API call completes
        });
}, []);
    
    const tabLabels = ["Basic Details", "Personal Info", "Contact Details", "Family Details", "Career & Education"];

    // Add this function near your other helper functions (like formatTime)
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
    const handleDOBChange = (dob) => {
        setFormData({
            ...formData,
            dob: dob, // ✅ Use formatted dob from DatePicker
            currentAge: dob ? dayjs().diff(dayjs(dob), "year") : "", // ✅ Calculate Age
        });
    };

    // Update the handleSubmit function to validate Date of Birth
    const handleSubmit = async () => {
        // Validate phone number
        if (!/^\d{10}$/.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }
        
        // Validate Date of Birth
        if (!formData.dob) {
            alert("Date of Birth is mandatory.");
            setTabIndex(1); // Switch to tab with DOB
            return;
        }
        
        try {
            await axios.post("http://localhost:3001/api/addProfile", formData);
            alert("Profile created successfully! Profile ID: ${response.data.profileId}");
            
            setFormData({
                profileId: "",
                name: "", profileCreatedFor: "", profileFor: "", motherTongue: "", nativePlace: "",
                currentLocation: "", profileStatus: "", marriedStatus: "", gotra: "", guruMatha: "", dob: null, timeOfBirth: "",
                currentAge: 0, subCaste: "", rashi: "", height: 0, nakshatra: "", charanaPada: "",
                email: "", phone: "", alternatePhone: "", communicationAddress: "", residenceAddress: "",
                fatherName: "", fatherProfession: "", motherName: "", motherProfession: "",
                expectations: "", siblings: "", workingStatus: "", education: "", profession: "",
                designation: "", currentCompany: "", annualIncome: 0
            });
            setTabIndex(0);
        } catch (error) {
            alert("Failed to create profile.");
        }
    };

    return (
        <div>
        <Paper elevation={3} sx={{ maxWidth: "80%" , mx: "auto", p: 3, mt: 4, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h5" align="center" gutterBottom>
                Profile Details
            </Typography>
            <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} variant="fullWidth">
                {tabLabels.map((label, index) => (<Tab key={index} label={label} />))}
            </Tabs>

            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1200px 1fr", gap: 2, alignItems: "center" }}>
            
            {tabIndex === 0 && ( 
    <Box sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4 columns: Label (1fr), Input (2fr)
        gap: 3,
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: "100%", // Increased width for better visibility
        margin: "auto"
    }}>
        {/* ID (Auto-generated) */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>ID (Auto-generated):</Typography>
        <TextField value={formData.id ?? ""} fullWidth InputProps={{ readOnly: true }} sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }} />

{/* Profile ID */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
<TextField 
  name="profileId" 
  value={formData.profileId ?? ""} 
  fullWidth 
  InputProps={{ readOnly: true }}
  sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }} 
/>


{/* Name Label in Column 1 */}
<Typography sx={{ fontWeight: "bold", color: "#333" }}>Name:</Typography>

{/* Name Input Field spanning Columns 2, 3, and 4 */}
<TextField 
    name="name" 
    value={formData.name ?? ""} 
    onChange={handleChange} 
    fullWidth 
    required 
    sx={{ 
        backgroundColor: "#fff", 
        borderRadius: 1, 
        gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
    }} 
/>
  
        {/* Profile Created For */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Created For:</Typography>
        <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
            <Select name="profileCreatedFor" value={formData.profileCreatedFor || ""} onChange={handleChange}>
                <MenuItem value="Self">Self</MenuItem>
                <MenuItem value="Son">Son</MenuItem>
                <MenuItem value="Daughter">Daughter</MenuItem>
                <MenuItem value="Sibling">Sibling</MenuItem>
                <MenuItem value="Relatives">Relatives</MenuItem>
            </Select>
        </FormControl>

        {/* This Profile is For */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>This Profile is For:</Typography>
        <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
            <Select name="profileFor" value={formData.profileFor  || ""} onChange={handleChange}>
                <MenuItem value="Bride">Bride</MenuItem>
                <MenuItem value="Bridegroom">Bridegroom</MenuItem>
            </Select>
        </FormControl>

        {/* Mother Tongue */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother Tongue:</Typography>
        <TextField name="motherTongue" value={formData.motherTongue ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

        {/* Native Place */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Native Place:</Typography>
        <TextField name="nativePlace" value={formData.nativePlace ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

        {/* Current Location */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Location:</Typography>
        <TextField name="currentLocation" value={formData.currentLocation ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

        {/* Profile Status */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Status:</Typography>
        <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
            <Select name="profileStatus" value={formData.profileStatus  || ""} onChange={handleChange}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
        </FormControl>

{/* Married Status */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Married Status:</Typography>
        <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
            <Select name="marriedStatus" value={formData.marriedStatus  || ""} onChange={handleChange}>
                <MenuItem value="Single (Never Married)">Single (Never Married)</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Separated">Separated</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
        </FormControl>



        <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 3, 
            gridColumn: "1 / span 4" // Make it span all columns
        }}>
            <Button 
                onClick={() => setTabIndex(tabIndex - 1)} 
                disabled={tabIndex === 0} 
                variant="contained" 
                color="secondary"
            >
                Back
            </Button>
            <Button 
                onClick={() => setTabIndex(tabIndex + 1)} 
                variant="contained" 
                color="primary"
            >
                Next
            </Button>
        </Box>



    </Box>
)}
    {tabIndex === 1 && (
        <Box sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4 columns
            gap: 3,
            alignItems: "center",
            p: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "150%", // Increased width
            margin: "auto"
        }}>
                {/* Gotra */}
                {/* Gotra */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Gotra:</Typography>

{isLoading ? (
    <Typography>Loading...</Typography> // ✅ Show loading message
) : error ? (
    <Typography color="error">{error}</Typography> // ✅ Show error message if API fails
) : (
    <TextField 
        name="gotra"
        value={formData.gotra ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        select
    >
        {gotraOptions.length > 0 ? (
            gotraOptions.map((gotra, index) => (
                <MenuItem key={index} value={gotra.gotraname}>
                    {gotra.gotraname}
                </MenuItem>
            ))
        ) : (
            <MenuItem disabled>No options available</MenuItem> // ✅ Handle empty list
        )}
    </TextField>
)}

            {/* GuruMatha */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>GuruMatha:</Typography>
            <TextField name="guruMatha" value={formData.guruMatha ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

  
{/* Date of Birth */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Date of Birth: <span style={{ color: "red" }}>*</span></Typography>

<LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
  <DatePicker
    views={["year", "month", "day"]}
    value={formData.dob ? dayjs(formData.dob) : null}
    onChange={(newValue) => {
      const formattedDOB = newValue ? newValue.format("YYYY-MM-DD") : null;
      handleDOBChange(formattedDOB);
    }}
    slotProps={{
      textField: {
        fullWidth: true,
        required: true,
        error: !formData.dob,
        helperText: !formData.dob ? "Date of Birth is required" : "",
        sx: { backgroundColor: "#fff", borderRadius: 1 },
      },
    }}
  />
</LocalizationProvider>

            {/* Time of Birth */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Time of Birth:</Typography>
            <TextField
              name="timeOfBirth"
              value={formData.timeOfBirth ?? ""}
              onChange={handleChange}
              onBlur={handleTimeBlur}
              helperText="Enter time in HH:MM:SS format"
              fullWidth
              required
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Current Age (Auto-calculated) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Age:</Typography>
            <TextField 
                name="currentAge" 
                value={formData.currentAge} 
                fullWidth   
                InputProps={{ readOnly: true }} 
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }} 
            />

            {/* Sub Caste */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sub Caste:</Typography>
            <TextField name="subCaste" value={formData.subCaste ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

            {/* Rashi */}

           
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Rashi:</Typography>

{isLoading ? (
    <Typography>Loading...</Typography> // ✅ Show loading message
) : error ? (
    <Typography color="error">{error}</Typography> // ✅ Show error message if API fails
) : (
    <TextField 
        name="rashi"
        value={formData.rashi ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        select
    >
        {rashiOptions.length > 0 ? (
            rashiOptions.map((rashi, index) => (
                <MenuItem key={index} value={rashi.rashiname}>
                    {rashi.rashiname}
                </MenuItem>
            ))
        ) : (
            <MenuItem disabled>No options available</MenuItem> // ✅ Handle empty list
        )}
    </TextField>
)}

            {/* Height */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Height:</Typography>
            <TextField name="height" value={formData.height ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />

{/* Rashi */}
{/* Nakshatra */}
           
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Nakshatra:</Typography>

{isLoading ? (
    <Typography>Loading...</Typography> // ✅ Show loading message
) : error ? (
    <Typography color="error">{error}</Typography> // ✅ Show error message if API fails
) : (
    <TextField 
        name="nakshatra"
        value={formData.nakshatra ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        select
    >
        {nakshatraOptions.length > 0 ? (
            nakshatraOptions.map((nakshatra, index) => (
                <MenuItem key={index} value={nakshatra.nakshatraname}>
                    {nakshatra.nakshatraname}
                </MenuItem>
            ))
        ) : (
            <MenuItem disabled>No options available</MenuItem> // ✅ Handle empty list
        )}
    </TextField>
)}

            {/* Nakshatra */}
            {/* Charana Pada */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Charana Pada:</Typography>
            <TextField name="charanaPada" value={formData.charanaPada ?? ""} onChange={handleChange} fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />
            <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 3, 
            gridColumn: "1 / span 4" // Make it span all columns
        }}>
            <Button 
                onClick={() => setTabIndex(tabIndex - 1)} 
                disabled={tabIndex === 0} 
                variant="contained" 
                color="secondary"
            >
                Back
            </Button>
            <Button 
                onClick={() => setTabIndex(tabIndex + 1)} 
                variant="contained" 
                color="primary"
            >
                Next
            </Button>
        </Box>

        </Box>
    )}

{tabIndex === 2 && (
    <Box sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4-column grid
        gap: 3,
        alignItems: "center",
        p: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: "150%", // Increased width for better visibility
        margin: "auto"
    }}>
        {/* Email */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Email ID:</Typography>
        <TextField 
            name="email" 
            type="email" 
            value={formData.email ?? ""} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ 
                backgroundColor: "#fff", 
                borderRadius: 1, 
                gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
            }} 
        />

        {/* Phone Number */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Phone Number:</Typography>
        <TextField 
            name="phone" 
            type="tel" 
            value={formData.phone ?? ""} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ backgroundColor: "#fff", borderRadius: 1 }} 
        />

        {/* Alternate Phone Number */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Alternate Phone Number:</Typography>
        <TextField 
            name="alternatePhone" 
            type="tel" 
            value={formData.alternatePhone ?? null} 
            onChange={handleChange} 
            fullWidth 
            sx={{ backgroundColor: "#fff", borderRadius: 1 }} 
        />

        {/* Communication Address */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Communication Address:</Typography>
        <TextField 
            name="communicationAddress" 
            value={formData.communicationAddress ?? ""} 
            onChange={handleChange} 
            fullWidth 
            multiline 
            rows={4} 
            required 
            sx={{ 
                backgroundColor: "#fff", 
                borderRadius: 1, 
                gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
            }} 
        />

        {/* Residence Address */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Residence Address:</Typography>
        <TextField 
            name="residenceAddress" 
            value={formData.residenceAddress ?? ""} 
            onChange={handleChange} 
            fullWidth 
            multiline 
            rows={4} 
            required 
            sx={{ 
                backgroundColor: "#fff", 
                borderRadius: 1, 
                gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
            }} 
        />

<Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 3, 
            gridColumn: "1 / span 4" // Make it span all columns
        }}>
            <Button 
                onClick={() => setTabIndex(tabIndex - 1)} 
                disabled={tabIndex === 0} 
                variant="contained" 
                color="secondary"
            >
                Back
            </Button>
            <Button 
                onClick={() => setTabIndex(tabIndex + 1)} 
                variant="contained" 
                color="primary"
            >
                Next
            </Button>
        </Box>
    </Box>
)}
                
                

                    {tabIndex === 3 && (
        <Box sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4-column grid
            gap: 3,
            alignItems: "center",
            p: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "150%", // Increased width for better visibility
            margin: "auto"
        }}>
            {/* Father's Name */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Father's Name:</Typography>
            <TextField 
                name="fatherName" 
                value={formData.fatherName ?? ""} 
                onChange={handleChange} 
                fullWidth 
                required 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
            />

            {/* Father's Profession */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Father's Profession:</Typography>
            <TextField 
                name="fatherProfession" 
                value={formData.fatherProfession ?? ""} 
                onChange={handleChange} 
                fullWidth 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
            />

            {/* Mother's Name */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother's Name:</Typography>
            <TextField 
                name="motherName" 
                value={formData.motherName ?? ""} 
                onChange={handleChange} 
                fullWidth 
                required 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
            />

            {/* Mother's Profession */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother's Profession:</Typography>
            <TextField 
                name="motherProfession" 
                value={formData.motherProfession ?? ""} 
                onChange={handleChange} 
                fullWidth 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
            />

            {/* Your Expectations */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Your Expectations:</Typography>
            <TextField 
                name="expectations" 
                value={formData.expectations ?? ""} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={4} 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
            />

            {/* Sibling Details */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sibling Details:</Typography>
            <TextField 
                name="siblings" 
                value={formData.siblings ?? ""} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={4} 
                required 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
            />
<Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 3, 
            gridColumn: "1 / span 4" // Make it span all columns
        }}>
            <Button 
                onClick={() => setTabIndex(tabIndex - 1)} 
                disabled={tabIndex === 0} 
                variant="contained" 
                color="secondary"
            >
                Back
            </Button>
            <Button 
                onClick={() => setTabIndex(tabIndex + 1)} 
                variant="contained" 
                color="primary"
            >
                Next
            </Button>
        </Box>


        </Box>
    )}


{tabIndex === 4 && (
    <Box sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4-column grid
        gap: 3,
        alignItems: "center",
        p: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: "150%", // Increased width for better visibility
        margin: "auto"
    }}>
        {/* Working Status */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Working Status:</Typography>
        <TextField 
            name="workingStatus" 
            value={formData.workingStatus ?? ""} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />

        {/* Education */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Education:</Typography>
        <TextField 
            name="education" 
            value={formData.education ?? ""} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />

        {/* Profession */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profession:</Typography>
        <TextField 
            name="profession" 
            value={formData.profession ?? ""} 
            onChange={handleChange} 
            fullWidth 
            sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />

        {/* Designation */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Designation:</Typography>
        <TextField 
            name="designation" 
            value={formData.designation ?? ""} 
            onChange={handleChange} 
            fullWidth 
            sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />

        {/* Current Company */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Company:</Typography>
        <TextField 
            name="currentCompany" 
            value={formData.currentCompany ?? ""} 
            onChange={handleChange} 
            fullWidth 
            sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />

        {/* Annual Income */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Annual Income:</Typography>
        <TextField 
            name="annualIncome" 
            type="number" 
            value={formData.annualIncome ?? ""} 
            onChange={handleChange} 
            fullWidth 
            sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
<Box sx={{ 
    display: "flex", 
    justifyContent: "space-between", 
    mt: 3, 
    gridColumn: "1 / span 4" 
}}>
    <Button 
        onClick={() => setTabIndex(tabIndex - 1)} 
        disabled={tabIndex === 0} 
        variant="contained" 
        color="secondary"
    >
        Back
    </Button>
    <Button 
        variant="contained" 
        color="success" 
        onClick={handleSubmit}
    >
        Submit
    </Button>
</Box>

    </Box>
)}

            </Box>
            
      
        </Paper>
        </div>
    );
};

export default ProfileDetails;      