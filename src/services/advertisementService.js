import apiClient from "./apiClient";

const advertisementService = {
  getAdvertisementsForDisplay: async ({
    limit = 12,
    format = "cards",
  } = {}) => {
    const response = await apiClient.get(
      "/preferred-profiles/display",
      {
        params: {
          limit,
          format,
        },
      }
    );

    return Array.isArray(response?.data?.data)
      ? response.data.data
      : [];
  },

  getAdvertisementByProfileId: async (
    profileId
  ) => {
    const response = await apiClient.get(
      `/preferred-profiles/profile/${profileId}`
    );

    return response?.data?.data || null;
  },

  checkAdvertisementStatus: async (
    profileId
  ) => {
    const response = await apiClient.get(
      `/preferred-profiles/check/${profileId}`
    );

    return response?.data?.data || null;
  },
};

export default advertisementService;