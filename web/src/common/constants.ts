export const COLORS = {
  QR: {
    PRIMARY: '#FFCB74',
    SECONDARY: '#2F2F2F',
    TERTIARY: '#D8D9DA',
  },
};

export const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export const CLIENT_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signUp',
};

export const SERVER_ROUTES = {
  URL: {
    CREATE: '/url',
    GET_ALL: '/url',
  },
};
