import apiClient from "./apiClient";

const searchService = {
  searchProfiles: async (payload) => {
    const response = await apiClient.post(
      "/searchProfiles",
      payload
    );

    return response.data;
  },

  advancedSearchProfiles: async (payload) => {
    const response = await apiClient.post(
      "/advancedSearchProfiles",
      payload
    );

    return response.data;
  },

  getProfile: async (profileId) => {
    const response = await apiClient.get(
      `/profile/${profileId}`
    );

    return response.data;
  },
};

export default searchService;