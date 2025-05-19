// src/components/UploadProfilePhoto/ProfilePhotoUploadForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Grid, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import config from '../../config'; // Import the config
import {
    handleSearchCriteriaChange,
    handleSearchProfile,
    handlePhotoChange,
    handleUploadPhotos,
    getUploadedPhotos,
    fetchDefaultPhoto,
    deletePhoto
} from './photoUploadUtils';

const DEFAULT_PLACEHOLDER = '/assets/placeholder-image.png';
const ERROR_PLACEHOLDER = '/assets/image-error.png';

const ProfilePhotoUploadForm = () => {
    const navigate = useNavigate();
    const [loggedInEmail, setLoggedInEmail] = useState('');
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
    const [isFileInputDisabled, setFileInputDisabled] = useState(true);
    const [deletingPhoto, setDeletingPhoto] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [failedImages, setFailedImages] = useState(new Set());
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);

    useEffect(() => {
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setLoggedInEmail(emailFromStorage);
            setSearchCriteria(prevState => ({ ...prevState, email: emailFromStorage }));
        }
    }, []);

    const handleSearchCriteriaChangeLocal = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setLoggedInEmail(value);
        }
        setSearchCriteria(prevState => ({ ...prevState, [name]: value }));
        setProfileData(null);
        setPhotos([]);
        setPhotoPreviews([]);
        setFetchError(null);
        setUploadedPhotos([]);
        setDefaultPhoto(null);
        setUploadError(null);
        setFileInputDisabled(true);
        setFailedImages(new Set());
    };

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
                setUploadedPhotos,
                setDefaultPhoto,
                setUploadError,
                (profileId, uploadedPhotosSetter, fetchErrorSetter) => getUploadedPhotos(profileId, uploadedPhotosSetter, fetchErrorSetter, setGettingPhotos),
                fetchDefaultPhoto
            );
        } finally {
            if (isMounted) {
                setSearching(false);
            }
        }
    };

    const handlePhotoChangeLocal = (event) => {
        handlePhotoChange(event, setPhotos, setPhotoPreviews, setUploadError, uploadedPhotos.length);
    };

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
                getUploadedPhotos,
                fetchDefaultPhoto,
                setUploadedPhotos,
                setDefaultPhoto,
                setGettingPhotos,
                setFetchError
            );
            if (isMounted) {
                setFailedImages(new Set());
            }
        } finally {
            if (isMounted) {
                setUploading(false);
            }
        }
    };

    const handleDeletePhoto = async (photoId) => {
        setDeletingPhoto(true);
        try {
            await deletePhoto(
                photoId,
                setDeleteError,
                setDeletingPhoto,
                async () => {
                    if (isMounted && profileData && profileData.profileId) {
                        setFailedImages(new Set());
                        await getUploadedPhotos(
                            profileData.profileId,
                            setUploadedPhotos,
                            setFetchError,
                            setGettingPhotos
                        );
                        await fetchDefaultPhoto(
                            profileData.profileId,
                            setDefaultPhoto,
                            setFetchError
                        );
                    }
                }
            );
        } finally {
            if (isMounted) {
                setDeletingPhoto(false);
            }
        }
    };

    const SafeImage = ({ src, alt, style, isDefault }) => {
        const imgRef = React.useRef(null);
        const [imgSrc, setImgSrc] = useState(src || DEFAULT_PLACEHOLDER);
        const [hasErrored, setHasErrored] = useState(failedImages.has(src));

        useEffect(() => {
            if (src && src !== imgSrc && !failedImages.has(src)) {
                setImgSrc(src);
                setHasErrored(false);
            }
        }, [src]);

        const handleError = () => {
            if (!hasErrored && src) {
                console.warn(`Image failed to load: ${src}`);
                if (isMounted) {
                    setFailedImages(prev => {
                        const newSet = new Set(prev);
                        newSet.add(src);
                        return newSet;
                    });
                    setHasErrored(true);
                    setImgSrc(ERROR_PLACEHOLDER);
                }
            }
        };

        return (
            <img
                ref={imgRef}
                src={hasErrored ? ERROR_PLACEHOLDER : imgSrc}
                alt={alt}
                style={style}
                onError={handleError}
            />
        );
    };

    const getValidImageUrl = (url) => {
        if (!url) return DEFAULT_PLACEHOLDER;
        if (failedImages.has(url)) return ERROR_PLACEHOLDER;

        try {
            if (url.startsWith('http')) {
                const imageUrl = new URL(url);
                if (!imageUrl.searchParams.has('_cb')) {
                    const cacheBuster = Math.floor(Date.now() / 60000);
                    imageUrl.searchParams.append('_cb', cacheBuster);
                }
                return imageUrl.toString();
            } else {
                const cacheBuster = Math.floor(Date.now() / 60000);
                return url.includes('?') ? `${url}&_cb=${cacheBuster}` : `${url}?_cb=${cacheBuster}`;
            }
        } catch (e) {
            console.error('Error parsing URL:', e);
            return url;
        }
    };

    useEffect(() => {
        if (profileData && !searching) {
            if (uploadedPhotos.length >= 5) {
                setFileInputDisabled(true);
                setUploadError('You have already uploaded the maximum of 5 photos.');
            } else {
                setFileInputDisabled(false);
                setUploadError(null);
            }
        } else {
            setFileInputDisabled(true);
        }
    }, [profileData, searching, uploadedPhotos.length]);

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
                        onChange={handleSearchCriteriaChangeLocal}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={searchCriteria.email}
                        onChange={handleSearchCriteriaChangeLocal}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={searchCriteria.phone}
                        onChange={handleSearchCriteriaChangeLocal}
                    />
                </Grid>
                <Grid item xs={12}>
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
                <>
                    <Typography variant="h6" sx={{ mt: 4 }}>Profile Details</Typography>
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
                        disabled={isFileInputDisabled}
                    />

                    {uploadError && <Typography color="error" sx={{ mt: 2 }}>{uploadError}</Typography>}

                    {photoPreviews.length > 0 && (
                        <div style={{ display: 'flex', marginTop: 10 }}>
                            {photoPreviews.map((preview, index) => (
                                <div key={index} style={{ marginRight: 10 }}>
                                    <SafeImage
                                        src={preview}
                                        alt={`preview-${index}`}
                                        style={{ width: 80, height: 80, objectFit: 'cover' }}
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
                            />
                        }
                        label="Set as Default Photo"
                        sx={{ mt: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUploadPhotosLocal}
                        disabled={photos.length === 0 || uploading || !profileData || isFileInputDisabled}
                        sx={{ mt: 2 }}
                    >
                        {uploading ? <><CircularProgress size={20} sx={{ mr: 1 }} /> Uploading...</> : 'Upload Photos'}
                    </Button>

                    <Typography variant="h6" sx={{ mt: 4 }}>Uploaded Photos</Typography>

                    {gettingPhotos ? (
                        <CircularProgress sx={{ mt: 2 }} />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
                            {uploadedPhotos.length > 0 ? (
                                uploadedPhotos.map((photo, index) => (
                                    <div key={index} style={{ position: 'relative', marginRight: 10, marginBottom: 10 }}>
                                        <div style={{ border: '1px solid #ccc', padding: 5 }}>
                                            <SafeImage
                                                src={getValidImageUrl(photo.fullUrl)}
                                                alt={`uploaded-${index}`}
                                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                                            />
                                            {photo.isDefault && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 30,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Default
                                                </div>
                                            )}
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeletePhoto(photo.id)}
                                                disabled={deletingPhoto}
                                                sx={{ mt: 1, fontSize: '0.7rem', p: '2px 8px', width: '100%' }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Typography>No photos uploaded yet.</Typography>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: 20 }}>
                        <Typography variant="h6">Default Photo</Typography>
                        {defaultPhoto ? (
                            <div style={{ marginTop: 10 }}>
                                <SafeImage
                                    src={getValidImageUrl(defaultPhoto.fullUrl)}
                                    alt="Default profile photo"
                                    style={{ width: 150, height: 150, objectFit: 'cover', border: '2px solid #4CAF50' }}
                                    isDefault={true}
                                />
                            </div>
                        ) : (
                            <Typography>No default photo set.</Typography>
                        )}
                    </div>

                    {deleteError && <Typography color="error" sx={{ mt: 2 }}>{deleteError}</Typography>}

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/dashboard')}
                        sx={{ mt: 3 }}
                    >
                        Back to Dashboard
                    </Button>
                </>
            )}
        </Paper>
    );
};

export default ProfilePhotoUploadForm;
