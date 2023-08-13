import { SERVER_ROUTES } from '../common';
import AxiosService from './axios';

const signUp = async (username: string, password: string): Promise<string> => {
  const result = await AxiosService.post<string>(SERVER_ROUTES.AUTH.SIGN_UP, {
    username,
    password,
  });

  return result.data;
};

const signIn = async (username: string, password: string): Promise<string> => {
  const result = await AxiosService.post<string>(SERVER_ROUTES.AUTH.SIGN_IN, {
    username,
    password,
  });

  return result.data;
};

const signOut = async (): Promise<void> => {
  await AxiosService.post<void>(SERVER_ROUTES.AUTH.SIGN_OUT);
};

const validateUserAuth = async (): Promise<boolean> => {
  const result = await AxiosService.post<boolean>(SERVER_ROUTES.AUTH.VALIDATE);

  return result.data;
};

export const AuthService = {
  signIn,
  signUp,
  signOut,
  validateUserAuth,
};
