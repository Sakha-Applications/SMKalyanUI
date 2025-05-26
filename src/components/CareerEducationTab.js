import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button, MenuItem, Autocomplete, CircularProgress, FormControl, Select } from "@mui/material";
import FormNavigation from "./FormNavigation";
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

const CareerEducationTab = ({ formData, handleChange, handleSubmit, isActive, tabIndex, setTabIndex }) => {
    // Profession state
    const [isProfessionLoading, setIsProfessionLoading] = useState(false);
    const [professionError, setProfessionError] = useState(null);
    const [professionOptions, setProfessionOptions] = useState([]);
    const [professionInputValue, setProfessionInputValue] = useState('');
    const [professionSelectedValue, setProfessionSelectedValue] = useState(null);

    // Designation state
    const [isDesignationLoading, setIsDesignationLoading] = useState(false);
    const [designationError, setDesignationError] = useState(null);
    const [designationOptions, setDesignationOptions] = useState([]);
    const [designationInputValue, setDesignationInputValue] = useState('');
    const [designationSelectedValue, setDesignationSelectedValue] = useState(null);

    // Education state
    const [isEducationLoading, setIsEducationLoading] = useState(false);
    const [educationError, setEducationError] = useState(null);
    const [educationOptions, setEducationOptions] = useState([]);
    const [educationInputValue, setEducationInputValue] = useState('');
    const [educationSelectedValue, setEducationSelectedValue] = useState(null);

    // Working status options
    const workingStatusOptions = [
        { value: "Yes - ಹೌದು", label: "Yes - ಹೌದು" },
        { value: "No - ಇಲ್ಲ", label: "No - ಇಲ್ಲ" }
    ];

    // Effect to initialize selected profession if formData has it
    useEffect(() => {
        if (formData.profession && !professionSelectedValue) {
            if (typeof formData.profession === 'object' && formData.profession.value) {
                setProfessionSelectedValue(formData.profession);
            }
            else if (typeof formData.profession === 'string' && formData.profession) {
                setProfessionSelectedValue({
                    label: formData.profession,
                    value: formData.profession
                });
            }
            else if (!isNaN(formData.profession)) {
                const fetchProfessionDetails = async () => {
                    try {
                        const response = await axios.get(`${getBaseUrl()}/api//profession`);
                        const professions = response.data;
                        const selectedProfession = professions.find(prof => prof.id === formData.profession);
                        if (selectedProfession) {
                            setProfessionSelectedValue({
                                label: selectedProfession.ProfessionName,
                                value: selectedProfession.ProfessionName // Store name instead of ID
                            });

                            // When profession is initialized, fetch designations for it
                            if (selectedProfession.id) {
                                fetchDesignationsForProfession(selectedProfession.id);
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching profession details:", error);
                    }
                };

                fetchProfessionDetails();
            }
        }
    }, [formData.profession]);

    // Effect to initialize selected designation if formData has it
    useEffect(() => {
        if (formData.designation && !designationSelectedValue) {
            if (typeof formData.designation === 'object' && formData.designation.value) {
                setDesignationSelectedValue(formData.designation);
            }
            else if (typeof formData.designation === 'string' && formData.designation) {
                setDesignationSelectedValue({
                    label: formData.designation,
                    value: formData.designation
                });
            }
            else if (!isNaN(formData.designation)) {
                const fetchDesignationDetails = async () => {
                    try {
                        // If we already have professionSelectedValue, use its ID to fetch relevant designations
                        const professionId = professionSelectedValue?.id;
                        let url = `${getBaseUrl()}/api//designation`;

                        if (professionId) {
                            url += `?professionId=${professionId}`;
                        }

                        const response = await axios.get(url);
                        const designations = response.data;
                        const selectedDesignation = designations.find(desig => desig.id === formData.designation);

                        if (selectedDesignation) {
                            setDesignationSelectedValue({
                                label: selectedDesignation.DesignationName,
                                value: selectedDesignation.DesignationName // Store name instead of ID
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching designation details:", error);
                    }
                };

                fetchDesignationDetails();
            }
        }
    }, [formData.designation, professionSelectedValue]);

    // Effect to initialize selected education if formData has it
    useEffect(() => {
        if (formData.education && !educationSelectedValue) {
            if (typeof formData.education === 'object' && formData.education.value) {
                setEducationSelectedValue(formData.education);
            }
            else if (typeof formData.education === 'string' && formData.education) {
                setEducationSelectedValue({
                    label: formData.education,
                    value: formData.education
                });
            }
             else if (!isNaN(formData.education)) {
                const fetchEducationDetails = async () => {
                    try {
                        const response = await axios.get(`${getBaseUrl()}/api//education`);
                        const educations = response.data;
                        const selectedEducation = educations.find(edu => edu.id === formData.education);
                        if (selectedEducation) {
                            setEducationSelectedValue({
                                label: selectedEducation.EducationName,
                                value: selectedEducation.EducationName // Store name instead of ID
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching education details:", error);
                    }
                }
                fetchEducationDetails();
            }
        }
    }, [formData.education]);

    // Search professions when profession input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (professionInputValue.length >= 2) {
                searchProfessions(professionInputValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [professionInputValue]);

    // Search designations when designation input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (designationInputValue.length >= 2 && professionSelectedValue?.value) {
                searchDesignations(designationInputValue, professionSelectedValue.value);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [designationInputValue, professionSelectedValue]);

    // Search educations when education input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (educationInputValue.length >= 2) {
                searchEducations(educationInputValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [educationInputValue]);

    // Function to search professions
    const searchProfessions = async (searchText) => {
        if (!searchText || searchText.length < 2) return;

        setIsProfessionLoading(true);
        setProfessionError(null);

        try {
            const response = await axios.get(`${getBaseUrl()}/api//profession?search=${encodeURIComponent(searchText)}`);
            console.log("Profession search response:", response.data);

            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.ProfessionName,
                    value: item.ProfessionName, // Store name instead of ID
                    id: item.id // Keep ID for internal use
                }));

                // Update professions list
                setProfessionOptions(options);
            } else {
                console.error("Unexpected profession response format:", response.data);
                setProfessionError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error searching professions:", error);
            setProfessionError(`Failed to search professions: ${error.message}`);
        } finally {
            setIsProfessionLoading(false);
        }
    };

    // Function to search designations
    const searchDesignations = async (searchText, professionName) => {
        if (!searchText || searchText.length < 2) return;

        setIsDesignationLoading(true);
        setDesignationError(null);

        try {
            // First, get the profession ID from the profession name
            const professionResponse = await axios.get(`${getBaseUrl()}/api//profession?search=${encodeURIComponent(professionName)}`);
            let professionId = null;
            
            if (Array.isArray(professionResponse.data) && professionResponse.data.length > 0) {
                const matchingProfession = professionResponse.data.find(p => p.ProfessionName === professionName);
                professionId = matchingProfession ? matchingProfession.id : null;
            }

            // Now search designations with the professionId
            let url = `${getBaseUrl()}/api//designation?search=${encodeURIComponent(searchText)}`;
            if (professionId) {
                url += `&professionId=${professionId}`;
            }

            const response = await axios.get(url);
            console.log("Designation search response:", response.data);

            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.DesignationName,
                    value: item.DesignationName, // Store name instead of ID
                    id: item.id // Keep ID for internal use
                }));

                // Update designations list
                setDesignationOptions(options);
            } else {
                console.error("Unexpected designation response format:", response.data);
                setDesignationError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error searching designations:", error);
            setDesignationError(`Failed to search designations: ${error.message}`);
        } finally {
            setIsDesignationLoading(false);
        }
    };

    // Function to search educations
    const searchEducations = async (searchText) => {
        if (!searchText || searchText.length < 2) return;

        setIsEducationLoading(true);
        setEducationError(null);

        try {
            const response = await axios.get(`${getBaseUrl()}/api//education?search=${encodeURIComponent(searchText)}`);
            console.log("Education search response:", response.data);

            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.EducationName,
                    value: item.EducationName, // Store name instead of ID
                    id: item.id // Keep ID for internal use
                }));
                setEducationOptions(options);
            } else {
                console.error("Unexpected education response format:", response.data);
                setEducationError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error searching educations:", error);
            setEducationError(`Failed to search educations: ${error.message}`);
        } finally {
            setIsEducationLoading(false);
        }
    };

    // Function to fetch designations for a specific profession
    const fetchDesignationsForProfession = async (professionId) => {
        if (!professionId) return;

        setIsDesignationLoading(true);
        setDesignationError(null);

        try {
            const response = await axios.get(`${getBaseUrl()}/api//designation?professionId=${professionId}`);
            console.log("Designations for profession response:", response.data);

            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.DesignationName,
                    value: item.DesignationName, // Store name instead of ID
                    id: item.id // Keep ID for internal use
                }));

                // Update designations list
                setDesignationOptions(options);
            } else {
                console.error("Unexpected designation response format:", response.data);
                setDesignationError("Invalid data format received");
            }
        } catch (error) {
            console.error("Error fetching designations for profession:", error);
            setDesignationError(`Failed to fetch designations: ${error.message}`);
        } finally {
            setIsDesignationLoading(false);
        }
    };

    // Function to fetch educations 
    const fetchEducations = async () => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api//education`);
            if (Array.isArray(response.data)) {
                const options = response.data.map((item) => ({
                    label: item.EducationName,
                    value: item.EducationName, // Store name instead of ID
                    id: item.id // Keep ID for internal use
                }));
                setEducationOptions(options);
            }
        } catch (error) {
            console.error("Error fetching educations:", error);
            setEducationError("Failed to load educations");
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
                        value: item.ProfessionName, // Store name instead of ID
                        id: item.id // Keep ID for internal use
                    }));
                    setProfessionOptions(options);
                }
            } catch (error) {
                console.error("Error fetching professions:", error);
                setProfessionError("Failed to load professions");
            }
        };

        fetchProfessions();
        fetchEducations();
    }, []);

    // Handle selection of profession
    const handleProfessionChange = async (event, newValue) => {
        setProfessionSelectedValue(newValue);

        // Reset designation when profession changes
        setDesignationSelectedValue(null);
        setDesignationOptions([]);

        // Update the parent form data with the name (not ID)
        const syntheticEvent = {
            target: {
                name: 'profession',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);

        // Clear designation in parent form data
        const resetDesignationEvent = {
            target: {
                name: 'designation',
                value: ''
            }
        };
        handleChange(resetDesignationEvent);

        // If a profession is selected, fetch relevant designations
        if (newValue && newValue.value) {
            try {
                // First, get the profession ID from the profession name
                const professionResponse = await axios.get(`${getBaseUrl()}/api//profession?search=${encodeURIComponent(newValue.value)}`);
                if (Array.isArray(professionResponse.data) && professionResponse.data.length > 0) {
                    const matchingProfession = professionResponse.data.find(p => p.ProfessionName === newValue.value);
                    if (matchingProfession) {
                        fetchDesignationsForProfession(matchingProfession.id);
                    }
                }
            } catch (error) {
                console.error("Error finding profession ID:", error);
            }
        }
    };

    // Handle selection of designation
    const handleDesignationChange = (event, newValue) => {
        setDesignationSelectedValue(newValue);

        // Update the parent form data with the name (not ID)
        const syntheticEvent = {
            target: {
                name: 'designation',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };

    // Handle selection of education
    const handleEducationChange = (event, newValue) => {
        setEducationSelectedValue(newValue);

        // Update the parent form data with the name (not ID)
        const syntheticEvent = {
            target: {
                name: 'education',
                value: newValue ? newValue.value : ''
            }
        };
        handleChange(syntheticEvent);
    };

    if (!isActive) {
        console.log("CareerEducationTab is not active, returning null");
        return null;
    }

    console.log("CareerEducationTab is rendering with handleSubmit:", handleSubmit, "and isActive:", isActive, "and tabIndex:", tabIndex);

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
            {/* Working Status - Changed to dropdown */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Working Status:</Typography>
            <TextField
                select
                name="workingStatus"
                value={formData.workingStatus ?? "Yes - ಹೌದು"} // Default to "Yes - ಹೌದು"
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
            >
                {workingStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* Education - AUTOCOMPLETE VERSION */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Education:</Typography>
            <Autocomplete
                value={educationSelectedValue}
                onChange={handleEducationChange}
                inputValue={educationInputValue}
                onInputChange={(event, newInputValue) => {
                    setEducationInputValue(newInputValue);
                }}
                options={educationOptions}
                loading={isEducationLoading}
                loadingText="Searching..."
                noOptionsText={educationInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={educationError || "Start typing to search educations"}
                        error={!!educationError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isEducationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Profession - AUTOCOMPLETE VERSION */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profession:</Typography>
            <Autocomplete
                value={professionSelectedValue}
                onChange={handleProfessionChange}
                inputValue={professionInputValue}
                onInputChange={(event, newInputValue) => {
                    setProfessionInputValue(newInputValue);
                }}
                options={professionOptions}
                loading={isProfessionLoading}
                loadingText="Searching..."
                noOptionsText={professionInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
                fullWidth
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={professionError || "Start typing to search professions"}
                        error={!!professionError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isProfessionLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Designation - AUTOCOMPLETE VERSION (Based on selected profession) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Designation:</Typography>
            <Autocomplete
                value={designationSelectedValue}
                onChange={handleDesignationChange}
                inputValue={designationInputValue}
                onInputChange={(event, newInputValue) => {
                    setDesignationInputValue(newInputValue);
                }}
                options={designationOptions}
                loading={isDesignationLoading}
                loadingText="Searching..."
                noOptionsText={
                    !professionSelectedValue ?
                        "Select a profession first" :
                        designationInputValue.length < 2 ?
                            "Type at least 2 characters" :
                            "No options found"
                }
                disabled={!professionSelectedValue}
                fullWidth
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={
                            !professionSelectedValue ?
                                "Select a profession first" :
                                designationError ||
                                "Start typing to search designations or select from dropdown"
                        }
                        error={!!designationError}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isDesignationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
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

            {/* Use FormNavigation with showSubmitButton set to true */}
            <FormNavigation
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                showSubmitButton={true}
                handleSubmit={handleSubmit}
            />
        </Box>
    );
};

export default CareerEducationTab;