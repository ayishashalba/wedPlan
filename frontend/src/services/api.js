import axios from 'axios';

// Base API configuration for MERN backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: true // Enable cookie credentials transmission
});

// Request interceptor to attach JWT token when present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wedplan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired token and credentials
      localStorage.removeItem('wedplan_token');
      localStorage.removeItem('wedplan_user');
    }
    return Promise.reject(error);
  }
);

export default api;
