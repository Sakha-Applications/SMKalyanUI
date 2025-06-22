// D:\1. Data\1. Personal DOcument\00.SM\NewProject\dev\SMKalyanUI\src\components\UploadProfilePhoto\photoUploadUtils.js

import axios from 'axios';
import config from '../../config'; // Assuming this correctly points to your frontend config
import getBaseUrl from '../../utils/GetUrl'; // Assuming this utility correctly gets your app's base URL

// Function to get the API base URL. This should point to your SMKalyanBE server.
function getApiBaseUrl() {
  let url = config.apiUrl;
  if (!url || url.includes('${') || url === '') {
    console.warn('⚠️ Detected invalid API base URL in config, falling back to localhost:3001/api.');
    return `${getBaseUrl()}/api`; // Default to http://localhost:3001/api
  }
  // Ensure no trailing slash if apiUrl already has it, to avoid double slashes when joining paths
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// NOTE: PHOTO_BASE_URL is generally NOT needed anymore for displaying Azure blobs
// because your backend should now provide the FULL Azure URL directly (e.g., https://sakhastore.blob.core.windows.net/...).
// It might still be used for local placeholder images if your setup uses them.
// const PHOTO_BASE_URL = config.photoBaseUrl || getBaseUrl(); // Remove or adapt if not needed.


export const handleSearchCriteriaChange = (event, setSearchCriteria, setProfileData, setPhotos, setPhotoPreviews, setFetchError, setUploadedPhotos, setDefaultPhoto) => {
    const { name, value } = event.target;
    console.log('Debug (Utils): handleSearchCriteriaChange - Event Name:', name, 'Value:', value);
    setSearchCriteria((prevState) => {
        console.log('Debug (Utils): handleSearchCriteriaChange - Previous searchCriteria:', prevState);
        const updatedState = {
            ...prevState,
            [name]: value,
        };
        console.log('Debug (Utils): handleSearchCriteriaChange - Updated searchCriteria:', updatedState);
        return updatedState;
    });
    setProfileData(null);
    setPhotos([]);
    setPhotoPreviews([]);
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    console.log('Debug (Utils): handleSearchCriteriaChange - State reset complete.');
};

export const handleSearchProfile = async (searchCriteria, setProfileData, setFetchError, setSearching, setUploadedPhotos, setDefaultPhoto, setUploadError, getUploadedPhotosFn, fetchDefaultPhotoFn) => {
    setSearching(true);
    console.log('Debug (Utils): handleSearchProfile - searchCriteria:', searchCriteria);
    setProfileData(null); // Initialize profileData to null at the start
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    setUploadError(null);

    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): handleSearchProfile - Using API base URL:', apiBaseUrl);

    try {
        console.log('Debug (Utils): handleSearchProfile - Calling search profile API with:', searchCriteria);
        // Assuming your search-by-upload endpoint returns an array, potentially with profileId
        const response = await axios.post(`${apiBaseUrl}/search-by-upload`, searchCriteria);
        console.log('Debug (Utils): handleSearchProfile - Search profile API raw response:', response);
        console.log('Debug (Utils): handleSearchProfile - Search profile API response data:', response.data);

        // Adjust this logic based on your actual search-by-upload backend response structure
        // Assuming it returns an array of profiles and we take the first one, and it has a a valid ID field.
        if (Array.isArray(response.data) && response.data.length > 0) {
            const fetchedProfileData = response.data[0];
            // Normalize profileId to ensure we always use a consistent 'id' property for profileData
            const profileId = fetchedProfileData.id || fetchedProfileData.profileId; // Use 'id' or 'profileId'
            if (profileId) {
                // Ensure profileData always has an 'id' property for consistency
                setProfileData({ ...fetchedProfileData, id: profileId });
                console.log('Debug (Utils): handleSearchProfile - profileData set to:', { ...fetchedProfileData, id: profileId });
                console.log('Debug (Utils): handleSearchProfile - Profile ID found:', profileId, 'Fetching uploaded photos and default photo.');
                
                // Fetch photos from the backend (which now gets them from DB storing Azure URLs)
                await getUploadedPhotosFn(profileId, setUploadedPhotos, setFetchError, null);
                await fetchDefaultPhotoFn(profileId, setDefaultPhoto, setFetchError);
            } else {
                console.log('Debug (Utils): handleSearchProfile - No valid profile ID found in search response.');
                setFetchError('No profile found with a valid ID in the response.');
                setProfileData(null);
            }
        } else {
            console.log('Debug (Utils): handleSearchProfile - No profile found matching the search criteria.');
            setFetchError('No profile found matching the search criteria.');
            setProfileData(null);
        }
    } catch (error) {
        console.error('Debug (Utils): handleSearchProfile - Error searching profile:', error);
        setFetchError(error.response?.data?.message || 'Error searching for profile.');
        setProfileData(null); // Ensure profileData is null on error
    } finally {
        setSearching(false);
        console.log('Debug (Utils): handleSearchProfile - Searching complete.');
    }
};

export const handlePhotoChange = (event, setPhotos, setPhotoPreviews, setUploadError, uploadedPhotoCount) => {
    const files = Array.from(event.target.files);
    console.log('Debug (Utils): handlePhotoChange - Selected files:', files);

    const totalPhotos = (uploadedPhotoCount || 0) + files.length;

    if (totalPhotos > 5) { // Limit to 5 photos total (including existing ones)
        console.log('Debug (Utils): handlePhotoChange - More than 5 photos selected (including existing).');
        setUploadError(`You can upload a maximum of 5 photos. You currently have ${uploadedPhotoCount || 0} uploaded.`);
        event.target.value = null; // Clear the file input immediately
        return;
    }

    setUploadError(null); // Clear any previous error message
    setPhotos(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
    console.log('Debug (Utils): handlePhotoChange - Photos state updated:', files);
    console.log('Debug (Utils): handlePhotoChange - Photo previews updated:', previews);
};

export const handleUploadPhotos = async (profileData, photos, isDefaultPhoto, setUploading, setUploadError, setPhotosState, setPhotoPreviews, setIsDefaultPhoto, getUploadedPhotosFn, fetchDefaultPhotoFn, setUploadedPhotos, setDefaultPhoto, setGettingPhotosFn, setFetchError) => {
    console.log('Debug (Utils): handleUploadPhotos - profileData received:', profileData);
    if (!profileData || !profileData.id) { // Use profileData.id as the normalized ID
        setUploadError('Please search and select a profile first before uploading photos.');
        console.log('Debug (Utils): handleUploadPhotos - No valid profile data or profile ID.');
        return;
    }
    if (photos.length === 0) {
        setUploadError('Please select photos to upload.');
        console.log('Debug (Utils): handleUploadPhotos - No photos selected for upload.');
        return;
    }

    setUploading(true);
    setUploadError(null);
    console.log('Debug (Utils): handleUploadPhotos - Uploading started for profile ID:', profileData.id, 'Number of photos:', photos.length, 'isDefault:', isDefaultPhoto);

    const formData = new FormData();
    photos.forEach(photo => {
        formData.append('photos', photo); // 'photos' must match backend's `upload.array('photos')`
    });
    formData.append('profile_id', profileData.id); // Ensure this matches backend expected key
    formData.append('email', profileData.email || ''); // Pass email if available
    formData.append('is_default', isDefaultPhoto); // Pass as boolean, backend converts to 'true'/'false' or number

    console.log('Debug (Utils): handleUploadPhotos - FormData contents (not directly loggable):', formData);

    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): handleUploadPhotos - Calling upload photos API at:', `${apiBaseUrl}/upload-photos`);

    try {
        const response = await axios.post(`${apiBaseUrl}/upload-photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Axios handles this automatically for FormData, but good to note
            },
        });
        console.log('Debug (Utils): handleUploadPhotos - Upload photos API response:', response.data);
        
        // Clear frontend selection and flag
        setPhotosState([]);
        setPhotoPreviews([]);
        setIsDefaultPhoto(false);

        // Refresh the uploaded photos list and default photo from the backend
        await getUploadedPhotosFn(profileData.id, setUploadedPhotos, setFetchError, setGettingPhotosFn);
        await fetchDefaultPhotoFn(profileData.id, setDefaultPhoto, setFetchError);
        
        console.log('Debug (Utils): handleUploadPhotos - Upload successful, fetched updated photos and default photo from backend.');
    } catch (error) {
        console.error('Debug (Utils): handleUploadPhotos - Error uploading photos:', error);
        setUploadError(error.response?.data?.message || 'Error uploading photos. Please try again.');
        console.log('Debug (Utils): handleUploadPhotos - Upload failed:', error);
    } finally {
        setUploading(false);
        console.log('Debug (Utils): handleUploadPhotos - Upload process complete.');
    }
};

export const getUploadedPhotos = async (profileId, setUploadedPhotos, setFetchError, setGettingPhotos) => {
    if (!profileId) {
        console.log('Debug (Utils): getUploadedPhotos - No profile ID provided.');
        setUploadedPhotos([]); // Clear photos if no profileId
        return;
    }
    if (setGettingPhotos) setGettingPhotos(true);
    setFetchError(null);
    console.log('Debug (Utils): getUploadedPhotos - Fetching uploaded photos for profile ID:', profileId);

    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): getUploadedPhotos - Calling get photos API at:', `${apiBaseUrl}/get-photos?profileId=${profileId}`);

    try {
        const response = await axios.get(`${apiBaseUrl}/get-photos?profileId=${profileId}`);
        console.log('Debug (Utils): getUploadedPhotos - API response:', response.data);

        if (response.data && Array.isArray(response.data)) {
            // Assume backend provides 'id', 'fullUrl' (full Azure URL), and 'blobName' (for deletion)
            const formattedPhotos = response.data.map(photo => {
                if (!photo.id || !photo.fullUrl || !photo.blobName) {
                    console.warn('Debug (Utils): getUploadedPhotos - Incomplete photo data received from backend:', photo);
                    return null; // Skip incomplete entries
                }
                return {
                    id: photo.id, // Photo ID from your database
                    fullUrl: photo.fullUrl, // This is the full Azure Blob URL
                    blobName: photo.blobName, // The unique name within Azure container, needed for deletion
                    isDefault: photo.isDefault || false // Ensure boolean
                };
            }).filter(Boolean); // Filter out any null entries

            setUploadedPhotos(formattedPhotos);
            console.log('Debug (Utils): getUploadedPhotos - Uploaded photos state updated:', formattedPhotos);
        } else {
            setUploadedPhotos([]); // No photos or unexpected response format
        }
    } catch (error) {
        console.error('Debug (Utils): getUploadedPhotos - Error fetching photos:', error);
        setFetchError(error.response?.data?.message || 'Error fetching uploaded photos. Please try again.');
        setUploadedPhotos([]);
    } finally {
        if (setGettingPhotos) setGettingPhotos(false);
        console.log('Debug (Utils): getUploadedPhotos - Fetch complete.');
    }
};

export const fetchDefaultPhoto = async (profileId, setDefaultPhoto, setFetchError) => {
    if (!profileId) {
        setDefaultPhoto(null);
        console.log('Debug (Utils): fetchDefaultPhoto - No profile ID provided.');
        return;
    }
    setFetchError(null);
    console.log('Debug (Utils): fetchDefaultPhoto - Fetching default photo for profile ID:', profileId);

    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): fetchDefaultPhoto - Calling get default photo API at:', `${apiBaseUrl}/get-default-photo?profileId=${profileId}`);

    try {
        const response = await axios.get(`${apiBaseUrl}/get-default-photo?profileId=${profileId}`);
        console.log('Debug (Utils): fetchDefaultPhoto - API response:', response.data);

        // Assume backend provides 'id', 'fullUrl' (full Azure URL), and 'blobName' if a default photo exists
        if (response.data && response.data.id && response.data.fullUrl && response.data.blobName) {
            setDefaultPhoto({
                id: response.data.id,
                fullUrl: response.data.fullUrl, // This is the full Azure Blob URL
                blobName: response.data.blobName // Needed for deletion from Azure
            });
            console.log('Debug (Utils): fetchDefaultPhoto - Default photo state updated:', response.data);
        } else {
            setDefaultPhoto(null);
            console.log('Debug (Utils): fetchDefaultPhoto - No default photo found or incomplete data received.');
        }
    } catch (error) {
        console.error('Debug (Utils): fetchDefaultPhoto - Error fetching default photo:', error);
        setFetchError(error.response?.data?.message || 'Error fetching default photo. Please try again.');
        setDefaultPhoto(null);
    }
};

export const deletePhoto = async (photoId, blobName, setDeleteError, setDeletingPhoto, onDeleteSuccess) => {
    if (!photoId || !blobName) { // Require both for deletion
        setDeleteError("Photo ID and Blob Name are required for deletion.");
        console.log('Debug (Utils): deletePhoto - No photo ID or Blob Name provided for deletion.');
        return;
    }

    setDeletingPhoto(true);
    setDeleteError(null);
    console.log('Debug (Utils): deletePhoto - Deleting photo ID:', photoId, 'Blob Name:', blobName);

    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): deletePhoto - Calling delete photo API at:', `${apiBaseUrl}/delete-photo?photoId=${photoId}&blobName=${blobName}`);

    try {
        // Send both photoId (for database deletion) and blobName (for Azure deletion) as query parameters
        const response = await axios.delete(`${apiBaseUrl}/delete-photo?photoId=${photoId}&blobName=${blobName}`);
        console.log('Debug (Utils): deletePhoto - API response:', response.data);
        setDeleteError(null); // Clear any previous delete error
        console.log('Debug (Utils): deletePhoto - Photo deleted successfully from backend.');

        if (onDeleteSuccess && typeof onDeleteSuccess === 'function') {
            await onDeleteSuccess(); // Refresh photos list after successful deletion
        }
    } catch (error) {
        console.error('Debug (Utils): deletePhoto - Error deleting photo:', error);
        setDeleteError(error.response?.data?.message || 'Error deleting photo. Please try again.');
        console.log('Debug (Utils): deletePhoto - Delete failed:', error);
    } finally {
        setDeletingPhoto(false);
        console.log('Debug (Utils): deletePhoto - Delete process complete.');
    }
};
