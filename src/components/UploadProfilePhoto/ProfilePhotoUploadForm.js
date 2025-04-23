// src/components/UploadProfilePhoto/ProfilePhotoUploadForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Grid, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
    handleSearchCriteriaChange,
    handleSearchProfile,
    handlePhotoChange,
    handleUploadPhotos,
    getUploadedPhotos,
    fetchDefaultPhoto,
} from './photoUploadUtils';

const ProfilePhotoUploadForm = () => {
    const navigate = useNavigate();
    const [loggedInEmail, setLoggedInEmail] = useState(''); // State for logged-in email
    const [searchCriteria, setSearchCriteria] = useState({ profileId: '', email: loggedInEmail, phone: '' });
    const [profileData, setProfileData] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [searching, setSearching] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [gettingPhotos, setGettingPhotos] = useState(false);
    const [isDefaultPhoto, setIsDefaultPhoto] = useState(false);
    const [defaultPhoto, setDefaultPhoto] = useState(null);
    const [isFileInputDisabled, setFileInputDisabled] = useState(true); // Initially disabled

    useEffect(() => {
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setLoggedInEmail(emailFromStorage);
            setSearchCriteria(prevState => ({ ...prevState, email: emailFromStorage }));
        }
    }, []);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleSearchCriteriaChangeLocal = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setLoggedInEmail(value);
        }
        setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
        setProfileData(null);
        setPhotos([]);
        setPhotoPreviews([]);
        setFetchError(null);
        setUploadedPhotos([]);
        setDefaultPhoto(null);
        setUploadError(null);
        setFileInputDisabled(true); // Disable on new search criteria
    };

    const handleSearchProfileLocal = async () => {
        setSearching(true);
        setFetchError(null);
        setUploadedPhotos([]);
        setDefaultPhoto(null);
        setFileInputDisabled(true); // Disable during search
        setUploadError(null); // Clear any previous upload error
        try {
            await handleSearchProfile(
                searchCriteria,
                setProfileData,
                setFetchError,
                setSearching,
                setUploadedPhotos,
                setDefaultPhoto,
                setUploadError,
                (profileId, uploadedPhotosSetter, fetchErrorSetter) => getUploadedPhotos(profileId, uploadedPhotosSetter, fetchErrorSetter, setGettingPhotos),
                fetchDefaultPhoto
            );
            console.log('Debug (Form): profileData after search:', profileData);
            console.log('Debug (Form): uploadedPhotos after search:', uploadedPhotos);

            // Check photo limit immediately after fetching
            if (uploadedPhotos.length >= 5) {
                setUploadError(`You have already uploaded the maximum of 5 photos.`);
                setFileInputDisabled(true);
            } else {
                setFileInputDisabled(false); // Enable if below the limit
            }

        } finally {
            setSearching(false);
        }
    };

    const handlePhotoChangeLocal = (event) => {
        handlePhotoChange(event, setPhotos, setPhotoPreviews, setUploadError, uploadedPhotos.length);
        console.log('Debug (Form): uploadedPhotos.length in handlePhotoChangeLocal:', uploadedPhotos.length);
    };

    const handleUploadPhotosLocal = async () => {
        setUploading(true);
        setUploadError(null);
        try {
            console.log('Debug (Form): profileData before upload:', profileData);
            await handleUploadPhotos(
                profileData,
                photos,
                isDefaultPhoto,
                setUploading,
                setUploadError,
                setPhotos,
                setPhotoPreviews,
                setIsDefaultPhoto,
                getUploadedPhotos,
                fetchDefaultPhoto,
                setUploadedPhotos,
                setDefaultPhoto,
                setGettingPhotos,
                setFetchError
            );
            console.log('Debug (Form): handleUploadPhotosLocal - Upload process finished.');
            console.log('Debug (Form): uploadedPhotos after upload:', uploadedPhotos);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (profileData && !searching) {
            if (uploadedPhotos.length >= 5) {
                setFileInputDisabled(true);
                setUploadError(`You have already uploaded the maximum of 5 photos.`);
            } else {
                setFileInputDisabled(false);
                setUploadError(null); // Clear the error if below limit
            }
        } else {
            setFileInputDisabled(true); // Keep disabled if no profile data or searching
        }
    }, [profileData, searching, uploadedPhotos.length]);

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h5" gutterBottom>
                Upload Photos to Profile
            </Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Profile ID"
                        name="profileId"
                        value={searchCriteria.profileId}
                        onChange={handleSearchCriteriaChangeLocal}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={searchCriteria.email}
                        onChange={handleSearchCriteriaChangeLocal}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={searchCriteria.phone}
                        onChange={handleSearchCriteriaChangeLocal}
                    />
                </Grid>
                <Grid xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSearchProfileLocal}
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
                        onChange={handlePhotoChangeLocal}
                        style={{ marginTop: 20 }}
                        disabled={isFileInputDisabled} // Disable the input
                    />
                    {uploadError && <Typography color="error" sx={{ mt: 2 }}>{uploadError}</Typography>}
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isDefaultPhoto}
                                onChange={(e) => setIsDefaultPhoto(e.target.checked)}
                                name="isDefaultPhoto"
                                color="primary"
                            />
                        }
                        label="Set as Default Photo"
                        sx={{ mt: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUploadPhotosLocal}
                        disabled={photos.length === 0 || uploading || !profileData || isFileInputDisabled} // Also disable if file input is disabled
                        sx={{ mt: 2 }}
                    >
                        {uploading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Uploading...
                            </>
                        ) : (
                            'Upload Photos'
                        )}
                    </Button>
                    {uploadError && <Typography color="error" sx={{ mt: 2 }}>{uploadError}</Typography>}

                    <Typography variant="h6" sx={{ mt: 4 }}>Uploaded Photos</Typography>
                    {gettingPhotos ? (
                        <CircularProgress sx={{ mt: 2 }} />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
                            {uploadedPhotos.length > 0 ? (
                                uploadedPhotos.map((photo, index) => (
                                    <div key={index} style={{ marginRight: 10, marginBottom: 10 }}>
                                        <img
                                            src={`http://localhost:3001/${photo.path}`}
                                            alt={`uploaded-${index}`}
                                            style={{ width: 100, height: 100, objectFit: 'cover' }}
                                        />
                                        {photo.isDefault && <Typography variant="caption">Default</Typography>}
                                    </div>
                                ))
                            ) : (
                                <Typography>No photos uploaded yet.</Typography>
                            )}
                        </div>
                    )}
                </div>
            )}
            {profileData && (
                <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    sx={{ mt: 3 }}
                >
                    Back to Dashboard
                </Button>
            )}
        </Paper>
    );
};

export default ProfilePhotoUploadForm;