import { IQrCode } from './types';

export const COLORS = {
  QR: {
    PRIMARY: '#FFCB74',
    SECONDARY: '#2F2F2F',
    TERTIARY: '#D8D9DA',
  },
};

export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

export const CLIENT_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SIGNIN: '/signIn',
  SIGNUP: '/signUp',
};

export const SERVER_ROUTES = {
  URL: {
    CREATE: '/url',
    GET_ALL: '/url',
    QR_CODE: '/url/qr',
    DELETE: '/url',
  },
  AUTH: {
    SIGNOUT: '/auth/signOut',
    SIGNIN: '/auth/signIn',
    SIGNUP: '/auth/signUp',
    VALIDATE: '/auth/validate',
  },
};

export const WHITELISTED_ROUTES = new Set([
  CLIENT_ROUTES.SIGNIN,
  CLIENT_ROUTES.SIGNUP,
  CLIENT_ROUTES.HOME,
]);

export const DEFAULT_QR_CODE: IQrCode = {
  isCreated: false,
  redirectUrl: '',
  fgColor: '#000000',
};

export const MODAL_IDS = {
  CREATE_URL: 'create-url',
  VIEW_URL: 'view-url',
  DELETE_URL: 'delete-url',
};

export const PRESET_COLORS = [
  '#D6CCC2',
  '#264653',
  '#2A9D8F',
  '#E9C46A',
  '#F4A261',
  '#E76F51',
  '#E63946',
  '#023047',
  '#231999',
];

export const DEVICE_WIDTHS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
};
