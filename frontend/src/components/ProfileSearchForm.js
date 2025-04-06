import React, { useState } from "react";
import {
    Paper,
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
                `http://localhost:3001/api/searchProfiles?profileFor=${searchQuery.profileFor}&minAge=${searchQuery.minAge}&maxAge=${searchQuery.maxAge}&gotra=${searchQuery.gotra}`,
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
        <Paper elevation={3} sx={{ maxWidth: "80%", mx: "auto", p: 4, mt: 4, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Search Profile
            </Typography>

            

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
    />

    {/* Looking For */}
    <Typography sx={{ fontWeight: "bold", color: "#444" }}>Looking For:</Typography>
    <FormControl fullWidth>
        <Select
            name="profileFor"
            value={searchQuery.profileFor}
            onChange={(e) => setSearchQuery({ ...searchQuery, profileFor: e.target.value })}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </Button>
            </Box>

            {/* Search Results */}
            <Box sx={{ mt: 2 }}>
                {searchResults.length > 0 ? <SearchResults results={searchResults} /> : <Typography align="center">No results found</Typography>}
            </Box>
        </Paper>
    );
};

export default ProfileSearchForm;
