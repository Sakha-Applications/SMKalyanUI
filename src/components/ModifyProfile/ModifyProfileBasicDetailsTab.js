import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, FormControl, Select, MenuItem, Autocomplete, CircularProgress } from "@mui/material";
import FormNavigation from "../FormNavigation";
import axios from "axios";
import config from '../../config';

const ModifyProfileBasicDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex }) => {
    // Mother Tongue state
    const [isMotherTongueLoading, setIsMotherTongueLoading] = useState(false);
    const [motherTongueError, setMotherTongueError] = useState(null);
    const [motherTongueOptions, setMotherTongueOptions] = useState([]);
    const [motherTongueInputValue, setMotherTongueInputValue] = useState('');
    const [motherTongueSelectedValue, setMotherTongueSelectedValue] = useState(null);
    
    // Native Place state
    const [isNativePlaceLoading, setIsNativePlaceLoading] = useState(false);
    const [nativePlaceError, setNativePlaceError] = useState(null);
    const [nativePlaceOptions, setNativePlaceOptions] = useState([]);
    const [nativePlaceInputValue, setNativePlaceInputValue] = useState('');
    const [nativePlaceSelectedValue, setNativePlaceSelectedValue] = useState(null);
    
    // Current Location state
    const [isCurrentLocationLoading, setIsCurrentLocationLoading] = useState(false);
    const [currentLocationError, setCurrentLocationError] = useState(null);
    const [currentLocationOptions, setCurrentLocationOptions] = useState([]);
    const [currentLocationInputValue, setCurrentLocationInputValue] = useState('');
    const [currentLocationSelectedValue, setCurrentLocationSelectedValue] = useState(null);
    
    // Initialize selected values if formData has them
    useEffect(() => {
        // Initialize Mother Tongue value
        if (formData.mother_tongue && !motherTongueSelectedValue) {
            setMotherTongueSelectedValue({
                label: formData.mother_tongue,
                value: formData.mother_tongue
            });
            setMotherTongueInputValue(formData.mother_tongue);
        }
        
        // Initialize Native Place value
        if (formData.native_place && !nativePlaceSelectedValue) {
            setNativePlaceSelectedValue({
                label: formData.native_place,
                value: formData.native_place
            });
            setNativePlaceInputValue(formData.native_place);
        }
        
        // Initialize Current Location value
        if (formData.current_location && !currentLocationSelectedValue) {
            setCurrentLocationSelectedValue({
                label: formData.current_location,
                value: formData.current_location
            });
            setCurrentLocationInputValue(formData.current_location);
        }
    }, [formData]);
    
    // Fetch mother tongues on component mount
    useEffect(() => {
        const fetchMotherTongues = async () => {
            try {
                setIsMotherTongueLoading(true);
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${config.apiUrl}/mother-tongues`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Fetched mother tongues:", response.data);
                
                // Transform data for autocomplete
                const options = response.data.map(mt => ({
                    label: mt.mother_tongue,
                    value: mt.mother_tongue
                }));
                
                setMotherTongueOptions(options);
                setIsMotherTongueLoading(false);
            } catch (error) {
                console.error("Error fetching mother tongues:", error);
                setMotherTongueError("Failed to load mother tongues");
                setIsMotherTongueLoading(false);
            }
        };
        
        fetchMotherTongues();
    }, []);
    
    // Search native places when input changes fo
    useEffect(() => {
        const timer = setTimeout(() => {
            if (nativePlaceInputValue.length >= 2) {
                searchNativePlaces(nativePlaceInputValue);
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [nativePlaceInputValue]);
    
    // Search current locations when input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentLocationInputValue.length >= 2) {
                searchCurrentLocations(currentLocationInputValue);
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [currentLocationInputValue]);
    
    // Function to search native places
    const searchNativePlaces = async (searchText) => {
        if (!searchText || searchText.length < 2) return;
        
        setIsNativePlaceLoading(true);
        setNativePlaceError(null);
        
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${config.apiUrl}/native-places?search=${encodeURIComponent(searchText)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Native place search response:", response.data);
            
            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.nativeplace,
                    value: item.nativeplace
                }));
                
                setNativePlaceOptions(options);
            } else {
                console.error("Unexpected native place response format:", response.data);
                setNativePlaceError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error searching native places:", error);
            setNativePlaceError(`Failed to search native places: ${error.message}`);
        } finally {
            setIsNativePlaceLoading(false);
        }
    };
    
    // Function to search current locations (similar to native places)
    const searchCurrentLocations = async (searchText) => {
        if (!searchText || searchText.length < 2) return;
        
        setIsCurrentLocationLoading(true);
        setCurrentLocationError(null);
        
        try {
            const token = sessionStorage.getItem('token');
            // This assumes you have a similar API endpoint for current locations
            // If not, you might need to use the same endpoint as native places
            const response = await axios.get(`${config.apiUrl}/native-places?search=${encodeURIComponent(searchText)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Current location search response:", response.data);
            
            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.nativeplace, // Assuming the same structure as native places
                    value: item.nativeplace
                }));
                
                setCurrentLocationOptions(options);
            } else {
                console.error("Unexpected current location response format:", response.data);
                setCurrentLocationError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error searching current locations:", error);
            setCurrentLocationError(`Failed to search current locations: ${error.message}`);
        } finally {
            setIsCurrentLocationLoading(false);
        }
    };
    
    // Handle selection of mother tongue
    const handleMotherTongueChange = (event, newValue) => {
        setMotherTongueSelectedValue(newValue);
        
        // Update the parent form data with the value (store the name, not the ID)
        const syntheticEvent = {
            target: {
                name: 'mother_tongue',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };
    
    // Handle selection of native place
    const handleNativePlaceChange = (event, newValue) => {
        setNativePlaceSelectedValue(newValue);
        
        // Update the parent form data with the value
        const syntheticEvent = {
            target: {
                name: 'native_place',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };
    
    // Handle selection of current location
    const handleCurrentLocationChange = (event, newValue) => {
        setCurrentLocationSelectedValue(newValue);
        
        // Update the parent form data with the value
        const syntheticEvent = {
            target: {
                name: 'current_location',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };

    return (
        <Box sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4 columns: Label (2fr), Input (8fr)
            gap: 3,
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "100%",
            margin: "auto"
        }}>
            {/* ID (Auto-generated) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>ID (Auto-generated):</Typography>
            <TextField
                value={formData.id ?? ""}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

            {/* Profile ID */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
            <TextField
                name="profile_id"
                value={formData.profile_id ?? ""} // Access profile_id from formData
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

            {/* Name */}
            <Typography sx={{ fontWeight: "bold", color: "#333", gridColumn: "1" }}>Name:</Typography>
            <TextField
                name="name"
                value={formData.name ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / 4" }} // Span from column 2 to 4
            />
            <Box />

            {/* Profile Created For */}
            <Typography sx={{ fontWeight: "bold", color: "#444", gridColumn: "1" }}>Profile Created For:</Typography>
            <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2" }}>
                <Select name="profile_created_for" value={formData.profile_created_for || ""} onChange={handleChange}>
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
                <Select name="profile_for" value={formData.profile_for || ""} onChange={handleChange}>
                    <MenuItem value="Bride">Bride</MenuItem>
                    <MenuItem value="Bridegroom">Bridegroom</MenuItem>
                </Select>
            </FormControl>

            {/* Mother Tongue - Changed to Autocomplete */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother Tongue:</Typography>
            <Autocomplete
                value={motherTongueSelectedValue}
                onChange={handleMotherTongueChange}
                inputValue={motherTongueInputValue}
                onInputChange={(event, newInputValue) => {
                    setMotherTongueInputValue(newInputValue);
                }}
                options={motherTongueOptions}
                loading={isMotherTongueLoading}
                loadingText="Loading..."
                noOptionsText="No options found"
                fullWidth
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={motherTongueError || ""}
                        error={!!motherTongueError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isMotherTongueLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Native Place - Changed to Autocomplete */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Native Place:</Typography>
            <Autocomplete
                value={nativePlaceSelectedValue}
                onChange={handleNativePlaceChange}
                inputValue={nativePlaceInputValue}
                onInputChange={(event, newInputValue) => {
                    setNativePlaceInputValue(newInputValue);
                }}
                options={nativePlaceOptions}
                loading={isNativePlaceLoading}
                loadingText="Searching..."
                noOptionsText={nativePlaceInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                freeSolo // Allow custom values
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={nativePlaceError || "Start typing to search native places"}
                        error={!!nativePlaceError}
                        required
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isNativePlaceLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Current Location - Changed to Autocomplete */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Location:</Typography>
            <Autocomplete
                value={currentLocationSelectedValue}
                onChange={handleCurrentLocationChange}
                inputValue={currentLocationInputValue}
                onInputChange={(event, newInputValue) => {
                    setCurrentLocationInputValue(newInputValue);
                }}
                options={currentLocationOptions}
                loading={isCurrentLocationLoading}
                loadingText="Searching..."
                noOptionsText={currentLocationInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                freeSolo // Allow custom values
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={currentLocationError || "Start typing to search locations"}
                        error={!!currentLocationError}
                        required
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isCurrentLocationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Profile Status */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Status:</Typography>
            <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                <Select name="profile_status" value={formData.profile_status || ""} onChange={handleChange}>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
            </FormControl>

            {/* Married Status */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Married Status:</Typography>
            <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                <Select name="married_status" value={formData.married_status || ""} onChange={handleChange}>
                    <MenuItem value="Single (Never Married)">Single (Never Married)</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                    <MenuItem value="Separated">Separated</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
            </FormControl>

            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};

export default ModifyProfileBasicDetailsTab;