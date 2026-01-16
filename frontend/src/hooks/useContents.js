import { useState, useEffect, useCallback } from "react";
import { contentService } from "../services/contentService";
import { Toast } from "../services/toast/toastActions";

export const useContents = (autoFetch = true) => {
      const [contents, setContents] = useState([]);
      const [pagination, setPagination] = useState({ current: 1, last: 1 });
      const [loading, setLoading] = useState(false);

      const fetchContents = useCallback(async (params = {}) => {
            setLoading(true);
            try {
                  const cleanParams = {
                        search: params.search || '',
                        type: params.type || '',
                        genre_id: params.genre_id || '',
                        platform_id: params.platform_id || '',
                        sort: params.sort || 'recent',
                        page: params.page || 1,
                  };

                  const { data, meta } = await contentService.getAll(cleanParams);

                  setContents(data);
                  setPagination(meta);

            } catch (err) {
                  console.error("Error en fetchContents:", err);
                  Toast.error("Error cargando contenidos");
            } finally {
                  setLoading(false);
            }
      }, []);

      const toggleFavorite = async (id) => {
            try {
                  return await contentService.toggleFavorite(id);
            } catch (err) {
                  Toast.error("Error al actualizar favoritos");
                  throw err;
            }
      };

      useEffect(() => {
            if (autoFetch) {
                  fetchContents({ page: 1 });
            }
      }, [fetchContents, autoFetch]);

      return {
            contents,
            fetchContents,
            toggleFavorite,
            pagination,
            loading
      };
};