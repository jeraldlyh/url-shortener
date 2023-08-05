import axios from 'axios';
import { BASE_URL } from '../common';

const AxiosService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  withCredentials: true,
});

export default AxiosService;
