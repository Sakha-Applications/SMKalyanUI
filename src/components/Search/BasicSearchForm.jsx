// src/components/Search/BasicSearchForm.jsx
import React, { useState, useEffect } from "react";
import {
    Typography,
    Button,
    Box,
    Grid
} from "@mui/material";
import SearchResults from "./SearchResults"; // Your existing SearchResults component
import useApiData from "../../hooks/useApiData"; // Your existing hook
import getBaseUrl from '../../utils/GetUrl'; // Your existing utility
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import StyledFormField from '../common/StyledFormField'; // The new styled component
import AutocompleteInput from '../common/renderAutocomplete'; // The new autocomplete helper (updated)
import CountryStateCitySelector from "../common/CountryStateCitySelector"; // Your existing component
import dayjs from "dayjs"; // For DatePicker value if needed

const BasicSearchForm = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Initialize searchQuery state with all Basic Search fields
    const [searchQuery, setSearchQuery] = useState({
        profileId: "",
        profileFor: "",
        minAge: "",
        maxAge: "",
        maritalStatus: "",
        motherTongue: "",
        gotra: "",
        subCaste: "",
        guruMatha: "",
        currentCityOfResidence: "",
        currentLocationCountry: "", // For CountryStateCitySelector
        currentLocationState: "",   // For CountryStateCitySelector
        income: "",
        traditionalValues: ""
    });

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // For general search errors

    // --- State for Autocomplete and Select Options ---
    const {
        isLoading: apiDataLoading,
        error: apiDataError,
        gotraOptions, // Fetched via useApiData
        searchMotherTongues, // Function for Mother Tongue autocomplete
        getMotherTongueById, // For pre-filling Mother Tongue
        searchGuruMatha, // Function for Guru Matha autocomplete
        searchPlaces, // Function for Current City of Residence autocomplete
        getPlaceById // For pre-filling Current City of Residence
    } = useApiData();

    // Local states for Autocomplete inputs and their dropdown visibility
    const [motherTongueInput, setMotherTongueInput] = useState(searchQuery.motherTongue || "");
    const [motherTongueOptions, setMotherTongueOptions] = useState([]);
    const [showMotherTongueOptions, setShowMotherTongueOptions] = useState(false);

    const [guruMathaInput, setGuruMathaInput] = useState(searchQuery.guruMatha || "");
    const [guruMathaOptions, setGuruMathaOptions] = useState([]);
    const [showGuruMathaOptions, setShowGuruMathaOptions] = useState(false);

    // Hardcoded options (as per popup files mapping)
    const profileForOptions = [
        { label: "Bride", value: "Bride" },
        { label: "Bridegroom", value: "Bridegroom" }
    ];

    const maritalStatusOptions = [
        { label: "Single (Never Married)", value: "Single (Never Married)" },
        { label: "Divorced", value: "Divorced" },
        { label: "Separated", value: "Separated" },
        { label: "Widowed", value: "Widowed" }
    ];

    const subCasteOptions = [
        { label: "Madhva (ಮಾಧ್ವ)", value: "Madhva (ಮಾಧ್ವ)" },
        { label: "Smarta (ಸ್ಮಾರ್ತ)", value: "Smarta (ಸ್ಮಾರ್ತ)" },
        { label: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)", value: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)" },
        { label: "Others (ಇತರರು)", value: "Others (ಇತರರು)" }
    ];

    const incomeOptions = [
        { label: "Select Income Range", value: "" },
        { label: "Below ₹2 Lakh", value: "Below ₹2 Lakh" },
        { label: "₹2 to ₹4 Lakh", value: "₹2 to ₹4 Lakh" },
        { label: "₹4 to ₹6 Lakh", value: "₹4 to ₹6 Lakh" },
        { label: "₹6 to ₹10 Lakh", value: "₹6 to ₹10 Lakh" },
        { label: "₹10 to ₹15 Lakh", value: "₹10 to ₹15 Lakh" },
        { label: "₹15 to ₹25 Lakh", value: "₹15 to ₹25 Lakh" },
        { label: "₹25 to ₹50 Lakh", value: "₹25 to ₹50 Lakh" },
        { label: "₹50 Lakh to ₹1 Crore", value: "₹50 Lakh to ₹1 Crore" },
        { label: "Above ₹1 Crore", value: "Above ₹1 Crore" }
    ];

    const traditionalValuesOptions = [
        { label: "Traditional", value: "Traditional" },
        { label: "Moderate", value: "Moderate" },
        { label: "Liberal", value: "Liberal" }
    ];

    // Effect to pre-fill autocomplete inputs if formData already has values (e.g., on edit)
    useEffect(() => {
        if (searchQuery.motherTongue && motherTongueInput === "") { // Only set if input is empty
            setMotherTongueInput(searchQuery.motherTongue);
        }
        if (searchQuery.guruMatha && guruMathaInput === "") { // Only set if input is empty
            setGuruMathaInput(searchQuery.guruMatha);
        }
        // currentCityOfResidence is handled by CountryStateCitySelector directly updating searchQuery
    }, [searchQuery.motherTongue, motherTongueInput, searchQuery.guruMatha, guruMathaInput]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery((prev) => ({ ...prev, [name]: value }));
        console.log(`handleChange called: ${name}: ${value}`);
    };

    // Callback for AutocompleteInput component's onSelect
    const handleAutocompleteSelect = (name, value, id = null) => {
        setSearchQuery((prev) => ({ ...prev, [name]: value }));
        // If an ID is relevant, you might store it too, e.g., for backend lookup by ID
        if (id) {
            setSearchQuery((prev) => ({ ...prev, [`${name}Id`]: id }));
        }
    };


    const handleSearch = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            console.log("Sending search request with:", searchQuery);
            const response = await fetch(
                `${getBaseUrl()}/api/searchProfiles`, // Use the POST endpoint
                {
                    method: "POST", // Change to POST
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(searchQuery) // Send searchQuery in the body
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            console.error("Search failed:", err);
            setError(err.message || "Search failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToDashboard = () => {
        navigate('/Dashboard'); // Navigate to the dashboard (assuming root path is dashboard)
    };

    if (apiDataLoading) {
        return <Typography>Loading essential search options...</Typography>;
    }

    if (apiDataError) {
        return <Typography color="error">Error loading search options: {apiDataError.message}</Typography>;
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            {/* Navigation Bar - Reused from ProfileSearchForm.js */}
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/" className="text-xl font-bold text-indigo-700">
                        Profile Search
                    </Link>
                    <div className="space-x-4">
                        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link>
                        {/* Other nav links could go here */}
                    </div>
                </div>
            </nav>

            {/* Content Area - Reused structure and styling */}
            <section className="py-8">
                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                        <h1 className="text-2xl font-bold">Basic Profile Search</h1>
                        {/* You can add profile ID, name, user ID here if relevant to the search context */}
                    </div>

                    <div className="p-6">
                        <Box sx={{
                            mt: 2,
                            display: "grid",
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' }, // Adjusted for 2 columns on medium/large screens
                            gap: 3, // Spacing between grid items
                            p: 2, // Reduced padding for inner box
                            // Removed background, border-radius, and box-shadow to blend with parent container
                            maxWidth: "100%",
                            margin: "auto"
                        }}>
                            {/* Profile ID */}
                            <StyledFormField
                                label="Profile ID"
                                name="profileId"
                                value={searchQuery.profileId}
                                onChange={handleChange}
                            />

                            {/* Looking For (Profile For) */}
                            <StyledFormField
                                label="Looking For"
                                name="profileFor"
                                value={searchQuery.profileFor}
                                onChange={handleChange}
                                selectOptions={profileForOptions}
                            />

                            {/* Min Age */}
                            <StyledFormField
                                label="Min Age"
                                type="number"
                                name="minAge"
                                value={searchQuery.minAge}
                                onChange={handleChange}
                            />

                            {/* Max Age */}
                            <StyledFormField
                                label="Max Age"
                                type="number"
                                name="maxAge"
                                value={searchQuery.maxAge}
                                onChange={handleChange}
                            />

                            {/* Marital Status */}
                            <StyledFormField
                                label="Marital Status"
                                name="maritalStatus"
                                value={searchQuery.maritalStatus}
                                onChange={handleChange}
                                selectOptions={maritalStatusOptions}
                            />

                            {/* Mother Tongue (Autocomplete) */}
                            <AutocompleteInput
                                label="Mother Tongue"
                                name="motherTongue"
                                inputValue={motherTongueInput}
                                inputSetter={setMotherTongueInput}
                                options={motherTongueOptions}
                                setOptions={setMotherTongueOptions} // Pass setter to allow renderAutocomplete to update options
                                show={showMotherTongueOptions}
                                setShow={setShowMotherTongueOptions}
                                loading={false} // Adjust if you add loading state for individual autocompletes
                                searchFn={searchMotherTongues}
                                onSelect={handleAutocompleteSelect}
                            />

                            {/* Gotra */}
                            <StyledFormField
                                label="Gotra"
                                name="gotra"
                                value={searchQuery.gotra}
                                onChange={handleChange}
                                selectOptions={gotraOptions.map(g => ({ label: g.label, value: g.label }))} // Ensure value/label consistency
                            />

                            {/* Sub-caste */}
                            <StyledFormField
                                label="Sub-caste"
                                name="subCaste"
                                value={searchQuery.subCaste}
                                onChange={handleChange}
                                selectOptions={subCasteOptions}
                            />

                            {/* Guru-maTtha (Autocomplete) */}
                            <AutocompleteInput
                                label="Guru-maTtha"
                                name="guruMatha"
                                inputValue={guruMathaInput}
                                inputSetter={setGuruMathaInput}
                                options={guruMathaOptions}
                                setOptions={setGuruMathaOptions} // Pass setter
                                show={showGuruMathaOptions}
                                setShow={setShowGuruMathaOptions}
                                loading={false} // Adjust if you add loading state for individual autocompletes
                                searchFn={searchGuruMatha}
                                onSelect={handleAutocompleteSelect}
                            />

                            {/* Current City of Residence (CountryStateCitySelector) - spans 2 columns */}
                            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                                <CountryStateCitySelector
                                    formData={searchQuery}
                                    handleChange={handleChange}
                                    countryField="currentLocationCountry"
                                    stateField="currentLocationState"
                                    cityField="currentCityOfResidence" // Maps to our search field
                                    labelPrefix="Residing"
                                    searchFn={searchPlaces} // Pass searchPlaces from useApiData
                                    getByIdFn={getPlaceById} // Pass getPlaceById from useApiData
                                />
                            </Box>

                            {/* Income */}
                            <StyledFormField
                                label="Income"
                                name="income"
                                value={searchQuery.income}
                                onChange={handleChange}
                                selectOptions={incomeOptions}
                            />

                            {/* Traditional Values */}
                            <StyledFormField
                                label="Traditional Values"
                                name="traditionalValues"
                                value={searchQuery.traditionalValues}
                                onChange={handleChange}
                                selectOptions={traditionalValuesOptions}
                            />

                        </Box>

                        {/* Search and Back Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}> {/* Added gap for spacing */}
                            <Button
                                variant="outlined" // Changed to outlined for a secondary look
                                color="secondary" // Use secondary color
                                onClick={handleBackToDashboard}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Back to Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Box>

                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        {/* Search Results */}
                        <Box sx={{ mt: 4 }}>
                            {/* SearchResults component will now take care of its own styling */}
                            <SearchResults results={searchResults} />
                        </Box>
                    </div>
                </div>
            </section>

            {/* Footer - Reused from ProfileSearchForm.js */}
            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8">
                <div className="container mx-auto px-6">
                    <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default BasicSearchForm;