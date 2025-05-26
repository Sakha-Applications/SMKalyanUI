    import React, { useState } from "react";
    import {
        Typography,
        TextField,
        Button,
        FormControl,
        MenuItem,
        Select,
        Box
    } from "@mui/material";
    import SearchResults from "./SearchResults";
    import useApiData from "../hooks/useApiData";
    import { Link } from 'react-router-dom'; // Import Link for potential navigation
    import getBaseUrl from '../utils/GetUrl';

    const ProfileSearchForm = () => {
        const [searchQuery, setSearchQuery] = useState({
            profileId: "",
            profileFor: "",
            minAge: "",
            maxAge: "",
            gotra: ""
        });

        const [searchResults, setSearchResults] = useState([]);
        const [loading, setLoading] = useState(false);

        const { isLoading, error, gotraOptions } = useApiData();

        const handleSearch = async () => {
            setLoading(true);
            try {
                console.log("Sending search request with:", searchQuery);
                const response = await fetch(
                    `${getBaseUrl()}/api//searchProfiles?profileFor=${searchQuery.profileFor}&minAge=${searchQuery.minAge}&maxAge=${searchQuery.maxAge}&gotra=${searchQuery.gotra}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    }
                );

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Search failed:", error);
                alert("Search failed. Check console.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="bg-gray-50 font-sans antialiased min-h-screen"> {/* Applied body styles */}
                {/* Navigation Bar (similar to Home) */}
                <nav className="bg-white shadow-md py-4">
                    <div className="container mx-auto flex justify-between items-center px-6">
                        <Link to="/" className="text-xl font-bold text-indigo-700">
                            Profile Search
                        </Link>
                        <div className="space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-indigo-500">Home</Link>
                            {/* You can add other navigation links here if needed */}
                        </div>
                    </div>
                </nav>

                {/* Content Area */}
                <section className="py-8"> {/* Added some padding to the content section */}
                    <div className="container mx-auto px-6"> {/* Added container for centering */}
                        <div className="bg-white rounded-lg shadow-md p-8"> {/* Added a white container for the form */}
                            <Typography variant="h5" align="center" gutterBottom className="text-2xl font-semibold text-gray-800 mb-6">
                                Search Profiles
                            </Typography>

                            <Box sx={{
                                mt: 2,
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 8fr 2fr 8fr' }, // Responsive grid
                                gap: 3,
                                alignItems: "center",
                                p: 4,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 2,
                                boxShadow: 2,
                                maxWidth: "100%",
                                margin: "auto"
                            }}>
                                {/* Profile ID */}
                                <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
                                <TextField
                                    fullWidth
                                    name="profileId"
                                    value={searchQuery.profileId}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, profileId: e.target.value })}
                                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind input styles
                                />

                                {/* Looking For */}
                                <Typography sx={{ fontWeight: "bold", color: "#444" }}>Looking For:</Typography>
                                <FormControl fullWidth>
                                    <Select
                                        name="profileFor"
                                        value={searchQuery.profileFor}
                                        onChange={(e) => setSearchQuery({ ...searchQuery, profileFor: e.target.value })}
                                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind select styles
                                    >
                                        <MenuItem value="Bride">Bride</MenuItem>
                                        <MenuItem value="Bridegroom">Bridegroom</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Min Age */}
                                <Typography sx={{ fontWeight: "bold", color: "#444" }}>Min Age:</Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="minAge"
                                    value={searchQuery.minAge}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, minAge: e.target.value })}
                                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind input styles
                                />

                                {/* Max Age */}
                                <Typography sx={{ fontWeight: "bold", color: "#444" }}>Max Age:</Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="maxAge"
                                    value={searchQuery.maxAge}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, maxAge: e.target.value })}
                                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind input styles
                                />

                                {/* Gotra */}
                                <Typography sx={{ fontWeight: "bold", color: "#444" }}>Gotra:</Typography>
                                {isLoading ? (
                                    <Typography>Loading...</Typography>
                                ) : error ? (
                                    <Typography color="error">{error}</Typography>
                                ) : (
                                    <TextField
                                        name="gotra"
                                        value={searchQuery.gotra ?? ""}
                                        onChange={(e) => setSearchQuery({ ...searchQuery, gotra: e.target.value })}
                                        fullWidth
                                        select
                                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind select styles
                                    >
                                        {gotraOptions.length > 0 ? (
                                            gotraOptions.map((gotra, index) => (
                                                <MenuItem key={index} value={gotra.gotraname}>{gotra.gotraname}</MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No options available</MenuItem>
                                        )}
                                    </TextField>
                                )}
                            </Box>

                            {/* Search Button */}
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}> {/* Increased marginTop */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400" // Tailwind button styles
                                >
                                    {loading ? "Searching..." : "Search"}
                                </Button>
                            </Box>

                            {/* Search Results */}
                            <Box sx={{ mt: 4 }}> {/* Increased marginTop */}
                                {searchResults.length > 0 ? <SearchResults results={searchResults} /> : <Typography align="center" className="text-gray-700 mt-4">No results found</Typography>}
                            </Box>
                        </div>
                    </div>
                </section>

                {/* Footer (similar to Home) */}
                <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8"> {/* Added marginTop */}
                    <div className="container mx-auto px-6">
                        {/* You can add footer links here if needed */}
                        <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        );
    };

    export default ProfileSearchForm;