import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      const loadSession = useCallback(async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                  setUser(null);
                  setLoading(false);
                  return;
            }

            try {
                  const userData = await authService.getProfile();
                  setUser(userData);
            } catch (err) {
                  localStorage.removeItem("token");
                  setUser(null);
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            loadSession();
      }, [loadSession]);

      const login = async (credentials) => {
            try {
                  const data = await authService.login(credentials);
                  setUser(data.user);
                  return data.user;
            } catch (error) {
                  throw error;
            }
      };

      const register = async (formData) => {
            const data = await authService.register(formData);
            if (data.access_token) {
                  localStorage.setItem("token", data.access_token);
                  setUser(data.user);
            }
            return data;
      };

      const logout = () => {
            authService.logout();
            setUser(null);
      };

      const forgotPassword = async (email) => {
            try {
                  const data = await authService.forgotPassword(email);
                  return data;
            } catch (error) {
                  throw error;
            }
      };

      const resetPassword = async (data) => {
            try {
                  const response = await authService.resetPassword(data);
                  return response;
            } catch (error) {
                  throw error;
            }
      };

      return {
            user,
            register,
            loading,
            authenticated: !!user,
            login,
            logout,
            forgotPassword,
            resetPassword
      };
};