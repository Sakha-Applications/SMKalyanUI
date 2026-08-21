import axios from "axios";
import getBaseUrl from "../utils/GetUrl";

const apiClient = axios.create({
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = `${getBaseUrl()}/api`;

    const token =
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("[KalyanaSakha] Unauthorized API response");
    }

    return Promise.reject(error);
  }
);

export default apiClient;