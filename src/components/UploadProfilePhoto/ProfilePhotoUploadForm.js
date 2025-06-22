// D:\1. Data\1. Personal DOcument\00.SM\NewProject\dev\SMKalyanUI\src\components\UploadProfilePhoto\ProfilePhotoUploadForm.js

import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Grid, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// Removed direct config import as getApiBaseUrl in utils handles it
// import config from '../../config'; 
import getBaseUrl from '../../utils/GetUrl'; // Assuming this utility is for your frontend base URL

import {
    handleSearchCriteriaChange,
    handleSearchProfile,
    handlePhotoChange,
    handleUploadPhotos,
    getUploadedPhotos,
    fetchDefaultPhoto,
    deletePhoto
} from './photoUploadUtils'; // Ensure this path is correct

// Placeholders for images that fail to load or for default display
const DEFAULT_PLACEHOLDER = '/assets/placeholder-image.png'; // Assuming this path exists in your public folder
const ERROR_PLACEHOLDER = '/assets/image-error.png'; // Assuming this path exists in your public folder


const ProfilePhotoUploadForm = () => {
    const navigate = useNavigate();
    const [loggedInEmail, setLoggedInEmail] = useState('');
    const [searchCriteria, setSearchCriteria] = useState({ profileId: '', email: loggedInEmail, phone: '' });
    const [profileData, setProfileData] = useState(null);
    const [photos, setPhotos] = useState([]); // Files selected for upload
    const [photoPreviews, setPhotoPreviews] = useState([]); // URLs for local previews
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [fetchError, setFetchError] = useState(null); // Error fetching profile or existing photos
    const [searching, setSearching] = useState(false); // When searching for a profile
    const [uploadedPhotos, setUploadedPhotos] = useState([]); // Photos already uploaded to Azure/DB
    const [gettingPhotos, setGettingPhotos] = useState(false); // When fetching uploaded photos
    const [isDefaultPhoto, setIsDefaultPhoto] = useState(false); // Checkbox for setting default
    const [defaultPhoto, setDefaultPhoto] = useState(null); // The currently set default photo
    const [isFileInputDisabled, setFileInputDisabled] = useState(true); // Disable file input if max photos uploaded
    const [deletingPhoto, setDeletingPhoto] = useState(false); // When a photo is being deleted
    const [deleteError, setDeleteError] = useState(null); // Error during deletion
    const [failedImages, setFailedImages] = useState(new Set()); // To track images that failed to load
    const isMounted = useRef(false); // To prevent state updates on unmounted component

    // Effect to track component mount status
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Effect to get logged-in email from local storage on component mount
    useEffect(() => {
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setLoggedInEmail(emailFromStorage);
            // Update searchCriteria with logged-in email
            setSearchCriteria(prevState => ({ ...prevState, email: emailFromStorage }));
        }
    }, []);

    // Local handler for search criteria changes, resets relevant states
    const handleSearchCriteriaChangeLocal = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setLoggedInEmail(value); // Keep loggedInEmail state updated if email changes
        }
        setSearchCriteria(prevState => ({ ...prevState, [name]: value }));
        setProfileData(null); // Clear profile data
        setPhotos([]); // Clear selected photos
        setPhotoPreviews([]); // Clear photo previews
        setFetchError(null); // Clear fetch errors
        setUploadedPhotos([]); // Clear previously uploaded photos
        setDefaultPhoto(null); // Clear default photo
        setUploadError(null); // Clear upload errors
        setFileInputDisabled(true); // Disable file input until a profile is found
        setFailedImages(new Set()); // Clear failed image cache
    };

    // Local handler for searching a profile, wraps the utility function
    const handleSearchProfileLocal = async () => {
        setSearching(true);
        setFetchError(null);
        setUploadedPhotos([]);
        setDefaultPhoto(null);
        setFileInputDisabled(true);
        setUploadError(null);
        setFailedImages(new Set());

        try {
            await handleSearchProfile(
                searchCriteria,
                setProfileData,
                setFetchError,
                setSearching,
                setUploadedPhotos, // This will be populated with Azure URLs from backend
                setDefaultPhoto,    // This will be populated with Azure URL from backend
                setUploadError,
                // Pass a wrapped getUploadedPhotos to update gettingPhotos state
                (profileId, uploadedPhotosSetter, fetchErrorSetter) => getUploadedPhotos(profileId, uploadedPhotosSetter, fetchErrorSetter, setGettingPhotos),
                fetchDefaultPhoto
            );
        } finally {
            if (isMounted.current) { // Only update state if component is still mounted
                setSearching(false);
            }
        }
    };

    // Local handler for photo selection, wraps the utility function
    const handlePhotoChangeLocal = (event) => {
        handlePhotoChange(event, setPhotos, setPhotoPreviews, setUploadError, uploadedPhotos.length);
    };

    // Local handler for uploading photos, wraps the utility function
    const handleUploadPhotosLocal = async () => {
        setUploading(true);
        setUploadError(null);
        try {
            await handleUploadPhotos(
                profileData,
                photos,
                isDefaultPhoto,
                setUploading,
                setUploadError,
                setPhotos,
                setPhotoPreviews,
                setIsDefaultPhoto,
                getUploadedPhotos, // Pass the utility function directly
                fetchDefaultPhoto, // Pass the utility function directly
                setUploadedPhotos,
                setDefaultPhoto,
                setGettingPhotos,
                setFetchError
            );
            if (isMounted.current) {
                setFailedImages(new Set()); // Clear failed images cache on successful upload
            }
        } finally {
            if (isMounted.current) {
                setUploading(false);
            }
        }
    };

    // --- MODIFIED handleDeletePhoto function (from immersive above) ---
    const handleDeletePhoto = async (photoId, blobName) => {
        setDeletingPhoto(true);
        setDeleteError(null);

        try {
            await deletePhoto(
                photoId,
                blobName, // Pass the blobName to the utility function
                setDeleteError,
                setDeletingPhoto,
                async () => {
                    if (isMounted.current && profileData && profileData.id) {
                        setFailedImages(new Set());
                        await getUploadedPhotos(
                            profileData.id,
                            setUploadedPhotos,
                            setFetchError,
                            setGettingPhotos
                        );
                        await fetchDefaultPhoto(
                            profileData.id,
                            setDefaultPhoto,
                            setFetchError
                        );
                    }
                }
            );
        } catch (error) {
            console.error("Error in handleDeletePhoto local function:", error);
        } finally {
            if (isMounted.current) {
                setDeletingPhoto(false);
                console.log('Debug (Form): Delete process in form complete.');
            }
        }
    };
    // --- END MODIFIED handleDeletePhoto ---


    // Helper function for SafeImage component and direct image display
    // Ensures a valid URL and adds a cache buster to refresh images
    const getValidImageUrl = (url) => {
        if (!url) return DEFAULT_PLACEHOLDER;
        if (failedImages.has(url)) return ERROR_PLACEHOLDER;

        try {
            // If it's a full URL (like Azure Blob URL), add cache buster to search params
            if (url.startsWith('http')) {
                const imageUrl = new URL(url);
                // Add a cache buster based on minute for better caching but also refresh
                const cacheBuster = Math.floor(Date.now() / 60000);
                imageUrl.searchParams.set('_cb', cacheBuster); // Use set instead of append to prevent duplicates
                return imageUrl.toString();
            } else {
                // For relative paths (less likely with Azure Blobs, but for robustness)
                const cacheBuster = Math.floor(Date.now() / 60000);
                return url.includes('?') ? `${url}&_cb=${cacheBuster}` : `${url}?_cb=${cacheBuster}`;
            }
        } catch (e) {
            console.error('Error parsing URL for cache busting:', url, e);
            return url; // Return original URL if parsing fails
        }
    };

    // Custom Image component to handle load errors and display placeholders
    const SafeImage = ({ src, alt, style, isDefault }) => {
        const [imgSrc, setImgSrc] = useState(src || DEFAULT_PLACEHOLDER);
        const [hasErrored, setHasErrored] = useState(false);

        useEffect(() => {
            // Reset image source and error state when src prop changes
            if (src && src !== imgSrc && !failedImages.has(src)) {
                setImgSrc(src);
                setHasErrored(false);
            } else if (failedImages.has(src)) {
                setImgSrc(ERROR_PLACEHOLDER);
                setHasErrored(true);
            }
        }, [src, failedImages]); // Depend on src and failedImages set

        const handleError = () => {
            if (isMounted.current && !hasErrored && src) {
                console.warn(`Image failed to load: ${src}`);
                setFailedImages(prev => new Set(prev).add(src)); // Add to global failed images set
                setHasErrored(true);
                setImgSrc(ERROR_PLACEHOLDER); // Display error placeholder
            }
        };

        return (
            <img
                src={imgSrc}
                alt={alt}
                style={style}
                onError={handleError}
            />
        );
    };

    // Effect to disable file input if max photos are uploaded
    useEffect(() => {
        if (profileData && !searching) {
            if (uploadedPhotos.length >= 5) {
                setFileInputDisabled(true);
                setUploadError('You have already uploaded the maximum of 5 photos.');
            } else {
                setFileInputDisabled(false);
                setUploadError(null); // Clear previous upload error if space is available
            }
        } else {
            setFileInputDisabled(true); // Disable if no profile is selected
            setUploadError(null); // Clear upload error
        }
    }, [profileData, searching, uploadedPhotos.length]);


    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2, borderRadius: '12px' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
                Upload Photos to Profile
            </Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Profile ID"
                        name="profileId"
                        value={searchCriteria.profileId}
                        onChange={handleSearchCriteriaChangeLocal}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={searchCriteria.email}
                        onChange={handleSearchCriteriaChangeLocal}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={searchCriteria.phone}
                        onChange={handleSearchCriteriaChangeLocal}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSearchProfileLocal}
                        startIcon={<SearchIcon />}
                        disabled={searching || (!searchCriteria.profileId && !searchCriteria.email && !searchCriteria.phone)}
                        sx={{ mt: 2, borderRadius: '8px', padding: '10px 0' }}
                    >
                        {searching ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : 'Search Profile'}
                    </Button>
                </Grid>
            </Grid>

            {fetchError && (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center', backgroundColor: '#ffebee', p: 1, borderRadius: '8px' }}>
                    {fetchError}
                </Typography>
            )}

            {profileData && (
                <>
                    <Typography variant="h6" sx={{ mt: 4, color: '#424242', borderBottom: '1px solid #eee', pb: 1 }}>Profile Details</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>Name: {profileData.name}</Typography>
                    {profileData.current_age && <Typography variant="body1">Current Age: {profileData.current_age}</Typography>}
                    {profileData.gotra && <Typography variant="body1">Gotra: {profileData.gotra}</Typography>}

                    <div style={{ marginTop: 20 }}>
                        <input
                            type="file"
                            name="photos"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoChangeLocal}
                            disabled={isFileInputDisabled || uploading} // Disable during upload too
                            style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: isFileInputDisabled ? '#e0e0e0' : 'white' }}
                        />
                    </div>

                    {uploadError && (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center', backgroundColor: '#ffebee', p: 1, borderRadius: '8px' }}>
                            {uploadError}
                        </Typography>
                    )}

                    {photoPreviews.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 15, justifyContent: 'center' }}>
                            {photoPreviews.map((preview, index) => (
                                <div key={index} style={{ border: '1px solid #ccc', padding: 5, borderRadius: '8px', overflow: 'hidden' }}>
                                    <SafeImage
                                        src={preview}
                                        alt={`preview-${index}`}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
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
                                disabled={uploading} // Disable during upload
                            />
                        }
                        label="Set as Default Photo (for the first photo in this batch)"
                        sx={{ mt: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUploadPhotosLocal}
                        disabled={photos.length === 0 || uploading || isFileInputDisabled}
                        sx={{ mt: 2, borderRadius: '8px', padding: '10px 0', backgroundColor: '#f50057', '&:hover': { backgroundColor: '#c51162' } }}
                    >
                        {uploading ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Uploading...</> : 'Upload Photos'}
                    </Button>

                    <Typography variant="h6" sx={{ mt: 4, color: '#424242', borderBottom: '1px solid #eee', pb: 1 }}>Uploaded Photos</Typography>

                    {gettingPhotos ? (
                        <CircularProgress sx={{ mt: 2, display: 'block', margin: 'auto' }} />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: 15, justifyContent: 'center' }}>
                            {uploadedPhotos.length > 0 ? (
                                uploadedPhotos.map((photo, index) => (
                                    <div key={photo.id} style={{ position: 'relative', border: '1px solid #ddd', padding: 5, borderRadius: '8px', overflow: 'hidden', width: '120px', textAlign: 'center' }}>
                                        <SafeImage
                                            src={getValidImageUrl(photo.fullUrl)}
                                            alt={`uploaded-${index}`}
                                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px', display: 'block', margin: 'auto' }}
                                        />
                                        {photo.isDefault && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                background: 'rgba(76, 175, 80, 0.8)', // Green shade
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '5px',
                                                fontSize: '0.65rem',
                                                fontWeight: 'bold'
                                            }}>
                                                Default
                                            </div>
                                        )}
                                        {/* --- MODIFIED DELETE BUTTON --- */}
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            // IMPORTANT: Pass both photo.id (for DB) and photo.blobName (for Azure)
                                            onClick={() => handleDeletePhoto(photo.id, photo.blobName)}
                                            disabled={deletingPhoto}
                                            sx={{ mt: 1, fontSize: '0.65rem', p: '2px 8px', width: '100%', borderRadius: '6px', backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
                                        >
                                            {deletingPhoto ? <CircularProgress size={15} color="inherit" /> : 'Delete'}
                                        </Button>
                                        {/* --- END MODIFIED DELETE BUTTON --- */}
                                    </div>
                                ))
                            ) : (
                                <Typography sx={{ mt: 2, width: '100%', textAlign: 'center', color: '#666' }}>No photos uploaded yet for this profile.</Typography>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: 25, borderTop: '1px solid #eee', paddingTop: 20 }}>
                        <Typography variant="h6" sx={{ color: '#424242' }}>Default Profile Photo</Typography>
                        {defaultPhoto ? (
                            <div style={{ marginTop: 10, textAlign: 'center' }}>
                                <SafeImage
                                    src={getValidImageUrl(defaultPhoto.fullUrl)}
                                    alt="Default profile photo"
                                    style={{ width: 180, height: 180, objectFit: 'cover', border: '3px solid #4CAF50', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                    isDefault={true}
                                />
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: '#666' }}>This is the primary photo displayed.</Typography>
                            </div>
                        ) : (
                            <Typography sx={{ mt: 2, textAlign: 'center', color: '#666' }}>No default photo set for this profile.</Typography>
                        )}
                    </div>

                    {deleteError && (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center', backgroundColor: '#ffebee', p: 1, borderRadius: '8px' }}>
                            {deleteError}
                        </Typography>
                    )}

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/dashboard')}
                        sx={{ mt: 3, borderRadius: '8px', padding: '10px 0', borderColor: '#3f51b5', color: '#3f51b5', '&:hover': { borderColor: '#3f51b5', backgroundColor: '#e8eaf6' } }}
                    >
                        Back to Dashboard
                    </Button>
                </>
            )}
        </Paper>
    );
};

export default ProfilePhotoUploadForm;
