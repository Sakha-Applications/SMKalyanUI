import apiClient from "./apiClient";

const advertisementResponseService = {
  getReceivedResponses:
    async () => {
      const response =
        await apiClient.get(
          "/advertisement-responses/my-responses"
        );

      return Array.isArray(
        response?.data?.data
      )
        ? response.data.data
        : [];
    },

  getSentResponses:
    async () => {
      const response =
        await apiClient.get(
          "/advertisement-responses/sent"
        );

      return Array.isArray(
        response?.data?.data
      )
        ? response.data.data
        : [];
    },

  getAllResponses:
    async () => {
      const [
        received,
        sent
      ] =
        await Promise.all([
          advertisementResponseService
            .getReceivedResponses(),

          advertisementResponseService
            .getSentResponses()
        ]);

      return {
        received,
        sent
      };
    },

  applyAfterShortlist:
    async ({
      responseId,
      remarks = ""
    }) => {
      const response =
        await apiClient.put(
          `/advertisement-responses/${responseId}/apply`,
          {
            remarks
          }
        );

      return response?.data || null;
    },    
  updateConvenientTime:
    async ({
      responseId,
      convenientTime
    }) => {
      const response =
        await apiClient.put(
          `/advertisement-responses/${responseId}/convenient-time`,
          {
            convenientTime
          }
        );

      return response?.data || null;
    },


  
  updateResponseStatus:
    async ({
      responseId,
      responseStatus,
      remarks = ""
    }) => {
      const response =
        await apiClient.put(
          `/advertisement-responses/${responseId}/status`,
          {
            responseStatus,
            remarks
          }
        );

      return response?.data || null;
    }
};

export default advertisementResponseService;