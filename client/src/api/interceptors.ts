import api from './axiosInstance';
import { store } from '@/store';

export const setupInterceptors = () => {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};