import apiClient from "./apiClient";

const dashboardDiscoveryService = {
  getDiscoverySummary: async () => {
  const response = await apiClient.get(
    "/dashboard/discovery-summary"
  );

  return response.data;
},
  getDiscoveryCount: async (type, profession = "") => {
    const params = {};

    if (profession) {
      params.profession = profession;
    }

    const response = await apiClient.get(
      `/dashboard/discovery/${type}`,
      { params }
    );

    return response.data;
  },

  getDiscoveryProfiles: async (
    type,
    profession = "",
    limit = 30
  ) => {
    const params = {
      limit,
    };

    if (profession) {
      params.profession = profession;
    }

    const response = await apiClient.get(
      `/dashboard/discovery/${type}/profiles`,
      { params }
    );

    return response.data;
  },

  getMatches: async (payload) => {
    const response = await apiClient.post(
      "/matchProfiles",
      payload
    );

    return response.data;
  },
};

export default dashboardDiscoveryService;