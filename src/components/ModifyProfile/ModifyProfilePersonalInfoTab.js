import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Grid, FormControl, Select, Autocomplete, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FormNavigation from "../FormNavigation";
import useApiData from "../../hooks/useApiData";
import axios from "axios";
import getBaseUrl from '../../utils/GetUrl';
import FullWidthHobbiesGrid from "../common/options/FullWidthHobbiesGrid";
import { hobbyOptions } from "../common/options/hobbyOptions";

const ModifyProfilePersonalInfoTab = ({ formData, handleChange, handleDOBChange, handleTimeBlur, tabIndex, setTabIndex }) => {
    const { isLoading, error, gotraOptions, rashiOptions, nakshatraOptions } = useApiData();

    // GuruMatha state
    const [isGuruMathaLoading, setIsGuruMathaLoading] = useState(false);
    const [guruMathaError, setGuruMathaError] = useState(null);
    const [guruMathaOptions, setGuruMathaOptions] = useState([]);
    const [guruMathaInputValue, setGuruMathaInputValue] = useState('');
    const [guruMathaSelectedValue, setGuruMathaSelectedValue] = useState(null);

// Place of Birth state
const [isPlaceOfBirthLoading, setIsPlaceOfBirthLoading] = useState(false);
const [placeOfBirthError, setPlaceOfBirthError] = useState(null);
const [placeOfBirthOptions, setPlaceOfBirthOptions] = useState([]);
const [placeOfBirthInputValue, setPlaceOfBirthInputValue] = useState('');
const [placeOfBirthSelectedValue, setPlaceOfBirthSelectedValue] = useState(null);


    // Height state parsed from formData
    const [heightFeet, setHeightFeet] = useState('');
    const [heightInches, setHeightInches] = useState('');

    // Calculate current age when DOB changes
    useEffect(() => {
        if (formData.dob) {
            const birthDate = dayjs(formData.dob);
            const today = dayjs();
            const age = today.diff(birthDate, 'year');
            
            // Update currentAge in formData
            const syntheticEvent = {
                target: {
                    name: 'currentAge',
                    value: age.toString()
                }
            };
            handleChange(syntheticEvent);
        }
    }, [formData.dob]);

    // Initialize selected guru matha if formData has it
    useEffect(() => {
        if (formData.guruMatha && !guruMathaSelectedValue) {
            console.log('Initializing GuruMatha with:', formData.guruMatha, typeof formData.guruMatha);
            
            // If guruMatha is already an object with label/value properties
            if (typeof formData.guruMatha === 'object' && formData.guruMatha !== null) {
                if (formData.guruMatha.label && formData.guruMatha.value) {
                    setGuruMathaSelectedValue(formData.guruMatha);
                    setGuruMathaInputValue(formData.guruMatha.label);
                }
            }
            // If guruMatha is a string (name), use it directly
            else if (typeof formData.guruMatha === 'string' && formData.guruMatha.trim()) {
                const guruMathaName = formData.guruMatha.trim();
                setGuruMathaSelectedValue({
                    label: guruMathaName,
                    value: guruMathaName
                });
                setGuruMathaInputValue(guruMathaName);
            }
            // If it's a numeric ID, fetch the corresponding name
            else if (typeof formData.guruMatha === 'number' || 
                     (typeof formData.guruMatha === 'string' && !isNaN(parseInt(formData.guruMatha)))) {
                const fetchGuruMathaById = async () => {
                    try {
                        console.log('Fetching GuruMatha by ID:', formData.guruMatha);
                        // Fixed: Remove double slash in URL
                        const response = await axios.get(`${getBaseUrl()}/api/guru-matha`);
                        
                        if (Array.isArray(response.data)) {
                            const guruMathaId = parseInt(formData.guruMatha);
                            const selectedOption = response.data.find(opt => 
                                opt.id === guruMathaId || 
                                opt.GuruMathaId === guruMathaId ||
                                parseInt(opt.id) === guruMathaId ||
                                parseInt(opt.GuruMathaId) === guruMathaId
                            );
                            
                            if (selectedOption) {
                                const guruMathaName = selectedOption.GuruMathaName || selectedOption.name || selectedOption.label;
                                console.log('Found GuruMatha:', guruMathaName);
                                
                                setGuruMathaSelectedValue({
                                    label: guruMathaName,
                                    value: guruMathaName
                                });
                                setGuruMathaInputValue(guruMathaName);
                                
                                // Update the formData with the name instead of ID
                                const syntheticEvent = {
                                    target: {
                                        name: 'guruMatha',
                                        value: guruMathaName
                                    }
                                };
                                handleChange(syntheticEvent);
                            } else {
                                console.warn('GuruMatha not found for ID:', formData.guruMatha);
                                setGuruMathaError('GuruMatha not found');
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching guru matha by ID:", error);
                        setGuruMathaError(`Failed to fetch guru matha: ${error.message}`);
                    }
                };

                fetchGuruMathaById();
            }
        }
    }, [formData.guruMatha, guruMathaSelectedValue, handleChange]);

// Initialize selected place of birth if formData has it
useEffect(() => {
    if (formData.placeOfBirth && !placeOfBirthSelectedValue) {
        console.log('Initializing PlaceOfBirth with:', formData.placeOfBirth, typeof formData.placeOfBirth);
        
        // If placeOfBirth is already an object with label/value properties
        if (typeof formData.placeOfBirth === 'object' && formData.placeOfBirth !== null) {
            if (formData.placeOfBirth.label && formData.placeOfBirth.value) {
                setPlaceOfBirthSelectedValue(formData.placeOfBirth);
                setPlaceOfBirthInputValue(formData.placeOfBirth.label);
            }
        }
        // If placeOfBirth is a string (name), use it directly
        else if (typeof formData.placeOfBirth === 'string' && formData.placeOfBirth.trim()) {
            const placeOfBirthName = formData.placeOfBirth.trim();
            setPlaceOfBirthSelectedValue({
                label: placeOfBirthName,
                value: placeOfBirthName
            });
            setPlaceOfBirthInputValue(placeOfBirthName);
        }
        // If it's a numeric ID, fetch the corresponding name
        else if (typeof formData.placeOfBirth === 'number' || 
                 (typeof formData.placeOfBirth === 'string' && !isNaN(parseInt(formData.placeOfBirth)))) {
            const fetchPlaceOfBirthById = async () => {
                try {
                    console.log('Fetching PlaceOfBirth by ID:', formData.placeOfBirth);
                    const response = await axios.get(`${getBaseUrl()}/api/native-places`);
                    
                    if (Array.isArray(response.data)) {
                        const placeOfBirthId = parseInt(formData.placeOfBirth);
                        const selectedOption = response.data.find(opt => 
                            opt.id === placeOfBirthId || 
                            parseInt(opt.id) === placeOfBirthId
                        );
                        
                        if (selectedOption) {
                            const placeOfBirthName = selectedOption.nativeplace || selectedOption.name || selectedOption.label;
                            console.log('Found PlaceOfBirth:', placeOfBirthName);
                            
                            setPlaceOfBirthSelectedValue({
                                label: placeOfBirthName,
                                value: placeOfBirthName
                            });
                            setPlaceOfBirthInputValue(placeOfBirthName);
                            
                            // Update the formData with the name instead of ID
                            const syntheticEvent = {
                                target: {
                                    name: 'placeOfBirth',
                                    value: placeOfBirthName
                                }
                            };
                            handleChange(syntheticEvent);
                        } else {
                            console.warn('PlaceOfBirth not found for ID:', formData.placeOfBirth);
                            setPlaceOfBirthError('Place of Birth not found');
                        }
                    }
                } catch (error) {
                    console.error("Error fetching place of birth by ID:", error);
                    setPlaceOfBirthError(`Failed to fetch place of birth: ${error.message}`);
                }
            };

            fetchPlaceOfBirthById();
        }
    }
}, [formData.placeOfBirth, placeOfBirthSelectedValue, handleChange]);





    // Parse height from formData.height
    useEffect(() => {
        if (formData.height && typeof formData.height === 'string') {
            const heightRegex = /(\d+)\s*feet\s*(\d+)\s*inches/i;
            const match = formData.height.match(heightRegex);
            
            if (match) {
                const feetValue = `${match[1]} feet`;
                const inchesValue = `${match[2]} inches`;
                
                // Only update if different from current values
                if (feetValue !== formData.heightFeet) {
                    setHeightFeet(feetValue);
                    const feetEvent = {
                        target: {
                            name: 'heightFeet',
                            value: feetValue
                        }
                    };
                    handleChange(feetEvent);
                }
                
                if (inchesValue !== formData.heightInches) {
                    setHeightInches(inchesValue);
                    const inchesEvent = {
                        target: {
                            name: 'heightInches',
                            value: inchesValue
                        }
                    };
                    handleChange(inchesEvent);
                }
            }
        }
    }, [formData.height, formData.heightFeet, formData.heightInches, handleChange]);

    // Search guru matha when input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (guruMathaInputValue.length >= 2) {
                searchGuruMatha(guruMathaInputValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [guruMathaInputValue]);

    // Search place of birth when input changes
useEffect(() => {
    const timer = setTimeout(() => {
        if (placeOfBirthInputValue.length >= 2) {
            searchPlacesOfBirth(placeOfBirthInputValue);
        }
    }, 300);

    return () => clearTimeout(timer);
}, [placeOfBirthInputValue]);


    // Function to search guru matha options
    const searchGuruMatha = async (searchText) => {
        if (!searchText || searchText.length < 2) return;

        setIsGuruMathaLoading(true);
        setGuruMathaError(null);

        try {
            // Fixed: Remove double slash in URL
            const response = await axios.get(`${getBaseUrl()}/api/guru-matha?search=${encodeURIComponent(searchText)}`);

            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.GuruMathaName || item.name || item.label,
                    value: item.GuruMathaName || item.name || item.label,
                    id: item.id || item.GuruMathaId // Keep ID for reference if needed
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

    // Handle selection of guru matha
    const handleGuruMathaChange = (event, newValue) => {
        console.log('GuruMatha selected:', newValue);
        setGuruMathaSelectedValue(newValue);

        // Update the parent form data with the Name (label)
        const syntheticEvent = {
            target: {
                name: 'guruMatha',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };

    // Handle input change for guru matha
    const handleGuruMathaInputChange = (event, newInputValue) => {
        console.log('GuruMatha input changed:', newInputValue);
        setGuruMathaInputValue(newInputValue);
    };

    // Function to search place of birth options
const searchPlacesOfBirth = async (searchText) => {
    if (!searchText || searchText.length < 2) return;

    setIsPlaceOfBirthLoading(true);
    setPlaceOfBirthError(null);

    try {
        const response = await axios.get(`${getBaseUrl()}/api/native-places?search=${encodeURIComponent(searchText)}`);

        if (Array.isArray(response.data)) {
            const options = response.data.map((item) => ({
                label: item.nativeplace || item.name || item.label,
                value: item.nativeplace || item.name || item.label,
                id: item.id // Keep ID for reference if needed
            }));
            setPlaceOfBirthOptions(options);
        } else {
            console.error("Unexpected place of birth response format:", response.data);
            setPlaceOfBirthError("Invalid data format received");
        }
    } catch (error) {
        console.error("Error searching place of birth:", error);
        setPlaceOfBirthError(`Failed to search place of birth: ${error.message}`);
    } finally {
        setIsPlaceOfBirthLoading(false);
    }
};

    // Handle selection of place of birth
const handlePlaceOfBirthChange = (event, newValue) => {
    console.log('PlaceOfBirth selected:', newValue);
    setPlaceOfBirthSelectedValue(newValue);

    // Update the parent form data with the Name (label)
    const syntheticEvent = {
        target: {
            name: 'placeOfBirth',
            value: newValue ? newValue.value : ''
        }
    };
    handleChange(syntheticEvent);
};

// Handle input change for place of birth
const handlePlaceOfBirthInputChange = (event, newInputValue) => {
    console.log('PlaceOfBirth input changed:', newInputValue);
    setPlaceOfBirthInputValue(newInputValue);
};



    
    // Handle Height changes
    const handleHeightChange = (event) => {
        const { name, value } = event.target;
        
        // Update the local state
        if (name === 'heightFeet') {
            setHeightFeet(value);
        } else if (name === 'heightInches') {
            setHeightInches(value);
        }
        
        // Update the field in formData
        handleChange(event);
        
        // Only update the combined height if both feet and inches are selected
        const feet = name === 'heightFeet' ? value : formData.heightFeet;
        const inches = name === 'heightInches' ? value : formData.heightInches;
        
        if (feet && inches) {
            // Create a synthetic event to update the combined 'height' field in the parent
            const syntheticEvent = {
                target: {
                    name: 'height',
                    value: `${feet} ${inches}`.trim()
                }
            };
            handleChange(syntheticEvent);
        }
    };

    return (
        <Box sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4 columns: Label (2fr), Input (8fr)
            gap: 3,
            alignItems: "center",
            p: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "150%",
            margin: "auto"
        }}>
            {/* Gotra */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Gotra: <span style={{ color: "red" }}>*</span></Typography>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
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
                        <MenuItem disabled>No options available</MenuItem>
                    )}
                </TextField>
            )}

            {/* Sub Caste */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sub Caste: <span style={{ color: "red" }}>*</span></Typography>
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



            {/* Date of Birth (Read-only) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Date of Birth:</Typography>
            <TextField
                name="dob"
                value={formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : ""}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

            {/* Time of Birth */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Time of Birth: <span style={{ color: "red" }}>*</span></Typography>
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

            {/* Current Age (Read-only) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Age:</Typography>
            <TextField
                name="currentAge"
                value={formData.currentAge ?? ""}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

{/* Place of Birth */}
<Typography sx={{ fontWeight: "bold", color: "#444" }}>Place of Birth: <span style={{ color: "red" }}>*</span></Typography>
<Autocomplete
    value={placeOfBirthSelectedValue}
    onChange={handlePlaceOfBirthChange}
    inputValue={placeOfBirthInputValue}
    onInputChange={handlePlaceOfBirthInputChange}
    options={placeOfBirthOptions}
    loading={isPlaceOfBirthLoading}
    loadingText="Searching..."
    noOptionsText={placeOfBirthInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
    fullWidth
    freeSolo // Allow custom values
    isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.value === value.value || option.label === value.label;
    }}
    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
    renderInput={(params) => (
        <TextField
            {...params}
            required
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
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>GuruMatha: <span style={{ color: "red" }}>*</span></Typography>
            <Autocomplete
                value={guruMathaSelectedValue}
                onChange={handleGuruMathaChange}
                inputValue={guruMathaInputValue}
                onInputChange={handleGuruMathaInputChange}
                options={guruMathaOptions}
                loading={isGuruMathaLoading}
                loadingText="Searching..."
                noOptionsText={guruMathaInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                freeSolo // Allow custom values
                isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;
                    return option.value === value.value || option.label === value.label;
                }}
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
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Rashi: <span style={{ color: "red" }}>*</span></Typography>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
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
                        <MenuItem disabled>No options available</MenuItem>
                    )}
                </TextField>
            )}

            {/* Height */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Height: <span style={{ color: "red" }}>*</span></Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} >
                    <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                        <Select
                            name="heightFeet"
                            value={formData.heightFeet ?? ""}
                            onChange={handleHeightChange}
                            displayEmpty
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
                            onChange={handleHeightChange}
                            displayEmpty
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
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Nakshatra: <span style={{ color: "red" }}>*</span></Typography>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
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
                        <MenuItem disabled>No options available</MenuItem>
                    )}
                </TextField>
            )}

            {/* Charana Pada */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Charana Pada: <span style={{ color: "red" }}>*</span></Typography>
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

export default ModifyProfilePersonalInfoTab;