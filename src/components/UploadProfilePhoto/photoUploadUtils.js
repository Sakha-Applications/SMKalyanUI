// src/components/UploadProfilePhoto/photoUploadUtils.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Define your API base URL

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
    try {
        console.log('Debug (Utils): handleSearchProfile - Calling search profile API with:', searchCriteria);
        const response = await axios.post(`${API_BASE_URL}/api/search-by-upload`, searchCriteria);
        console.log('Debug (Utils): handleSearchProfile - Search profile API raw response:', response);
        console.log('Debug (Utils): handleSearchProfile - Search profile API response data:', response.data);
        console.log('Debug (Utils): handleSearchProfile - Type of response.data:', typeof response.data);
        console.log('Debug (Utils): handleSearchProfile - Stringified response.data:', JSON.stringify(response.data));

        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].hasOwnProperty('profileId')) {
            const fetchedProfileData = response.data[0];
            setProfileData(fetchedProfileData); // Set profileData to the first object
            console.log('Debug (Utils): handleSearchProfile - profileData set to:', fetchedProfileData);
            const profileId = fetchedProfileData.profileId; // <---- Extract the profileId
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

    try {
        console.log('Debug (Utils): handleUploadPhotos - Calling upload photos API with FormData.');
        const response = await axios.post(`${API_BASE_URL}/api/upload-photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Debug (Utils): handleUploadPhotos - Upload photos API response:', response.data);
        setPhotosState([]);
        setPhotoPreviews([]);
        setIsDefaultPhoto(false);
        await getUploadedPhotosFn(profileData.profileId, setUploadedPhotos, setFetchError, setGettingPhotosFn);
        await fetchDefaultPhotoFn(profileData.profileId, setDefaultPhoto, setFetchError); // Corrected line: passing setFetchError
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



export const getUploadedPhotos = async (profileId, setUploadedPhotos, setFetchError, setGettingPhotos) => {
    if (!profileId) {
        console.log('Debug (Utils): getUploadedPhotos - No profile ID provided.');
        return;
    }
    setGettingPhotos(true);
    setFetchError(null);
    console.log('Debug (Utils): getUploadedPhotos - Fetching uploaded photos for profile ID:', profileId);
    try {
        const response = await axios.get(`${API_BASE_URL}/api/get-photos?profileId=${profileId}`);
        console.log('Debug (Utils): getUploadedPhotos - API response:', response.data);
        const formattedPhotos = response.data.map(photo => {
            // The photo_path from your database is the full local file path.
            // We need to extract the filename and construct the URL
            // based on the static serving route defined in the backend.

            // 1. Normalize the path
            const normalizedPath = photo.photo_path.replace(/\\/g, '/');
            // 2. Split by forward slashes
            const parts = normalizedPath.split('/');
            // 3. Get the filename (last part)
            const filename = parts[parts.length - 1];
            // 4. Construct the URL using the static serving route
            const imageUrl = `ProfilePhotos/${filename}`;

            return {
                path: imageUrl, // Store the relative URL path
                isDefault: photo.is_default,
            };
        });
        setUploadedPhotos(formattedPhotos);
        console.log('Debug (Utils): getUploadedPhotos - Uploaded photos state updated:', formattedPhotos);
    } catch (error) {
        console.error('Debug (Utils): getUploadedPhotos - Error fetching photos:', error);
        setFetchError('Error fetching uploaded photos.');
        console.log('Debug (Utils): getUploadedPhotos - Fetch failed:', error);
    } finally {
        setGettingPhotos(false);
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
    try {
        const response = await axios.get(`${API_BASE_URL}/api/get-default-photo?profileId=${profileId}`);
        console.log('Debug (Utils): fetchDefaultPhoto - API response:', response.data);
        setDefaultPhoto(response.data ? response.data.filename : null);
        console.log('Debug (Utils): fetchDefaultPhoto - Default photo state updated:', response.data ? response.data.filename : null);
    } catch (error) {
        console.error('Debug (Utils): fetchDefaultPhoto - Error fetching default photo:', error);
        setFetchError('Error fetching default photo.');
        console.log('Debug (Utils): fetchDefaultPhoto - Fetch failed:', error);
    }
};