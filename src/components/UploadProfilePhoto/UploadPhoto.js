// src/utils/photoUploadUtils.js
import axios from 'axios';
import config from '../config'; // Import the config

// Use config for API URL
const API_URL = config.apiUrl;
const PHOTO_BASE_URL = config.photoBaseUrl;

// Search Profile Function
export const handleSearchProfile = async (searchCriteria, setProfileData, setFetchError, setSearching, setUploadedPhotos, setDefaultPhoto) => {
    setProfileData(null);
    setFetchError(null);
    setSearching(true);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    try {
        const response = await axios.post(`${API_URL}/search-by-upload`, searchCriteria);
        const data = response.data;
        if (data && data.length > 0) {
            setProfileData(data[0]);
            await getUploadedPhotos(data[0].id, setUploadedPhotos, setUploadError);
            await fetchDefaultPhoto(data[0].id, setDefaultPhoto);
        } else {
            setFetchError('No profile found matching the search criteria.');
        }
    } catch (error) {
        console.error("Search error:", error);
        if (error.response) {
            setFetchError(error.response.data.message || 'Profile not found');
        } else if (error.request) {
            setFetchError('Error connecting to the server.');
        } else {
            setFetchError('An unexpected error occurred.');
        }
    } finally {
        setSearching(false);
    }
};

// Handle Search Criteria
export const handleSearchCriteriaChange = (event, setSearchCriteria, setProfileData, setPhotos, setPhotoPreviews, setFetchError, setUploadedPhotos, setDefaultPhoto) => {
    const { name, value } = event.target;
    setSearchCriteria(prevState => ({
        ...prevState,
        [name]: value,
    }));
    setProfileData(null);
    setPhotos([]);
    setPhotoPreviews([]);
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
};

// Handle Photo Selection
export const handlePhotoChange = (event, setPhotos, setPhotoPreviews) => {
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

// Handle Photo Upload
export const handleUploadPhotos = async (profileData, photos, isDefaultPhoto, setUploading, setUploadError, setPhotosState, setPhotoPreviews, setIsDefaultPhoto, getUploadedPhotos, fetchDefaultPhoto) => {
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
    formDataToSend.append('profile_id', profileData.id);
    formDataToSend.append('email', profileData.email);
    formDataToSend.append('is_default', isDefaultPhoto);
    photos.forEach(photo => {
        formDataToSend.append('photos', photo);
    });

    try {
        const response = await axios.post(`${API_URL}/upload-photos`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            alert('Photos uploaded successfully!');
            setPhotosState([]);
            setPhotoPreviews([]);
            setIsDefaultPhoto(false);
            await getUploadedPhotos(profileData.id);
            await fetchDefaultPhoto(profileData.id);
        } else {
            setUploadError(response.data.message || 'Failed to upload photos.');
        }
    } catch (error) {
        setUploadError('Error uploading photos.');
    } finally {
        setUploading(false);
    }
};

// Get Uploaded Photos
export const getUploadedPhotos = async (profileId, setUploadedPhotos, setUploadError) => {
    try {
        const response = await axios.get(`${API_URL}/get-photos?profileId=${profileId}`);
        
        // Transform the response data to use the configured photo base URL
        setUploadedPhotos(response.data.map(photo => {
            // Extract filename from the photo path
            const normalizedPath = photo.photo_path.replace(/\\/g, '/');
            const parts = normalizedPath.split('/');
            const filename = parts[parts.length - 1];
            
            return {
                path: `ProfilePhotos/${filename}`,
                isDefault: photo.is_default
            };
        }));
    } catch (error) {
        console.error("Error fetching photos:", error);
        setUploadError("Failed to load uploaded photos.");
    }
};

// Get Default Photo
export const fetchDefaultPhoto = async (profileId, setDefaultPhoto) => {
    try {
        const response = await axios.get(`${API_URL}/get-default-photo?profileId=${profileId}`);
        if (response.data) {
            // Extract filename from the photo path
            const normalizedPath = response.data.photo_path.replace(/\\/g, '/');
            const parts = normalizedPath.split('/');
            const filename = parts[parts.length - 1];
            
            setDefaultPhoto(`ProfilePhotos/${filename}`);
        } else {
            setDefaultPhoto(null);
        }
    } catch (error) {
        console.error("Error fetching default photo:", error);
        setDefaultPhoto(null);
    }
};