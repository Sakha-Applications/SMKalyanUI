import apiClient from "./apiClient";

const profileService = {
  /**
   * Load the logged-in member's complete profile.
   */
  getMyProfile: async () => {
    const response = await apiClient.get("/modifyProfile");
    return response.data;
  },

  /**
   * Update the logged-in member's profile.
   *
   * Keep the payload aligned with the existing
   * /api/modifyProfile backend contract.
   */
  updateMyProfile: async (payload) => {
    const response = await apiClient.put(
      "/modifyProfile",
      payload
    );

    return response.data;
  },

  /**
   * Load another member's profile by Profile ID.
   *
   * This will later allow the candidate-profile experience
   * to reuse the same profile service.
   */
  getProfileById: async (profileId) => {
  const response = await apiClient.get(
    "/modifyProfile/byId",
    {
      params: {
        profileId,
      },
    }
  );

  return response.data;
},

getDefaultPhoto: async (profileId) => {
  if (!profileId) {
    return null;
  }

  try {
    const response = await apiClient.get(
      "/get-default-photo",
      {
        params: {
          profileId,
        },
      }
    );

    const photo = response?.data;

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
    };
  } catch (error) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
},

shareContactDetails: async (payload) => {
  const response = await apiClient.post(
    "/share-contact-details",
    payload
  );

  return response.data;
},

getMyContactRequests: async () => {
  const response = await apiClient.get(
    "/contact-requests/my"
  );

  return Array.isArray(
    response?.data?.requests
  )
    ? response.data.requests
    : [];
},

getContactDetails: async (profileId) => {
  if (!profileId) {
    return null;
  }

  const response = await apiClient.get(
    `/contact-details/${profileId}`
  );

  return response.data;
},

forwardProfileByEmail: async ({
  targetProfileId,
  recipientEmail,
  senderMessage = "",
}) => {
  const response = await apiClient.post(
    "/profile-forward",
    {
      targetProfileId,
      recipientEmail,
      senderMessage,
    }
  );

  return response.data;
},

getProfilePhotos: async (profileId) => {
  if (!profileId) {
    return [];
  }

  const response = await apiClient.get(
    "/get-photos",
    {
      params: {
        profileId,
      },
    }
  );

  return Array.isArray(response?.data)
    ? response.data
    : [];
},

searchProfileForPhotoManagement: async (searchCriteria) => {
  const response = await apiClient.post(
    "/search-by-upload",
    searchCriteria
  );

  return response.data;
},

uploadPhotos: async ({
  profileId,
  email,
  photos,
  isDefault = false,
}) => {
  const formData = new FormData();

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  formData.append("profile_id", profileId);
  formData.append("email", email || "");
  formData.append(
    "is_default",
    isDefault ? "true" : "false"
  );

  const response = await apiClient.post(
    "/upload-photos",
    formData
  );

  return response.data;
},

deletePhoto: async (photoId, blobName) => {
  const response = await apiClient.delete(
    "/delete-photo",
    {
      params: {
        photoId,
        blobName,
      },
    }
  );

  return response.data;
},

};

export default profileService;