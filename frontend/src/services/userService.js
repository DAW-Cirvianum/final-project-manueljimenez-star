import api from "../api/axios";

export const userService = {
      getAll: async (params = {}) => {
            const res = await api.get("/users", { params });
            return res.data.data || res.data;
      },

      getById: async (id) => {
            const res = await api.get(`/users/${id}`);
            return res.data;
      },

      changeRole: async (id, role) => {
            const res = await api.patch(`/users/${id}/role`, { role });
            return res.data;
      },

      toggleStatus: async (id) => {
            const res = await api.post(`/users/${id}/toggle-ban`);
            return res.data;
      },
      
      toggleBan: async (id) => {
            const res = await api.post(`/users/${id}/toggle-ban`);
            return res.data;
      },

      deleteReview: async (id) => {
            return await api.delete(`/reviews/${id}`);
      },

      getProfile: async () => {
            const res = await api.get("/profile");
            return res.data;
      },

      updateProfile: async (userData) => {
            const res = await api.put("/profile/update", userData);
            return res.data;
      },

      uploadAvatar: async (formData) => {
            formData.append('_method', 'PUT');
            const res = await api.post("/profile/update", formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
      },

      toggleLike: async (reviewId) => {
            const res = await api.post(`/reviews/${reviewId}/like`);
            return res.data;
      },

      toggleFavorite: async (contentId) => {
            const res = await api.post(`/contents/${contentId}/favorite`);
            return res.data;
      }
};
