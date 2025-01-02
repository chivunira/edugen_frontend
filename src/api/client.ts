// src/api/client.ts
import axios, {AxiosInstance} from 'axios';
import {store} from "../store/store.ts";
import {logout} from "../store/slices/authSlice.ts";

const publicEndpoints = [
  '/auth/register/',
  '/auth/login/',
  '/auth/verify-code/',
  '/auth/resend-code/'
];

const apiClient:AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // Only add auth header if the endpoint isn't public
    if (!publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh/', { refresh: refreshToken });
        const { access } = response.data;

        localStorage.setItem('accessToken', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Dispatch logout action to clear Redux State
        store.dispatch(logout());

        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Use window.location.pathname to check current route
        if (!window.location.pathname.includes('/signin')) {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;