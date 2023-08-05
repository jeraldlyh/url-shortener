import AxiosService from './axios';

const createAccount = async (
  username: string,
  password: string,
): Promise<void> => {
  await AxiosService.post('/auth/create', { username, password });
};

export const AuthService = {
  createAccount,
};
