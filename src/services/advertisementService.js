import apiClient from "./apiClient";

const advertisementService = {
  getMyAdvertisements: async () => {
    const response =
      await apiClient.get(
        "/preferred-profiles/my-advertisements"
      );

    return Array.isArray(
      response?.data?.data
    )
      ? response.data.data
      : [];
  },

  updateMyAdvertisement:
    async ({
      advertisementId,
      advertisementText,
    }) => {
      const response =
        await apiClient.put(
          `/preferred-profiles/my-advertisements/${advertisementId}`,
          {
            advertisementText,
          }
        );

      return response?.data || null;
    },

  cancelMyAdvertisement:
    async (
      advertisementId
    ) => {
      const response =
        await apiClient.put(
          `/preferred-profiles/my-advertisements/${advertisementId}/cancel`
        );

      return response?.data || null;
    },
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

  respondToAdvertisement: async ({
    advertisementId,
    responseType,
    remarks = "",
  }) => {
    const response =
      await apiClient.post(
        `/advertisement-responses/${advertisementId}/respond`,
        {
          responseType,
          remarks,
        }
      );

    return response?.data || null;
  },

  getMyAdvertisementResponses:
    async () => {
      const response =
        await apiClient.get(
          "/advertisement-responses/my-responses"
        );

      return {
        responses:
          Array.isArray(
            response?.data?.data
          )
            ? response.data.data
            : [],

        counts:
          response?.data?.counts ||
          {},
      };
    },
};

export default advertisementService;