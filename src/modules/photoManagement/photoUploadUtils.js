import profileService from "../../services/profileService";

export const handleSearchProfile = async (searchCriteria, setProfileData, setFetchError, setSearching, setUploadedPhotos, setDefaultPhoto, setUploadError, getUploadedPhotosFn, fetchDefaultPhotoFn) => {
    setSearching(true);
    setProfileData(null); // Initialize profileData to null at the start
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    setUploadError(null);
    
    try {
const data =
  await profileService.searchProfileForPhotoManagement(
    searchCriteria
  );

if (Array.isArray(data) && data.length > 0) {
  const fetchedProfileData = data[0];            
  // Normalize profileId to ensure we always use a consistent 'id' property for profileData
            const profileId = fetchedProfileData.id || fetchedProfileData.profileId; // Use 'id' or 'profileId'
            if (profileId) {
                // Ensure profileData always has an 'id' property for consistency
                setProfileData({ ...fetchedProfileData, id: profileId });
                               
                // Fetch photos from the backend (which now gets them from DB storing Azure URLs)
                await getUploadedPhotosFn(profileId, setUploadedPhotos, setFetchError, null);
                // Directly await fetchDefaultPhotoFn as it is now an async function
                await fetchDefaultPhotoFn(profileId, setDefaultPhoto, setFetchError);
            } else {
                setFetchError('No profile found with a valid ID in the response.');
                setProfileData(null);
            }
        } else {
            setFetchError('No profile found matching the search criteria.');
            setProfileData(null);
        }
    } catch (error) {
        console.error(
  "Unable to search profile:",
  error
);
        setFetchError(error.response?.data?.message || 'Error searching for profile.');
        setProfileData(null); // Ensure profileData is null on error
    } finally {
        setSearching(false);
        
    }
};

export const handlePhotoChange = (event, setPhotos, setPhotoPreviews, setUploadError, uploadedPhotoCount) => {
    const files = Array.from(event.target.files);
    
    const totalPhotos = (uploadedPhotoCount || 0) + files.length;

    if (totalPhotos > 5) { // Limit to 5 photos total (including existing ones)
        setUploadError(`You can upload a maximum of 5 photos. You currently have ${uploadedPhotoCount || 0} uploaded.`);
        event.target.value = null; // Clear the file input immediately
        return;
    }

    setUploadError(null); // Clear any previous error message
    setPhotos(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
    
};

export const handleUploadPhotos = async (profileData, photos, isDefaultPhoto, setUploading, setUploadError, setPhotosState, setPhotoPreviews, setIsDefaultPhoto, getUploadedPhotosFn, fetchDefaultPhotoFn, setUploadedPhotos, setDefaultPhoto, setGettingPhotosFn, setFetchError) => {
    if (!profileData || !profileData.id) { // Use profileData.id as the normalized ID
        setUploadError('Please search and select a profile first before uploading photos.');
        return;
    }
    if (photos.length === 0) {
        setUploadError('Please select photos to upload.');
        
        return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
        await profileService.uploadPhotos({
  profileId: profileData.id,
  email: profileData.email,
  photos,
  isDefault: isDefaultPhoto,
});

        // Clear frontend selection and flag
        setPhotosState([]);
        setPhotoPreviews([]);
        setIsDefaultPhoto(false);

        // Refresh the uploaded photos list and default photo from the backend
        await getUploadedPhotosFn(profileData.id, setUploadedPhotos, setFetchError, setGettingPhotosFn);
        // Directly await fetchDefaultPhotoFn as it is now an async function
        await fetchDefaultPhotoFn(profileData.id, setDefaultPhoto, setFetchError);
        
        
    } catch (error) {
      console.error(
        "Unable to upload photos:",
        error
      );

      setUploadError(
        error?.response?.data?.message ||
          "Error uploading photos. Please try again."
      );
    } finally {
      setUploading(false);
    }
};

export const getUploadedPhotos = async (
  profileId,
  setUploadedPhotos,
  setFetchError,
  setGettingPhotos
) => {
  if (!profileId) {
    setUploadedPhotos([]);
    return;
  }

  if (setGettingPhotos) {
    setGettingPhotos(true);
  }

  setFetchError(null);

  try {
    const photos =
      await profileService.getProfilePhotos(profileId);

    const formattedPhotos = photos
      .map((photo) => {
        if (
          !photo?.id ||
          !photo?.fullUrl ||
          !photo?.blobName
        ) {
          return null;
        }

        return {
          id: photo.id,
          fullUrl: photo.fullUrl,
          blobName: photo.blobName,
          isDefault:
            photo.isDefault === true ||
            photo.is_default === true ||
            photo.is_default === 1,
        };
      })
      .filter(Boolean);

    setUploadedPhotos(formattedPhotos);
  } catch (error) {
    console.error(
      "Unable to load uploaded photos:",
      error
    );

    setFetchError(
      error?.response?.data?.message ||
        "Error fetching uploaded photos."
    );

    setUploadedPhotos([]);
  } finally {
    if (setGettingPhotos) {
      setGettingPhotos(false);
    }
  }
};

// MODIFIED: This function now uses async/await internally and handles its own state updates via passed setters.
// It no longer takes successCallback and errorCallback.
export const fetchDefaultPhoto = async (
  profileId,
  setDefaultPhoto,
  setFetchError
) => {
  if (!profileId) {
    setDefaultPhoto(null);
    return;
  }

  setFetchError(null);

  try {
    const photo =
      await profileService.getDefaultPhoto(profileId);

    setDefaultPhoto(photo || null);
  } catch (error) {
    console.error(
      "Unable to load default photo:",
      error
    );

    setFetchError(
      error?.response?.data?.message ||
        "Error fetching default photo."
    );

    setDefaultPhoto(null);
  }
};

export const deletePhoto = async (photoId, blobName, setDeleteError, setDeletingPhoto, onDeleteSuccess) => {
    if (!photoId || !blobName) { // Require both for deletion
        setDeleteError("Photo ID and Blob Name are required for deletion.");
        
        return;
    }

    setDeletingPhoto(true);
    setDeleteError(null);
    

    try {
  await profileService.deletePhoto(
    photoId,
    blobName
  );

  setDeleteError(null);

  if (
    onDeleteSuccess &&
    typeof onDeleteSuccess === "function"
  ) {
    await onDeleteSuccess();
  }
    } catch (error) {
      console.error(
        "Unable to delete photo:",
        error
      );

      setDeleteError(
        error?.response?.data?.message ||
          "Error deleting photo. Please try again."
      );
    } finally {
      setDeletingPhoto(false);
    }
};