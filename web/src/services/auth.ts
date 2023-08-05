import { SERVER_ROUTES } from '../common';
import AxiosService from './axios';

const signUp = async (username: string, password: string): Promise<string> => {
  const result = await AxiosService.post<string>(SERVER_ROUTES.AUTH.SIGNUP, {
    username,
    password,
  });

  return result.data;
};

const signIn = async (username: string, password: string): Promise<string> => {
  const result = await AxiosService.post<string>(SERVER_ROUTES.AUTH.SIGNIN, {
    username,
    password,
  });

  return result.data;
};

const signOut = async () => {
  await AxiosService.post(SERVER_ROUTES.AUTH.SIGNOUT);
};

export const AuthService = {
  signIn,
  signUp,
  signOut,
};
