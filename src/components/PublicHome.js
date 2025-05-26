// src/components/PublicHome.js
import React, { useState } from "react";
import {
  Typography, TextField, Button, Box, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ContactDetailsResults from "./ViewContactDetails/ContactDetailsResults";
import useApiData from "../hooks/useApiData";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../assets/Image/kalayan_bg_img.png';
import getBaseUrl from '../utils/GetUrl';

const PublicHome = () => {
  const [searchCriteria, setSearchCriteria] = useState({ profileId: '', profileFor: '', minAge: '', maxAge: '', gotra: '' });
  const [contactDetails, setContactDetails] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { isLoading, gotraOptions } = useApiData();

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const response = await fetch(`${getBaseUrl()}/api//contact-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria),
      });
      const data = await response.json();
      setContactDetails(data);
    } catch (e) {
      console.error('Search error:', e);
      alert('Search failed. Please check console.');
    } finally {
      setSearching(false);
    }
  };

  const handleRestrictedView = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => setShowDialog(false);

  const redirectToHomePage = () => {
    console.log("YES clicked: redirecting to /home...");
    navigate("/home");
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-20 text-white text-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Genuine Connections
          </h1>
          <p className="text-lg md:text-xl font-light">
            Search and explore profiles to find someone special.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8 mb-6">
        <Typography variant="h5" align="center" className="mb-6 font-semibold text-indigo-700">
          Search Public Profiles
        </Typography>

        <Box
          className="bg-gray-100 p-6 rounded-md"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 1fr 2fr' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          {/* Profile ID */}
          <Typography className="text-right font-medium text-gray-700">Profile ID:</Typography>
          <TextField
            name="profileId"
            value={searchCriteria.profileId}
            onChange={handleSearchChange}
            placeholder="Enter Profile ID"
            fullWidth
            size="small"
          />

          {/* Min Age */}
          <Typography className="text-right font-medium text-gray-700">Min Age:</Typography>
          <TextField
            name="minAge"
            type="number"
            value={searchCriteria.minAge}
            onChange={handleSearchChange}
            placeholder="Minimum Age"
            fullWidth
            size="small"
          />

          {/* Max Age */}
          <Typography className="text-right font-medium text-gray-700">Max Age:</Typography>
          <TextField
            name="maxAge"
            type="number"
            value={searchCriteria.maxAge}
            onChange={handleSearchChange}
            placeholder="Maximum Age"
            fullWidth
            size="small"
          />

          {/* Gotra */}
          <Typography className="text-right font-medium text-gray-700">Gotra:</Typography>
          <TextField
            name="gotra"
            select
            value={searchCriteria.gotra}
            onChange={handleSearchChange}
            fullWidth
            size="small"
            SelectProps={{ native: true }}
          >
            <option value="">All</option>
            {!isLoading &&
              gotraOptions.map((g, i) => (
                <option key={i} value={g.gotraname}>
                  {g.gotraname}
                </option>
              ))}
          </TextField>

          {/* Empty cells for alignment */}
          <div></div>
          <div></div>
          <div className="col-span-4 text-center mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={searching}
              startIcon={<SearchIcon />}
              className="px-6 py-2"
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Box>
      </section>

      {/* Results */}
      <section className="max-w-5xl mx-auto px-4">
        {contactDetails.length > 0 ? (
          contactDetails.map(profile => (
            <Box key={profile.profile_id} className="border rounded-lg p-4 mb-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
              <Typography variant="subtitle1" className="text-gray-800"><strong>Profile ID:</strong> {profile.profile_id}</Typography>
              <Typography variant="subtitle1"><strong>Name:</strong> {profile.name}</Typography>
              <Typography variant="subtitle1"><strong>Age:</strong> {profile.current_age}</Typography>
              <Typography variant="subtitle1"><strong>Location:</strong> {profile.current_location}</Typography>
              <Box className="text-right mt-2">
                <Button variant="outlined" onClick={handleRestrictedView}>
                  View Contact Details
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography align="center" className="text-gray-500 italic">
            No results yet. Please search to see profiles.
          </Typography>
        )}
      </section>

      {/* Dialog */}
      <Dialog open={showDialog} onClose={handleDialogClose}>
        <DialogTitle>Access Restricted</DialogTitle>
        <DialogContent>
          You must be logged in to view contact details. Do you want to go to the home page now?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>No</Button>
          <Button onClick={redirectToHomePage} variant="contained" color="primary">Yes</Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-12 mb-4">
        &copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicHome;
