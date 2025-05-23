import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Grid, FormControl, Select, Autocomplete, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FormNavigation from "../FormNavigation";
import useApiData from "../../hooks/useApiData";
import axios from "axios";
import config from '../../config';

const ModifyProfilePersonalInfoTab = ({ formData, handleChange, handleDOBChange, handleTimeBlur, tabIndex, setTabIndex }) => {
    const { isLoading, error, gotraOptions, rashiOptions, nakshatraOptions } = useApiData();

    // GuruMatha state
    const [isGuruMathaLoading, setIsGuruMathaLoading] = useState(false);
    const [guruMathaError, setGuruMathaError] = useState(null);
    const [guruMathaOptions, setGuruMathaOptions] = useState([]);
    const [guruMathaInputValue, setGuruMathaInputValue] = useState('');
    const [guruMathaSelectedValue, setGuruMathaSelectedValue] = useState(null);

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
            // If guruMatha is already an object with value property, use it directly
            if (typeof formData.guruMatha === 'object' && formData.guruMatha.value) {
                setGuruMathaSelectedValue(formData.guruMatha);
                setGuruMathaInputValue(formData.guruMatha.label || '');
            }
            // If guruMatha is already a string (name), create an object
            else if (typeof formData.guruMatha === 'string' && formData.guruMatha) {
                setGuruMathaSelectedValue({
                    label: formData.guruMatha,
                    value: formData.guruMatha  // In this case, the value is the name itself
                });
                setGuruMathaInputValue(formData.guruMatha);
            }
            // If it's a numeric ID, fetch the name
            else if (!isNaN(formData.guruMatha)) {
                const fetchGuruMathaDetails = async () => {
                    try {
                        const response = await axios.get(`${config.apiUrl}/guru-matha`);
                        const options = response.data;
                        const selectedOption = options.find(opt => opt.id === formData.guruMatha);
                        if (selectedOption) {
                            const guruMathaName = selectedOption.GuruMathaName;
                            setGuruMathaSelectedValue({
                                label: guruMathaName,
                                value: guruMathaName // Store the name here
                            });
                            setGuruMathaInputValue(guruMathaName);
                            
                            // Update the formData with the name
                            const syntheticEvent = {
                                target: {
                                    name: 'guruMatha',
                                    value: guruMathaName
                                }
                            };
                            handleChange(syntheticEvent);
                        }
                    } catch (error) {
                        console.error("Error fetching guru matha details:", error);
                    }
                };

                fetchGuruMathaDetails();
            }
        }
    }, [formData.guruMatha]);

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
    }, [formData.height]);

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
            const response = await axios.get(`http://localhost:3001/api/guru-matha?search=${encodeURIComponent(searchText)}`);

            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.GuruMathaName,
                    value: item.GuruMathaName // Store the name here
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
        setGuruMathaSelectedValue(newValue);

        // Update the parent form data with the Name (label)
        const syntheticEvent = {
            target: {
                name: 'guruMatha',
                value: newValue ? newValue.value : '' // Store the label (name)
            }
        };
        handleChange(syntheticEvent);
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

            {/* GuruMatha - AUTOCOMPLETE VERSION */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>GuruMatha: <span style={{ color: "red" }}>*</span></Typography>
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
                freeSolo // Allow custom values
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