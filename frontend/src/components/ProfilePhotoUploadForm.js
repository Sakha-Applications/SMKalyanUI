// src/components/ProfilePhotoUploadForm.js
import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Grid, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useFormData from '../hooks/useFormData'; // Adjust path if needed
import axios from 'axios';

const ProfilePhotoUploadForm = () => {
  const { formData, handleChange, setFormData } = useFormData();
  const [searchCriteria, setSearchCriteria] = useState({
    profileId: '',
    email: '',
    phone: '',
  });
  const [profileData, setProfileData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearchCriteriaChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setProfileData(null); // Clear profile data on search criteria change
    setPhotos([]);
    setPhotoPreviews([]);
    setFetchError(null);
  };

  const handleSearchProfile = async () => {
    setProfileData(null);
    setFetchError(null);
    setSearching(true);
    try {
      const response = await axios.post('/api/search-by-upload', searchCriteria); // New backend endpoint
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile not found');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setProfileData(data[0]); // Assuming only one profile will match the criteria
      } else {
        setFetchError('No profile found matching the search criteria.');
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setSearching(false);
    }
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 5);
    setPhotos(files);

    setPhotoPreviews([]);
    const newPreviews = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setPhotoPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleUploadPhotos = async () => {
    if (!profileData) {
      alert('Please search and find a profile first.');
      return;
    }

    if (photos.length === 0) {
      alert('Please select at least one photo to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('profile_id', profileData.id); // Use the ID from fetched profile
    photos.forEach(photo => {
      formDataToSend.append('photos', photo);
    });

    try {
      const response = await axios.post('/api/profiles/upload-photos', formDataToSend);
      if (response.status === 200) {
        alert('Photos uploaded successfully!');
        setPhotos([]);
        setPhotoPreviews([]);
      } else {
        setUploadError(response.data.message || 'Failed to upload photos.');
      }
    } catch (error) {
      setUploadError('Error uploading photos.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Upload Photos to Profile
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Profile ID"
            name="profileId"
            value={searchCriteria.profileId}
            onChange={handleSearchCriteriaChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={searchCriteria.email}
            onChange={handleSearchCriteriaChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={searchCriteria.phone}
            onChange={handleSearchCriteriaChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearchProfile}
            startIcon={<SearchIcon />}
            disabled={searching}
            sx={{ mt: 2 }}
          >
            {searching ? 'Searching...' : 'Search Profile'}
          </Button>
        </Grid>
      </Grid>

      {fetchError && <Typography color="error" sx={{ mt: 2 }}>{fetchError}</Typography>}

      {profileData && (
        <div sx={{ mt: 2 }}>
          <Typography variant="h6">Profile Details</Typography>
          <Typography>Name: {profileData.name}</Typography>
          {profileData.current_age && <Typography>Current Age: {profileData.current_age}</Typography>}
          {profileData.gotra && <Typography>Gotra: {profileData.gotra}</Typography>}

          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ marginTop: 20 }}
          />
          {photoPreviews.length > 0 && (
            <div style={{ display: 'flex', marginTop: 10 }}>
              {photoPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`preview-${index}`}
                  style={{ width: 80, height: 80, marginRight: 10, objectFit: 'cover' }}
                />
              ))}
            </div>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={handleUploadPhotos}
            disabled={photos.length === 0 || uploading || !profileData}
            sx={{ mt: 2 }}
          >
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </Button>
          {uploadError && <Typography color="error" sx={{ mt: 2 }}>{uploadError}</Typography>}
        </div>
      )}
    </Paper>
  );
};

export default ProfilePhotoUploadForm;