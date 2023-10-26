import axios from 'axios';
import { BACKEND_BASE_URL } from '../common';

const AxiosService = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

AxiosService.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default AxiosService;
