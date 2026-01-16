import api from "../api/axios";

const sanitizeUrl = (url) => {
      if (!url) return null;
      if (typeof url === 'string' && url.includes('http')) {
            const lastHttp = url.lastIndexOf('http');
            return url.substring(lastHttp);
      }
      return url;
};

const formatContent = (item) => ({
      ...item,
      cover_image: sanitizeUrl(item.cover_image),
      banner_image: sanitizeUrl(item.banner_image),
});

export const contentService = {
      getAll: async (params = {}) => {
            const res = await api.get("/contents", { params });
            const rawData = res.data.data || res.data || [];
            return {
                  data: Array.isArray(rawData) ? rawData.map(formatContent) : [],
                  meta: {
                        current: res.data.meta?.current_page || res.data.current_page || 1,
                        last: res.data.meta?.last_page || res.data.last_page || 1,
                  }
            };
      },

      getById: async (id) => {
            const res = await api.get(`/contents/${id}`);
            const data = res.data.data || res.data;
            return formatContent(data);
      },

      toggleFavorite: async (id) => {
            const res = await api.post(`/contents/${id}/favorite`);
            return res.data;
      },

      addReview: async (contentId, reviewData) => {
            const res = await api.post('/reviews', {
                  content_id: contentId,
                  comment: reviewData.comment,
                  rating: reviewData.rating
            });
            return res.data;
      },

      likeReview: async (reviewId) => {
            const res = await api.post(`/reviews/${reviewId}/like`);
            return res.data;
      },

      deleteReview: async (reviewId) => {
            const res = await api.delete(`/reviews/${reviewId}`);
            return res.data;
      },

      create: async (data) => {
            const res = await api.post("/contents", data);
            return res.data;
      },

      update: async (id, data) => {
            const res = await api.post(`/contents/${id}`, data);
            return res.data;
      },

      remove: async (id) => {
            const res = await api.delete(`/contents/${id}`);
            return res.data;
      },

      getGenres: async () => {
            const res = await api.get("/genres");
            return res.data.data || res.data;
      },

      addGenre: async (name) => {
            const res = await api.post("/genres", { name });
            return res.data;
      },

      deleteGenre: async (id) => {
            await api.delete(`/genres/${id}`);
      },

      getPlatforms: async () => {
            const res = await api.get("/platforms");
            return res.data.data || res.data;
      },

      addPlatform: async (name) => {
            const res = await api.post("/platforms", { name });
            return res.data;
      },

      deletePlatform: async (id) => {
            await api.delete(`/platforms/${id}`);
      },

      getOptions: async () => {
            const [genres, platforms] = await Promise.all([
                  contentService.getGenres(),
                  contentService.getPlatforms(),
            ]);
            return { genres, platforms };
      },
};