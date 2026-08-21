import apiClient from "./apiClient";

const authService = {
  login: async (payload) => {
    const response = await apiClient.post("/login", payload);
    return response.data;
  },

  forgotPassword: async (payload) => {
    const response = await apiClient.post("/forgot-password", payload);
    return response.data;
  },
};

export default authService;