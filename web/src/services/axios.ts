import axios from 'axios';
import { BACKEND_BASE_URL } from '../common';

const AxiosService = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  withCredentials: true,
});

export default AxiosService;
