import { useState, useCallback } from "react";
import { userService } from "../services/userService";

export const useUsers = () => {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const fetchUsers = useCallback(async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                  const data = await userService.getAll(params);
                  setUsers(data);
                  return data;
            } catch (err) {
                  setError(err);
                  throw err;
            } finally {
                  setLoading(false);
            }
      }, []);

      const toggleBan = async (id) => {
            const updated = await userService.toggleBan(id);
            setUsers((prev) =>
                  prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
            );
            return updated;
      };

      const updateRole = async (id, role) => {
            const updated = await userService.updateRole(id, role);
            setUsers((prev) =>
                  prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
            );
            return updated;
      };

      const updateProfile = async (data) => {
            return await userService.updateProfile(data);
      };

      const uploadAvatar = async (formData) => {
            try {
                  return await userService.uploadAvatar(formData);
            } catch (error) {
                  Toast.error(t('notifications.error.avatar_failed'));
                  throw error;
            }
      };

      const getProfile = useCallback(async () => {
            return await userService.getProfile();
      }, []);

      const deleteUserReview = async (reviewId) => {
            await userService.deleteReview(reviewId);
      };

      const toggleLike = async (reviewId) => {
            return await userService.toggleLike(reviewId);
      };

      return {
            users,
            loading,
            error,
            fetchUsers,
            getProfile,
            toggleBan,
            getProfile,
            updateProfile,
            uploadAvatar,
            deleteUserReview,
            toggleLike
      };
};
