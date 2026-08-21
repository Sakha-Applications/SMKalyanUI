import apiClient from "./apiClient";

const invitationService = {
  getReceivedInvitations: async () => {
    const response = await apiClient.get("/invitations/received");
    return response.data || [];
  },

  getSentInvitations: async () => {
    const response = await apiClient.get("/invitations/sent");
    return response.data || [];
  },

  getAllInvitations: async () => {
    const [received, sent] = await Promise.all([
      invitationService.getReceivedInvitations(),
      invitationService.getSentInvitations(),
    ]);

    return {
      received,
      sent,
    };
  },
};

export default invitationService;