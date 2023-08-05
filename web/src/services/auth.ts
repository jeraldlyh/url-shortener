import { SERVER_ROUTES } from '../common';
import AxiosService from './axios';

const createAccount = async (
  username: string,
  password: string,
): Promise<void> => {
  await AxiosService.post(SERVER_ROUTES.AUTH.SIGNUP, { username, password });
};

const logout = async () => {
  await AxiosService.post(SERVER_ROUTES.AUTH.LOGOUT);
};

export const AuthService = {
  createAccount,
  logout,
};
