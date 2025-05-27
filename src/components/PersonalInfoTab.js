import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Grid, FormControl, Select, Autocomplete, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FormNavigation from "./FormNavigation";
import useApiData from "../hooks/useApiData";
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

const PersonalInfoTab = ({ formData, handleChange, handleDOBChange, handleTimeBlur, tabIndex, setTabIndex }) => {
    const { isLoading, error, gotraOptions, rashiOptions, nakshatraOptions } = useApiData();
    
    // GuruMatha state
    const [isGuruMathaLoading, setIsGuruMathaLoading] = useState(false);
    const [guruMathaError, setGuruMathaError] = useState(null);
    const [guruMathaOptions, setGuruMathaOptions] = useState([]);
    const [guruMathaInputValue, setGuruMathaInputValue] = useState('');
    const [guruMathaSelectedValue, setGuruMathaSelectedValue] = useState(null);

    // Effect to initialize selected guru matha if formData has it
    useEffect(() => {
        if (formData.guruMatha && !guruMathaSelectedValue) {
            // If guruMatha is already an object with value property, use it directly
            if (typeof formData.guruMatha === 'object' && formData.guruMatha.value) {
                setGuruMathaSelectedValue(formData.guruMatha);
            } 
            // If guruMatha is already a string (name), create an object
            else if (typeof formData.guruMatha === 'string' && formData.guruMatha) {
                setGuruMathaSelectedValue({
                    label: formData.guruMatha,
                    value: formData.guruMatha  // In this case, the value is the name itself
                });
            }
            // If it's a numeric ID, fetch the name
            else if (!isNaN(formData.guruMatha)) {
                const fetchGuruMathaDetails = async () => {
                    try {
                        // FIX: Removed extra slash
                        const response = await axios.get(`${getBaseUrl()}/api/guru-matha`);
                        const options = response.data;
                        const selectedOption = options.find(opt => opt.id === formData.guruMatha);
                        if (selectedOption) {
                            setGuruMathaSelectedValue({
                                label: selectedOption.GuruMathaName,
                                value: selectedOption.guruMatha
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching guru matha details:", error);
                    }
                };
                
                fetchGuruMathaDetails();
            }
        }
    }, [formData.guruMatha]);

    // Search guru matha when input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (guruMathaInputValue.length >= 2) {
                searchGuruMatha(guruMathaInputValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [guruMathaInputValue]);

    // Function to search guru matha options
    const searchGuruMatha = async (searchText) => {
        if (!searchText || searchText.length < 2) return;
        
        setIsGuruMathaLoading(true);
        setGuruMathaError(null);
        
        try {
            // FIX: Removed extra slash
            const response = await axios.get(`${getBaseUrl()}/api/guru-matha?search=${encodeURIComponent(searchText)}`);
            console.log("GuruMatha search response:", response.data);
            
            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.GuruMathaName,
                    value: item.id
                }));
                setGuruMathaOptions(options);
            } else {
                console.error("Unexpected guru matha response format:", response.data);
                setGuruMathaError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error searching guru matha:", error);
            setGuruMathaError(`Failed to search guru matha: ${error.message}`);
        } finally {
            setIsGuruMathaLoading(false);
        }
    };

// --- NEW STATE FOR PLACE OF BIRTH ---
    const [isPlaceOfBirthLoading, setIsPlaceOfBirthLoading] = useState(false);
    const [placeOfBirthError, setPlaceOfBirthError] = useState(null);
    const [placeOfBirthOptions, setPlaceOfBirthOptions] = useState([]);
    const [placeOfBirthInputValue, setPlaceOfBirthInputValue] = useState('');
    const [placeOfBirthSelectedValue, setPlaceOfBirthSelectedValue] = useState(null);

// --- NEW useEffect for initializing placeOfBirth from formData ---
useEffect(() => {
    if (formData.placeOfBirth && !placeOfBirthSelectedValue) {
        if (typeof formData.placeOfBirth === 'string' && formData.placeOfBirth) {
            setPlaceOfBirthSelectedValue({
                label: formData.placeOfBirth,
                value: formData.placeOfBirth
            });
            setPlaceOfBirthInputValue(formData.placeOfBirth);
        }
        // If it's a numeric ID, fetch the name (assuming your API can resolve ID to name)
        else if (!isNaN(formData.placeOfBirth)) {
            const fetchPlaceOfBirthDetails = async () => {
                try {
                    // This line was already correct regarding the slash, no change needed here.
                    const response = await axios.get(`${getBaseUrl()}/api/native-places`);
                    const places = response.data;
                    const selectedPlace = places.find(place => place.id === formData.placeOfBirth);
                    if (selectedPlace) {
                        setPlaceOfBirthSelectedValue({
                            label: selectedPlace.nativeplace, // Assuming 'nativeplace' is the name field
                            value: selectedPlace.nativeplace,
                            id: selectedPlace.id
                        });
                        setPlaceOfBirthInputValue(selectedPlace.nativeplace);
                        // Update form data with the name instead of ID
                        const syntheticEvent = {
                            target: {
                                name: 'placeOfBirth',
                                value: selectedPlace.nativeplace
                            }
                        };
                        handleChange(syntheticEvent);
                    }
                } catch (error) {
                    console.error("Error fetching place of birth details:", error);
                }
            };
            fetchPlaceOfBirthDetails();
        }
    }
}, [formData.placeOfBirth, placeOfBirthSelectedValue, handleChange]); // Added handleChange to dependencies

// --- NEW useEffect for searching place of birth when input changes ---
useEffect(() => {
    const timer = setTimeout(() => {
        if (placeOfBirthInputValue.length >= 2) {
            searchPlacesOfBirth(placeOfBirthInputValue);
        }
    }, 300);

    return () => clearTimeout(timer);
}, [placeOfBirthInputValue]);

    // --- NEW FUNCTION to search places of birth ---
const searchPlacesOfBirth = async (searchText) => {
    if (!searchText || searchText.length < 2) return;

    setIsPlaceOfBirthLoading(true);
    setPlaceOfBirthError(null);

    try {
        // FIX: Removed HTML tags and escaped characters.
        const response = await axios.get(`${getBaseUrl()}/api/native-places?search=${encodeURIComponent(searchText)}`);
        console.log("Place of birth search response:", response.data);

        if (Array.isArray(response.data)) {
            const options = response.data.map((item) => ({
                label: item.nativeplace, // Assuming 'nativeplace' is the field for place names
                value: item.nativeplace, // Storing the name as value as per your other autocomplete fields
                id: item.id // Store ID separately if needed
            }));
            setPlaceOfBirthOptions(options);
        } else {
            console.error("Unexpected place of birth response format:", response.data);
            setPlaceOfBirthError("Invalid data format received");
        }
    } catch (error) {
        console.error("Error searching places of birth:", error);
        setPlaceOfBirthError(`Failed to search places of birth: ${error.message}`);
    } finally {
        setIsPlaceOfBirthLoading(false);
    }
};



// --- NEW HANDLER for place of birth selection ---
const handlePlaceOfBirthChange = (event, newValue) => {
    setPlaceOfBirthSelectedValue(newValue);

    // Update the parent form data with the value (name of the place)
    const syntheticEvent = {
        target: {
            name: 'placeOfBirth',
            value: newValue ? newValue.value : ''
        }
    };
    handleChange(syntheticEvent);

    // If you need to store the ID in formData as well (e.g., placeOfBirthId)
    // if (newValue && newValue.id) {
    //     const idEvent = {
    //         target: {
    //             name: 'placeOfBirthId',
    //             value: newValue.id
    //         }
    //     };
    //     handleChange(idEvent);
    // }
};

    // Handle selection of guru matha
    const handleGuruMathaChange = (event, newValue) => {
        setGuruMathaSelectedValue(newValue);
        
        // Update the parent form data with the ID
        const syntheticEvent = {
            target: {
                name: 'guruMatha',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };




    // Handle height changes separately for feet and inches
    const handleHeightChange = (e) => {
        const { name, value } = e.target;
        const heightData = { ...formData };
        
        if (name === "heightFeet") {
            heightData.heightFeet = value;
        } else if (name === "heightInches") {
            heightData.heightInches = value;
        }
        
        // Combine feet and inches for the height field
        if (heightData.heightFeet && heightData.heightInches) {
            heightData.height = `${heightData.heightFeet}'${heightData.heightInches}"`;
        } else {
            heightData.height = "";
        }
        
        // Use the existing handleChange function to update the form
        handleChange({
            target: {
                name: "height",
                value: heightData.height
            }
        });
    };

    return (
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
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Gotra:</Typography>

            {isLoading ? (
                <Typography>Loading...</Typography> // Show loading message
            ) : error ? (
                <Typography color="error">{error}</Typography> // Show error message if API fails
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
                        <MenuItem disabled>No options available</MenuItem> // Handle empty list
                    )}
                </TextField>
            )}

{/* Sub Caste */}
  <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sub Caste:</Typography>
  <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
    <Select
      name="subCaste"
      value={formData.subCaste || "Madhva (ಮಾಧ್ವ)"} // Set default value
      onChange={handleChange}
    >
      <MenuItem value="Madhva (ಮಾಧ್ವ)">Madhva (ಮಾಧ್ವ)</MenuItem>
      <MenuItem value="Smarta (ಸ್ಮಾರ್ತ)">Smarta (ಸ್ಮಾರ್ತ)</MenuItem>
      <MenuItem value="Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)">Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)</MenuItem>
      <MenuItem value="Gaudiya Vaishnava (ಗೌಡೀಯ ವೈಷ್ಣವ)">Gaudiya Vaishnava (ಗೌಡೀಯ ವೈಷ್ಣವ)</MenuItem>
      <MenuItem value="Deshastha (ದೇಶಸ್ಥ)">Deshastha (ದೇಶಸ್ಥ)</MenuItem>
      <MenuItem value="Hoysala Karnataka Brahmin (ಹೊಯ್ಸಳ ಕರ್ನಾಟಕ ಬ್ರಾಹ್ಮಣ)">Hoysala Karnataka Brahmin (ಹೊಯ್ಸಳ ಕರ್ನಾಟಕ ಬ್ರಾಹ್ಮಣ)</MenuItem>
      <MenuItem value="Hebbar (ಹೆಬ್ಬಾರ್)">Hebbar (ಹೆಬ್ಬಾರ್)</MenuItem>
      <MenuItem value="Shivalli (ಶಿವಳ್ಳಿ)">Shivalli (ಶಿವಳ್ಳಿ)</MenuItem>
      <MenuItem value="Iyer (ಅಯ್ಯರ್)">Iyer (ಅಯ್ಯರ್)</MenuItem>
      <MenuItem value="Iyengar (ಅಯ್ಯಂಗಾರ್)">Iyengar (ಅಯ್ಯಂಗಾರ್)</MenuItem>
      <MenuItem value="Tuluva Brahmins (ತುಳುಬ್ರಾಹ್ಮಣರು)">Tuluva Brahmins (ತುಳುಬ್ರಾಹ್ಮಣರು)</MenuItem>
      <MenuItem value="Others (ಇತರರು)">Others (ಇತರರು)</MenuItem>
    </Select>
  </FormControl>



            

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
{/* NEW FIELD: Place of Birth - AUTOCOMPLETE VERSION */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Place of Birth:</Typography>
        <Autocomplete
            value={placeOfBirthSelectedValue}
            onChange={handlePlaceOfBirthChange}
            inputValue={placeOfBirthInputValue}
            onInputChange={(event, newInputValue) => {
                setPlaceOfBirthInputValue(newInputValue);
            }}
            options={placeOfBirthOptions}
            loading={isPlaceOfBirthLoading}
            loadingText="Searching..."
            noOptionsText={placeOfBirthInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
            fullWidth
            freeSolo // Allow custom values
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    required // Mark as required if it is
                    helperText={placeOfBirthError || "Start typing to search your place of birth"}
                    error={!!placeOfBirthError}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isPlaceOfBirthLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />


{/* GuruMatha - AUTOCOMPLETE VERSION */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>GuruMatha:</Typography>
            <Autocomplete
                value={guruMathaSelectedValue}
                onChange={handleGuruMathaChange}
                inputValue={guruMathaInputValue}
                onInputChange={(event, newInputValue) => {
                    setGuruMathaInputValue(newInputValue);
                }}
                options={guruMathaOptions}
                loading={isGuruMathaLoading}
                loadingText="Searching..."
                noOptionsText={guruMathaInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        required
                        helperText={guruMathaError || "Start typing to search guru matha"}
                        error={!!guruMathaError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isGuruMathaLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
  


            {/* Rashi */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Rashi:</Typography>

            {isLoading ? (
                <Typography>Loading...</Typography> // Show loading message
            ) : error ? (
                <Typography color="error">{error}</Typography> // Show error message if API fails
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
                        <MenuItem disabled>No options available</MenuItem> // Handle empty list
                    )}
                </TextField>
            )}

            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Height:</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} >
                    <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                        <Select
                            name="heightFeet"
                            value={formData.heightFeet ?? ""}
                            onChange={handleChange} // Use the single handleChange
                            displayEmpty // Add this prop
                        >
                            <MenuItem value="" disabled>
                                Select Feet
                            </MenuItem>
                            {[4, 5, 6].map((feet) => (
                                <MenuItem key={feet} value={`${feet} feet`}>
                                    {feet} feet
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                        <Select
                            name="heightInches"
                            value={formData.heightInches ?? ""}
                            onChange={handleChange} // Use the single handleChange
                            displayEmpty // Add this prop
                        >
                            <MenuItem value="" disabled>
                                Select Inches
                            </MenuItem>
                            {[...Array(12)].map((_, i) => (
                                <MenuItem key={i + 1} value={`${i + 1} inches`}>
                                    {i + 1} inches
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Nakshatra */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Nakshatra:</Typography>

            {isLoading ? (
                <Typography>Loading...</Typography> // Show loading message
            ) : error ? (
                <Typography color="error">{error}</Typography> // Show error message if API fails
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
                        <MenuItem disabled>No options available</MenuItem> // Handle empty list
                    )}
                </TextField>
            )}

            {/* Charana Pada - Modified to be a dropdown */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Charana Pada:</Typography>
            <TextField 
                name="charanaPada" 
                value={formData.charanaPada ?? ""} 
                onChange={handleChange} 
                fullWidth 
                required 
                select
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            >
                <MenuItem value="1st Pada 1ನೇ ಪಾದ">1st Pada 1ನೇ ಪಾದ</MenuItem>
                <MenuItem value="2nd Pada 2ನೇ ಪಾದ">2nd Pada 2ನೇ ಪಾದ</MenuItem>
                <MenuItem value="3rd Pada 3ನೇ ಪಾದ">3rd Pada 3ನೇ ಪಾದ</MenuItem>
                <MenuItem value="4th Pada 4ನೇ ಪಾದ">4th Pada 4ನೇ ಪಾದ</MenuItem>
            </TextField>
            
            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};

export default PersonalInfoTab;