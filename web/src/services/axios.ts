import axios from 'axios';
import { BASE_URL } from '../common';

const AxiosService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

export default AxiosService;
