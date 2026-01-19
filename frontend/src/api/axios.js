import axios from "axios";
import { Toast } from "../services/toast/toastActions";

const api = axios.create({
      baseURL: "http://localhost/api",
      timeout: 15000,
      headers: {
            Accept: "application/json",
      },
});

api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
            config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
});

api.interceptors.response.use(
      (response) => response,
      (error) => {
            if (!error.response) {
                  Toast.error("No connection with server.");
                  return Promise.reject(error);
            }

            const { status, config } = error.response;

            switch (status) {
                  case 401:
                        const isProfileRequest = config.url.includes('/profile');
                        const isAuthPath = config.url.includes('/login') || config.url.includes('/register');

                        if (!isAuthPath) {
                              localStorage.removeItem("token");

                              if (window.location.pathname !== '/login' && !isProfileRequest) {
                                    Toast.error("Sesión expirada.");
                                    window.location.href = "/login";
                              }
                        }
                        break;

                  case 422:
                       break;

                  case 403:
                        Toast.error("Access denied. Insufficient permissions.");
                        break;

                  case 404:
                        if (config.method !== 'GET') Toast.error("Resource not found.");
                        break;

                  case 500:
                        Toast.error("Internal server error. Please try again later.");
                        break;

                  default:
                       if (status !== 422 && error.response.data?.message) {
                              Toast.error(error.response.data.message);
                        } else if (status !== 422) {
                              Toast.error("An unexpected error occurred.");
                        }
                        break;
            }

            return Promise.reject(error);
      }
);

export default api;