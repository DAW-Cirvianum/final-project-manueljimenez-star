import api from "../api/axios";

export const authService = {
      login: async (credentials) => {
            const res = await api.post("/login", credentials);
            localStorage.setItem("token", res.data.access_token);
            return res.data;
      },

      register: async (userData) => {
            const res = await api.post("/register", userData);
            return res.data;
      },

      getProfile: async () => {
            const res = await api.get("/profile");
            return res.data.user;
      },

      logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
      },

      forgotPassword: async (email) => {
            const response = await api.post('/forgot-password', { email });
            return response.data;
      },
      
      resetPassword: async (data) => {
            const response = await api.post('/password/reset', data);
            return response.data;
      }
      
};
