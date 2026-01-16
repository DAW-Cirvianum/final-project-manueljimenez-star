import axios from "axios";
import { Toast } from "../services/toast/toastActions";

const api = axios.create({
      baseURL: "http://localhost/api",
      timeout: 15000,
      headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
      },
});

// api/axios.js
api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
            config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
});

/* REQUEST */
api.interceptors.response.use(
      (response) => response,
      (error) => {
            // 1. Error de conexión (Red caída o server apagado)
            if (!error.response) {
                  Toast.error("No connection with server.");
                  return Promise.reject(error);
            }

            const { status, config } = error.response;

            // 2. Manejo centralizado de estados
            switch (status) {
                  case 401:
                        const isProfileRequest = config.url.includes('/profile');
                        const isAuthPath = config.url.includes('/login') || config.url.includes('/register');

                        if (!isAuthPath) {
                              localStorage.removeItem("token");

                              // IMPORTANTE: Solo redirigir si NO es la petición de carga de perfil
                              // Esto evita el bucle infinito en el arranque.
                              if (window.location.pathname !== '/login' && !isProfileRequest) {
                                    Toast.error("Sesión expirada.");
                                    window.location.href = "/login";
                              }
                        }
                        break;

                  case 422:
                        // ERROR DE VALIDACIÓN: No mostramos Toast global. 
                        // Dejamos que el componente (Login/Register) use setErrors() con la respuesta.
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
                        // Si no es un error de validación, mostramos el mensaje que venga del backend
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