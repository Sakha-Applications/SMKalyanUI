import apiClient from "./apiClient";

const memberNotificationService = {
  getMyNotifications:
    async () => {
      const response =
        await apiClient.get(
          "/member-notifications"
        );

      return Array.isArray(
        response?.data?.data
      )
        ? response.data.data
        : [];
    },

  markAsRead:
    async (
      notificationId
    ) => {
      const response =
        await apiClient.put(
          `/member-notifications/${notificationId}/read`
        );

      return (
        response?.data ||
        null
      );
    }
};

export default memberNotificationService;
