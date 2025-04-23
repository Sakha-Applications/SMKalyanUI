// src/components/viewContactDetails/ViewContactDetails.js
import React, { useState, useEffect } from 'react';
import { 
    Paper, 
    Typography, 
    TextField, 
    Button, 
    FormControl,
    MenuItem,
    Select,
    Box,
    Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContactDetailsResults from './ContactDetailsResults';
import useApiData from '../../hooks/useApiData'; // Adjust the path as needed

const ViewContactDetails = () => {
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
    const [loggedInEmail, setLoggedInEmail] = useState('');

    const { isLoading, error, gotraOptions } = useApiData();

    useEffect(() => {
        // Get user email from storage for potential email feature
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setLoggedInEmail(emailFromStorage);
        }
    }, []);

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
        } finally {
            setSearching(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h5" gutterBottom align="center">
                View Contact Details
            </Typography>

            <Box sx={{
                mt: 2,
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 1
            }}>
                <Grid container spacing={2}>
                    {/* Profile ID */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Search by Profile ID"
                            name="profileId"
                            value={searchCriteria.profileId}
                            onChange={handleSearchChange}
                            margin="normal"
                            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                        />
                    </Grid>
                    
                    {/* Profile For */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <Typography variant="caption" sx={{ mb: 1 }}>Looking For</Typography>
                            <Select
                                name="profileFor"
                                value={searchCriteria.profileFor}
                                onChange={handleSearchChange}
                                displayEmpty
                                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Bride">Bride</MenuItem>
                                <MenuItem value="Bridegroom">Bridegroom</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* Age Range */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Min Age"
                            name="minAge"
                            value={searchCriteria.minAge}
                            onChange={handleSearchChange}
                            margin="normal"
                            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Max Age"
                            name="maxAge"
                            value={searchCriteria.maxAge}
                            onChange={handleSearchChange}
                            margin="normal"
                            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                        />
                    </Grid>
                    
                    {/* Gotra */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <Typography variant="caption" sx={{ mb: 1 }}>Gotra</Typography>
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
                    
                    {/* Search Button */}
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearchContactDetails}
                            startIcon={<SearchIcon />}
                            disabled={searching}
                            sx={{ minWidth: '200px' }}
                        >
                            {searching ? 'Searching...' : 'Search Contact Details'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {searchError && (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                    {searchError}
                </Typography>
            )}

            {contactDetails.length > 0 && (
                <ContactDetailsResults 
                    results={contactDetails} 
                    userEmail={loggedInEmail} 
                />
            )}
        </Paper>
    );
};

export default ViewContactDetails;