import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Autocomplete, CircularProgress } from "@mui/material";
import FormNavigation from "./FormNavigation"; 
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

const FamilyDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex, isActive }) => {
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
    
    // Effect to initialize selected father's profession if formData has it
    useEffect(() => {
        if (formData.fatherProfession && !fatherProfessionSelectedValue) {
            if (typeof formData.fatherProfession === 'object' && formData.fatherProfession.value) {
                setFatherProfessionSelectedValue(formData.fatherProfession);
            } 
            else if (typeof formData.fatherProfession === 'string' && formData.fatherProfession) {
                setFatherProfessionSelectedValue({
                    label: formData.fatherProfession,
                    value: formData.fatherProfession
                });
            }
            else if (!isNaN(formData.fatherProfession)) {
                const fetchProfessionDetails = async () => {
                    try {
                        const response = await axios.get(`${getBaseUrl()}/api//profession`);
                        const professions = response.data;
                        const selectedProfession = professions.find(prof => prof.id === formData.fatherProfession);
                        if (selectedProfession) {
                            setFatherProfessionSelectedValue({
                                label: selectedProfession.ProfessionName,
                                value: selectedProfession.id
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching profession details:", error);
                    }
                };
                
                fetchProfessionDetails();
            }
        }
    }, [formData.fatherProfession]);

    // Effect to initialize selected mother's profession if formData has it
    useEffect(() => {
        if (formData.motherProfession && !motherProfessionSelectedValue) {
            if (typeof formData.motherProfession === 'object' && formData.motherProfession.value) {
                setMotherProfessionSelectedValue(formData.motherProfession);
            } 
            else if (typeof formData.motherProfession === 'string' && formData.motherProfession) {
                setMotherProfessionSelectedValue({
                    label: formData.motherProfession,
                    value: formData.motherProfession
                });
            }
            else if (!isNaN(formData.motherProfession)) {
                const fetchProfessionDetails = async () => {
                    try {
                        const response = await axios.get(`${getBaseUrl()}/api//profession`);
                        const professions = response.data;
                        const selectedProfession = professions.find(prof => prof.id === formData.motherProfession);
                        if (selectedProfession) {
                            setMotherProfessionSelectedValue({
                                label: selectedProfession.ProfessionName,
                                value: selectedProfession.id
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching profession details:", error);
                    }
                };
                
                fetchProfessionDetails();
            }
        }
    }, [formData.motherProfession]);

    // Search professions when father profession input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (fatherProfessionInputValue.length >= 2) {
                searchProfessions(fatherProfessionInputValue, "fatherProfession");
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [fatherProfessionInputValue]);

    // Search professions when mother profession input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (motherProfessionInputValue.length >= 2) {
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
            const response = await axios.get(`${getBaseUrl()}/api//profession?search=${encodeURIComponent(searchText)}`);
            console.log(`${fieldType} search response:`, response.data);
            
            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.ProfessionName,
                    value: item.id
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
                const response = await axios.get(`${getBaseUrl()}/api//profession`);
                if (Array.isArray(response.data)) {
                    const options = response.data.map((item) => ({
                        label: item.ProfessionName,
                        value: item.id
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
        
        // Update the parent form data with the value
        const syntheticEvent = {
            target: {
                name: 'fatherProfession',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };

    // Handle selection of mother's profession
    const handleMotherProfessionChange = (event, newValue) => {
        setMotherProfessionSelectedValue(newValue);
        
        // Update the parent form data with the value
        const syntheticEvent = {
            target: {
                name: 'motherProfession',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };

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
                value={formData.fatherName ?? ""} 
                onChange={handleChange} 
                fullWidth 
                required 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
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
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
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
                value={formData.motherName ?? ""} 
                onChange={handleChange} 
                fullWidth 
                required 
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
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
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
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
            
            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};
  
export default FamilyDetailsTab;