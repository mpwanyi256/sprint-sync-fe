import axios from 'axios';

import { app } from '@/lib/constants';
import { ApiStatusCodes } from '@/types/api';

const api = axios.create({
  baseURL: `${app.baseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': app.apiKey,
  },
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    }
    if (error.response?.data.statusCode !== ApiStatusCodes.SUCCESS) {
      console.log('API Error', error.response?.data);
      throw new Error(error.response?.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;
