import apiClient from "./apiClient";

const registrationService = {
  getProfile: async (profileId) => {
    const response = await apiClient.get(`/profile/${profileId}`);
    return response.data;
  },

  checkProfileExists: async (profileId) => {
    if (!profileId) {
      return false;
    }

    try {
      const response = await apiClient.get(`/profile/${profileId}`);

      return Boolean(response?.data);
    } catch (error) {
      if (error?.response?.status === 404) {
        return false;
      }

      // Preserve the existing production behaviour:
      // profile lookup failure must not be interpreted as "profile exists".
      console.warn(
        "Profile availability check failed:",
        error?.response?.status || error?.message
      );

      return false;
    }
  },

  createProfile: async (payload) => {
    const response = await apiClient.post("/addProfile", payload);
    return response.data;
  },

  createLogin: async (payload) => {
    const response = await apiClient.post("/userlogin", payload);
    return response.data;
  },

  checkAccountAvailability: async (params) => {
    const response = await apiClient.get("/account/availability", {
      params,
    });

    return response.data;
  },

  updateProfile: async (profileId, payload) => {
    const response = await apiClient.put(
      `/direct/updateProfile/${profileId}`,
      payload
    );

    return response.data;
  },

  sendEmail: async (payload) => {
    const response = await apiClient.post("/send-email", payload);
    return response.data;
  },

  uploadProfilePhoto: async ({
    profileId,
    email,
    photo,
    isDefault = true,
  }) => {
    if (!profileId || !photo) {
      return null;
    }

    const formData = new FormData();

    formData.append(
      "profile_id",
      profileId
    );

    formData.append(
      "email",
      email || ""
    );

    formData.append(
      "is_default",
      isDefault ? "true" : "false"
    );

    formData.append(
      "photos",
      photo
    );

    const response =
      await apiClient.post(
        "/upload-photos",
        formData
      );

    return response.data;
  },
};

export default registrationService;