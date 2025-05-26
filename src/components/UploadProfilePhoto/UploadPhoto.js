// src/components/UploadProfilePhoto/photoUploadUtils.js
import axios from 'axios';
// import config from '../../config'; // Import the config
import getBaseUrl from '../../utils/GetUrl';

// Use config for API URL
const API_URL = `${getBaseUrl()}`;
const PHOTO_BASE_URL = config.photoBaseUrl || API_URL;

// Search Profile Function
export const handleSearchProfile = async (
    searchCriteria, 
    setProfileData, 
    setFetchError, 
    setSearching, 
    setUploadedPhotos, 
    setDefaultPhoto,
    setUploadError,
    getUploadedPhotosFunc,
    fetchDefaultPhotoFunc
) => {
    setProfileData(null);
    setFetchError(null);
    setSearching(true);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    if (setUploadError) {
        setUploadError(null);
    }
    
    try {
        const response = await axios.post(`${API_URL}/api/search-by-upload`, searchCriteria);
        const data = response.data;
        if (data && data.length > 0) {
            setProfileData(data[0]);
            if (getUploadedPhotosFunc) {
                await getUploadedPhotosFunc(data[0].id, setUploadedPhotos, setFetchError);
            }
            if (fetchDefaultPhotoFunc) {
                await fetchDefaultPhotoFunc(data[0].id, setDefaultPhoto, setFetchError);
            }
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

// Handle Photo Selection
export const handlePhotoChange = (event, setPhotos, setPhotoPreviews, setUploadError, currentPhotoCount) => {
    const files = Array.from(event.target.files);
    
    // Check if adding these photos would exceed the 5 photo limit
    if (files.length + currentPhotoCount > 5) {
        setUploadError(`You can only upload a maximum of 5 photos (${currentPhotoCount} already uploaded).`);
        return;
    }
    
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
export const handleUploadPhotos = async (
    profileData, 
    photos, 
    isDefaultPhoto, 
    setUploading, 
    setUploadError, 
    setPhotosState, 
    setPhotoPreviews, 
    setIsDefaultPhoto,
    getUploadedPhotosFunc,
    fetchDefaultPhotoFunc,
    setUploadedPhotos,
    setDefaultPhoto,
    setGettingPhotos,
    setFetchError
) => {
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
    formDataToSend.append('is_default', isDefaultPhoto ? 'true' : 'false');
    photos.forEach(photo => {
        formDataToSend.append('photos', photo);
    });

    try {
        const response = await axios.post(`${API_URL}/api/upload-photos`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (response.status === 200) {
            alert('Photos uploaded successfully!');
            setPhotosState([]);
            setPhotoPreviews([]);
            setIsDefaultPhoto(false);
            
            // Refresh the photos list
            if (getUploadedPhotosFunc) {
                await getUploadedPhotosFunc(
                    profileData.id, 
                    setUploadedPhotos, 
                    setFetchError,
                    setGettingPhotos
                );
            }
            
            // Refresh the default photo
            if (fetchDefaultPhotoFunc) {
                await fetchDefaultPhotoFunc(
                    profileData.id, 
                    setDefaultPhoto,
                    setFetchError
                );
            }
        } else {
            setUploadError(response.data.message || 'Failed to upload photos.');
        }
    } catch (error) {
        console.error("Upload error:", error);
        setUploadError(error.response?.data?.message || 'Error uploading photos.');
    } finally {
        setUploading(false);
    }
};

// Get Uploaded Photos
export const getUploadedPhotos = async (profileId, setUploadedPhotos, setFetchError, setGettingPhotos) => {
    if (setGettingPhotos) {
        setGettingPhotos(true);
    }
    
    try {
        const response = await axios.get(`${API_URL}/api/get-photos?profileId=${profileId}`);
        
        if (response.data && Array.isArray(response.data)) {
            // Transform the response data to include full URLs
            setUploadedPhotos(response.data.map(photo => {
                // Extract filename from the photo path
                const normalizedPath = photo.photo_path.replace(/\\/g, '/');
                const parts = normalizedPath.split('/');
                const filename = parts[parts.length - 1];
                
                return {
                    id: photo.id,
                    path: `ProfilePhotos/${filename}`,
                    fullUrl: `${PHOTO_BASE_URL}/ProfilePhotos/${filename}`,
                    isDefault: photo.is_default === 1 || photo.is_default === true
                };
            }));
        } else {
            setUploadedPhotos([]);
        }
    } catch (error) {
        console.error("Error fetching photos:", error);
        setFetchError("Failed to load uploaded photos.");
        setUploadedPhotos([]);
    } finally {
        if (setGettingPhotos) {
            setGettingPhotos(false);
        }
    }
};

// Get Default Photo
export const fetchDefaultPhoto = async (profileId, setDefaultPhoto, setFetchError) => {
    try {
        const response = await axios.get(`${API_URL}/api/get-default-photo?profileId=${profileId}`);
        if (response.data && response.data.photo_path) {
            // Extract filename from the photo path
            const normalizedPath = response.data.photo_path.replace(/\\/g, '/');
            const parts = normalizedPath.split('/');
            const filename = parts[parts.length - 1];
            
            setDefaultPhoto(`${PHOTO_BASE_URL}/ProfilePhotos/${filename}`);
        } else {
            setDefaultPhoto(null);
        }
    } catch (error) {
        console.error("Error fetching default photo:", error);
        if (setFetchError) {
            setFetchError("Failed to load default photo.");
        }
        setDefaultPhoto(null);
    }
};

// Delete Photo
export const deletePhoto = async (photoId, setDeleteError, setDeletingPhoto, onSuccess) => {
    if (!photoId) {
        setDeleteError("No photo ID provided for deletion");
        return;
    }
    
    setDeletingPhoto(true);
    setDeleteError(null);
    
    try {
        const response = await axios.delete(`${API_URL}/api/delete-photo/${photoId}`);
        
        if (response.status === 200) {
            alert('Photo deleted successfully!');
            if (onSuccess && typeof onSuccess === 'function') {
                await onSuccess();
            }
        } else {
            setDeleteError(response.data.message || 'Failed to delete photo.');
        }
    } catch (error) {
        console.error("Delete error:", error);
        setDeleteError(error.response?.data?.message || 'Error deleting photo.');
    } finally {
        setDeletingPhoto(false);
    }
};