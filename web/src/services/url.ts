import { IUrl } from '../common';
import AxiosService from './axios';

const getAllUrls = async (): Promise<IUrl[]> => {
  const result = await AxiosService.get<IUrl[]>('/url');

  return result.data;
};

export const UrlService = {
  getAllUrls,
};
