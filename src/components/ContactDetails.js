// src/components/ViewContactDetails/ViewContactDetailsForm.js
import React, { useState } from "react";
import {
    Typography,
    TextField,
    Button,
    FormControl,
    MenuItem,
    Select,
    Box,
    Grid
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ContactDetailsResults from "./ContactDetailsResults";
import useApiData from "../../hooks/useApiData"; // Adjust the path as needed
import { Link } from 'react-router-dom';

const ViewContactDetailsForm = () => {
    const [searchCriteria, setSearchCriteria] = useState({
        profileId: '',
        profileFor: '',
        minAge: '',
        maxAge: '',
        gotra: ''
    });
    const [contactDetails, setContactDetails] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [searching, setSearching] = useState(false);

    const { isLoading, error, gotraOptions } = useApiData();

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchCriteria(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSearchContactDetails = async () => {
        setSearching(true);
        setSearchError('');
        setContactDetails([]);

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/contact-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(searchCriteria),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch contact details.');
            }

            const data = await response.json();
            setContactDetails(data);
        } catch (error) {
            console.error('Error fetching contact details:', error);
            setSearchError(error.message);
            alert('Error fetching contact details. Check console.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="bg-gray-50 font-sans antialiased min-h-screen">
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/dashboard" className="text-xl font-bold text-indigo-700">
                        View Contact Details
                    </Link>
                    <div className="space-x-4">
                        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link>
                        {/* Add other navigation links if needed */}
                    </div>
                </div>
            </nav>

            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <Typography variant="h5" align="center" gutterBottom className="text-2xl font-semibold text-gray-800 mb-6">
                            Search Contact Details
                        </Typography>

                        <Box
                            sx={{
                                mt: 2,
                                p: 4, // Increased padding for better spacing
                                backgroundColor: "#f5f5f5",
                                borderRadius: 2,
                                boxShadow: 2, // Added shadow for consistency
                                maxWidth: "100%",
                                margin: "auto" // Center the box
                            }}
                        >
                            <Grid container spacing={3} alignItems="center"> {/* Increased spacing and aligned items */}
                                {/* Profile ID */}
                                <Grid item xs={12} sm={6} md={3}> {/* Adjusted md for 4 columns */}
                                    <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
                                    <TextField
                                        fullWidth
                                        label="Search by Profile ID"
                                        name="profileId"
                                        value={searchCriteria.profileId}
                                        onChange={handleSearchChange}
                                        margin="normal"
                                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </Grid>

                                {/* Profile For */}
                                <Grid item xs={12} sm={6} md={3}> {/* Adjusted md for 4 columns */}
                                    <Typography sx={{ fontWeight: "bold", color: "#444" }}>Looking For:</Typography>
                                    <FormControl fullWidth margin="normal">
                                        <Select
                                            name="profileFor"
                                            value={searchCriteria.profileFor}
                                            onChange={handleSearchChange}
                                            displayEmpty
                                            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="Bride">Bride</MenuItem>
                                            <MenuItem value="Bridegroom">Bridegroom</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Min Age */}
                                <Grid item xs={12} sm={6} md={2}> {/* Adjusted md for 4 columns */}
                                    <Typography sx={{ fontWeight: "bold", color: "#444" }}>Min Age:</Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Min Age"
                                        name="minAge"
                                        value={searchCriteria.minAge}
                                        onChange={handleSearchChange}
                                        margin="normal"
                                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </Grid>

                                {/* Max Age */}
                                <Grid item xs={12} sm={6} md={2}> {/* Adjusted md for 4 columns */}
                                    <Typography sx={{ fontWeight: "bold", color: "#444" }}>Max Age:</Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Max Age"
                                        name="maxAge"
                                        value={searchCriteria.maxAge}
                                        onChange={handleSearchChange}
                                        margin="normal"
                                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </Grid>

                                {/* Gotra */}
                                <Grid item xs={12} sm={6} md={3}> {/* Adjusted md for 4 columns */}
                                    <Typography sx={{ fontWeight: "bold", color: "#444" }}>Gotra:</Typography>
                                    <FormControl fullWidth margin="normal">
                                        {isLoading ? (
                                            <Typography>Loading...</Typography>
                                        ) : error ? (
                                            <Typography color="error">{error}</Typography>
                                        ) : (
                                            <Select
                                                name="gotra"
                                                value={searchCriteria.gotra}
                                                onChange={handleSearchChange}
                                                displayEmpty
                                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <MenuItem value="">All</MenuItem>
                                                {gotraOptions && gotraOptions.length > 0 ? (
                                                    gotraOptions.map((gotra, index) => (
                                                        <MenuItem key={index} value={gotra.gotraname}>
                                                            {gotra.gotraname}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>No options available</MenuItem>
                                                )}
                                            </Select>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Empty Grid Item for Spacing (if needed for alignment) */}
                                <Grid item xs={12} sm={6} md={1}></Grid>

                                {/* Search Button */}
                                <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSearchContactDetails}
                                        startIcon={<SearchIcon />}
                                        disabled={searching}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    >
                                        {searching ? 'Searching...' : 'Search Contact Details'}
                                    </Button>
                                </Grid>

                                {/* Another Empty Grid Item for Button Alignment */}
                                <Grid item xs={12} md={1}></Grid>
                            </Grid>
                        </Box>

                        {searchError && (
                            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                                {searchError}
                            </Typography>
                        )}

                        {contactDetails.length > 0 && (
                            <Box mt={4}>
                                <ContactDetailsResults results={contactDetails} />
                            </Box>
                        )}
                    </div>
                </div>
            </section>

            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8">
                <div className="container mx-auto px-6">
                    <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ViewContactDetailsForm;