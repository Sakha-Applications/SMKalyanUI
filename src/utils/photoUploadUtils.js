// src/components/uploadProfilePhoto/photoUploadUtils.js

import axios from 'axios';

const API_BASE_URL = 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net'; // Define your API base URL

export const handleSearchCriteriaChange = (event, setSearchCriteria, setProfileData, setPhotos, setPhotoPreviews, setFetchError, setUploadedPhotos, setDefaultPhoto) => {
    const { name, value } = event.target;
    setSearchCriteria((prevState) => { // Corrected: Added block for clarity (though not strictly needed for the fix)
        console.log('Debug: handleSearchCriteriaChange - Previous searchCriteria:', prevState);
        const updatedState = {
            ...prevState,
            [name]: value,
        };
        console.log('Debug: handleSearchCriteriaChange - Updated searchCriteria:', updatedState);
        return updatedState;
    });
    setProfileData(null);
    setPhotos([]);
    setPhotoPreviews([]);
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
};

export const handleSearchProfile = async (searchCriteria, setProfileData, setFetchError, setSearching, setUploadedPhotos, setDefaultPhoto, setUploadError, getUploadedPhotosFn, fetchDefaultPhotoFn) => {
    setSearching(true);
    console.log('Debug: handleSearchProfile - searchCriteria:', searchCriteria);
    setProfileData(null);
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    setUploadError(null);
    try {
        console.log('Debug: handleSearchProfile - Calling search profile API with:', searchCriteria);
        const response = await axios.post(`${API_BASE_URL}/api/search-by-upload`, searchCriteria); // <---- ENSURE THIS IS CORRECT IN THIS FILE
        console.log('Debug: handleSearchProfile - Search profile API response:', response.data);
        setProfileData(response.data);
        if (response.data && response.data.profileId) {
            console.log('Debug: handleSearchProfile - Profile ID found:', response.data.profileId, 'Fetching uploaded photos and default photo.');
            await getUploadedPhotosFn(response.data.profileId, setUploadedPhotos, setFetchError);
            await fetchDefaultPhotoFn(response.data.profileId, setDefaultPhoto, setFetchError);
        } else {
            console.log('Debug: handleSearchProfile - No profile ID found in response.');
        }
    } catch (error) {
        console.error('Error searching profile:', error);
        setFetchError('Error searching for profile.');
    } finally {
        setSearching(false);
        console.log('Debug: handleSearchProfile - Searching complete.');
    }
};

export const handlePhotoChange = (event, setPhotos, setPhotoPreviews) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
        alert('You can upload a maximum of 5 photos.');
        event.target.value = null; // Clear the file input
        return;
    }

    setPhotos(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
    console.log('Debug: handlePhotoChange - Photos selected:', files);
    console.log('Debug: handlePhotoChange - Photo previews:', previews);
};

export const handleUploadPhotos = async (profileData, photos, isDefaultPhoto, setUploading, setUploadError, setPhotos, setPhotoPreviews, setIsDefaultPhoto, getUploadedPhotosFn, fetchDefaultPhotoFn, setUploadedPhotos, setDefaultPhoto) => {
    if (!profileData || !profileData.profileId) {
        setUploadError('Please search and select a profile first.');
        console.log('Debug: handleUploadPhotos - No profile data or profile ID.');
        return;
    }
    if (photos.length === 0) {
        setUploadError('Please select photos to upload.');
        console.log('Debug: handleUploadPhotos - No photos selected for upload.');
        return;
    }

    setUploading(true);
    setUploadError(null);
    console.log('Debug: handleUploadPhotos - Uploading started for profile ID:', profileData.profileId, 'Number of photos:', photos.length, 'isDefault:', isDefaultPhoto);

    const formData = new FormData();
    photos.forEach(photo => {
        formData.append('photos', photo);
    });
    formData.append('profile_id', profileData.profileId);
    formData.append('email', profileData.email || ''); // Assuming email might be in profileData
    formData.append('is_default', isDefaultPhoto);

    try {
        console.log('Debug: handleUploadPhotos - Calling upload photos API with FormData:', formData);
        const response = await axios.post(`${API_BASE_URL}/upload-photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Debug: handleUploadPhotos - Upload photos API response:', response.data);
        setPhotos([]);
        setPhotoPreviews([]);
        setIsDefaultPhoto(false);
        await getUploadedPhotosFn(profileData.profileId, setUploadedPhotos, null); // Clear error on successful upload
        await fetchDefaultPhotoFn(profileData.profileId, setDefaultPhoto, null); // Clear error on successful upload
        console.log('Debug: handleUploadPhotos - Upload successful, fetched updated photos and default photo.');
    } catch (error) {
        console.error('Error uploading photos:', error);
        setUploadError('Error uploading photos.');
        console.log('Debug: handleUploadPhotos - Upload failed:', error);
    } finally {
        setUploading(false);
        console.log('Debug: handleUploadPhotos - Upload process complete.');
    }
};

export const getUploadedPhotos = async (profileId, setUploadedPhotos, setFetchError, setGettingPhotos) => {
    if (!profileId) {
        console.log('Debug: getUploadedPhotos - No profile ID provided.');
        return;
    }
    setGettingPhotos(true);
    setFetchError(null);
    console.log('Debug: getUploadedPhotos - Fetching uploaded photos for profile ID:', profileId);
    try {
        const response = await axios.get(`${API_BASE_URL}/get-photos?profileId=${profileId}`);
        console.log('Debug: getUploadedPhotos - API response:', response.data);
        setUploadedPhotos(response.data.map(photo => ({
            path: photo.photo_path.replace(/\\/g, '/').split('/').pop(), // Adjust path for frontend display
            isDefault: photo.is_default,
        })));
    } catch (error) {
        console.error('Error fetching photos:', error);
        setFetchError('Error fetching uploaded photos.');
        console.log('Debug: getUploadedPhotos - Fetch failed:', error);
    } finally {
        setGettingPhotos(false);
        console.log('Debug: getUploadedPhotos - Fetch complete.');
    }
};

export const fetchDefaultPhoto = async (profileId, setDefaultPhoto, setFetchError) => {
    if (!profileId) {
        setDefaultPhoto(null);
        console.log('Debug: fetchDefaultPhoto - No profile ID provided.');
        return;
    }
    setFetchError(null);
    console.log('Debug: fetchDefaultPhoto - Fetching default photo for profile ID:', profileId);
    try {
        const response = await axios.get(`${API_BASE_URL}/get-default-photo?profileId=${profileId}`);
        console.log('Debug: fetchDefaultPhoto - API response:', response.data);
        setDefaultPhoto(response.data ? response.data.filename : null);
    } catch (error) {
        console.error('Error fetching default photo:', error);
        setFetchError('Error fetching default photo.');
        console.log('Debug: fetchDefaultPhoto - Fetch failed:', error);
    }
};