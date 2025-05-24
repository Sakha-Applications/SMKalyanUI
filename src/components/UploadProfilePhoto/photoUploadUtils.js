// src/components/UploadProfilePhoto/photoUploadUtils.js
import axios from 'axios';
import config from '../../config'; 

function getApiBaseUrl() {
  let url = config.apiUrl;
  if (!url || url.includes('${') || url === '') {
    console.warn('⚠️ Detected invalid API base URL, falling back to localhost.');
    return 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/';
  }
  return url;
}

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
        const response = await axios.post(`${apiBaseUrl}/search-by-upload`, searchCriteria);
        console.log('Debug (Utils): handleSearchProfile - Search profile API raw response:', response);
        console.log('Debug (Utils): handleSearchProfile - Search profile API response data:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].hasOwnProperty('profileId')) {
            const fetchedProfileData = response.data[0];
            setProfileData(fetchedProfileData); // Set profileData to the first object
            console.log('Debug (Utils): handleSearchProfile - profileData set to:', fetchedProfileData);
            const profileId = fetchedProfileData.profileId; // Extract the profileId
            console.log('Debug (Utils): handleSearchProfile - Profile ID found:', profileId, 'Fetching uploaded photos and default photo.');
            await getUploadedPhotosFn(profileId, setUploadedPhotos, setFetchError, null); // Passing null for setGettingPhotos here as it's handled in the form
            await fetchDefaultPhotoFn(profileId, setDefaultPhoto, setFetchError);
        } else {
            console.log('Debug (Utils): handleSearchProfile - No profile ID found in response.');
            setProfileData(null); // Ensure profileData is null when no profile is found
        }
    } catch (error) {
        console.error('Debug (Utils): handleSearchProfile - Error searching profile:', error);
        setFetchError('Error searching for profile.');
        setProfileData(null); // Ensure profileData is null on error
    } finally {
        setSearching(false);
        console.log('Debug (Utils): handleSearchProfile - Searching complete.');
    }
};

export const handlePhotoChange = (event, setPhotos, setPhotoPreviews, setUploadError, uploadedPhotoCount) => {
    const files = Array.from(event.target.files);
    console.log('Debug (Utils): handlePhotoChange - Selected files:', files);

    const totalPhotos = (uploadedPhotoCount || 0) + files.length; // Consider existing uploaded photos

    if (totalPhotos > 5) {
        console.log('Debug (Utils): handlePhotoChange - More than 5 photos selected (including existing).');
        setUploadError(`You can upload a maximum of 5 photos. You currently have ${uploadedPhotoCount || 0} uploaded.`); // More informative message
        event.target.value = null; // Clear the file input immediately
        return; // Prevent further processing of files
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
    if (!profileData || !profileData.profileId) {
        setUploadError('Please search and select a profile first.');
        console.log('Debug (Utils): handleUploadPhotos - No profile data or profile ID.');
        return;
    }
    if (photos.length === 0) {
        setUploadError('Please select photos to upload.');
        console.log('Debug (Utils): handleUploadPhotos - No photos selected for upload.');
        return;
    }

    setUploading(true);
    setUploadError(null);
    console.log('Debug (Utils): handleUploadPhotos - Uploading started for profile ID:', profileData.profileId, 'Number of photos:', photos.length, 'isDefault:', isDefaultPhoto);

    const formData = new FormData();
    photos.forEach(photo => {
        formData.append('photos', photo);
    });
    formData.append('profile_id', profileData.profileId);
    formData.append('email', profileData.email || '');
    formData.append('is_default', isDefaultPhoto);

    console.log('Debug (Utils): handleUploadPhotos - FormData contents (not directly loggable):', formData);
    
    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): handleUploadPhotos - Using API base URL:', apiBaseUrl);

    try {
        console.log('Debug (Utils): handleUploadPhotos - Calling upload photos API with FormData.');
        const response = await axios.post(`${apiBaseUrl}/upload-photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Debug (Utils): handleUploadPhotos - Upload photos API response:', response.data);
        setPhotosState([]);
        setPhotoPreviews([]);
        setIsDefaultPhoto(false);
        await getUploadedPhotosFn(profileData.profileId, setUploadedPhotos, setFetchError, setGettingPhotosFn);
        await fetchDefaultPhotoFn(profileData.profileId, setDefaultPhoto, setFetchError);
        console.log('Debug (Utils): handleUploadPhotos - Upload successful, fetched updated photos and default photo.');
    } catch (error) {
        console.error('Debug (Utils): handleUploadPhotos - Error uploading photos:', error);
        setUploadError('Error uploading photos.');
        console.log('Debug (Utils): handleUploadPhotos - Upload failed:', error);
    } finally {
        setUploading(false);
        console.log('Debug (Utils): handleUploadPhotos - Upload process complete.');
    }
};

// Proposed fix for photoUploadUtils.js - getUploadedPhotos function
export const getUploadedPhotos = async (profileId, setUploadedPhotos, setFetchError, setGettingPhotos) => {
    if (!profileId) {
        console.log('Debug (Utils): getUploadedPhotos - No profile ID provided.');
        return;
    }
    if (setGettingPhotos) setGettingPhotos(true);
    setFetchError(null);
    console.log('Debug (Utils): getUploadedPhotos - Fetching uploaded photos for profile ID:', profileId);
    
    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): getUploadedPhotos - Using API base URL:', apiBaseUrl);
    
    try {
        const response = await axios.get(`${apiBaseUrl}/get-photos?profileId=${profileId}`);
        console.log('Debug (Utils): getUploadedPhotos - API response:', response.data);
        
        // Properly format the URLs to work both locally and in Azure
        const formattedPhotos = response.data.map(photo => {
            // Extract just the filename from the photo_path
            const filename = photo.url ? photo.url.split('/').pop() : 
                             photo.photo_path ? photo.photo_path.split(/[/\\]/).pop() : '';
            
            if (!filename) {
                console.warn('Debug (Utils): getUploadedPhotos - Missing filename in photo:', photo);
                return null; // Skip photos without valid filename
            }
            
            // First extract the origin (protocol + host) from the API base URL
            const apiUrlObj = new URL(apiBaseUrl);
            const origin = `${apiUrlObj.protocol}//${apiUrlObj.host}`;
            
            // Construct the full URL - Use a consistent path pattern that matches the server's static file configuration
            const fullUrl = `${origin}/profilePhotos/${filename}`;
            
            console.log('Debug (Utils): getUploadedPhotos - Constructed full URL:', fullUrl, 'from filename:', filename);
            
            return {
                id: photo.id || photo.photo_id,
                path: `/profilePhotos/${filename}`, // Store consistent relative URL path
                fullUrl: fullUrl, // Full URL for displaying
                filename: filename, // Store filename for reference
                isDefault: photo.is_default === 1 || photo.is_default === true
            };
        }).filter(Boolean); // Remove any null entries (photos without filenames)
        
        setUploadedPhotos(formattedPhotos);
        console.log('Debug (Utils): getUploadedPhotos - Uploaded photos state updated:', formattedPhotos);
    } catch (error) {
        console.error('Debug (Utils): getUploadedPhotos - Error fetching photos:', error);
        setFetchError('Error fetching uploaded photos.');
        console.log('Debug (Utils): getUploadedPhotos - Fetch failed:', error);
    } finally {
        if (setGettingPhotos) setGettingPhotos(false);
        console.log('Debug (Utils): getUploadedPhotos - Fetch complete.');
    }
};

// Proposed fix for fetchDefaultPhoto function
export const fetchDefaultPhoto = async (profileId, setDefaultPhoto, setFetchError) => {
    if (!profileId) {
        setDefaultPhoto(null);
        console.log('Debug (Utils): fetchDefaultPhoto - No profile ID provided.');
        return;
    }
    setFetchError(null);
    console.log('Debug (Utils): fetchDefaultPhoto - Fetching default photo for profile ID:', profileId);
    
    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): fetchDefaultPhoto - Using API base URL:', apiBaseUrl);
    
    try {
        const response = await axios.get(`${apiBaseUrl}/get-default-photo?profileId=${profileId}`);
        console.log('Debug (Utils): fetchDefaultPhoto - API response:', response.data);
        
        if (response.data && (response.data.url || response.data.photo_path)) {
            // Extract the filename from either url or photo_path
            const filename = response.data.url ? response.data.url.split('/').pop() : 
                            response.data.photo_path ? response.data.photo_path.split(/[/\\]/).pop() : 
                            response.data.filename || '';

            if (!filename) {
                console.warn('Debug (Utils): fetchDefaultPhoto - Missing filename in response:', response.data);
                setDefaultPhoto(null);
                return;
            }
            
            // Extract the origin (protocol + host) from the API base URL
            const apiUrlObj = new URL(apiBaseUrl);
            const origin = `${apiUrlObj.protocol}//${apiUrlObj.host}`;
            
            // Construct the full URL with a consistent path
            const fullUrl = `${origin}/profilePhotos/${filename}`;
            
            console.log('Debug (Utils): fetchDefaultPhoto - Constructed full URL:', fullUrl);
            
            setDefaultPhoto({
                id: response.data.id || response.data.photo_id,
                url: `/profilePhotos/${filename}`,
                fullUrl: fullUrl,
                filename: filename
            });
            console.log('Debug (Utils): fetchDefaultPhoto - Default photo state updated:', response.data);
        } else {
            setDefaultPhoto(null);
        }
    } catch (error) {
        console.error('Debug (Utils): fetchDefaultPhoto - Error fetching default photo:', error);
        setFetchError('Error fetching default photo.');
        console.log('Debug (Utils): fetchDefaultPhoto - Fetch failed:', error);
    }
};

export const deletePhoto = async (photoId, setDeleteError, setDeletingPhoto, onDeleteSuccess) => {
    if (!photoId) {
        console.log('Debug (Utils): deletePhoto - No photo ID provided.');
        return;
    }
    
    setDeletingPhoto(true);
    setDeleteError(null);
    console.log('Debug (Utils): deletePhoto - Deleting photo ID:', photoId);
    
    const apiBaseUrl = getApiBaseUrl();
    console.log('Debug (Utils): deletePhoto - Using API base URL:', apiBaseUrl);
    
    try {
        const response = await axios.delete(`${apiBaseUrl}/delete-photo?photoId=${photoId}`);
        console.log('Debug (Utils): deletePhoto - API response:', response.data);
        setDeleteError(null);
        console.log('Debug (Utils): deletePhoto - Photo deleted successfully.');
        
        // Call the success callback if provided
        if (onDeleteSuccess && typeof onDeleteSuccess === 'function') {
            onDeleteSuccess();
        }
    } catch (error) {
        console.error('Debug (Utils): deletePhoto - Error deleting photo:', error);
        setDeleteError('Error deleting photo.');
        console.log('Debug (Utils): deletePhoto - Delete failed:', error);
    } finally {
        setDeletingPhoto(false);
        console.log('Debug (Utils): deletePhoto - Delete process complete.');
    }
};