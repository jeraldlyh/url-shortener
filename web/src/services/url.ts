import { ICreateQrCode, ICreateUrl, IUrl, SERVER_ROUTES } from '../common';
import AxiosService from './axios';

const getAllUrls = async (): Promise<IUrl[]> => {
  const result = await AxiosService.get<IUrl[]>(SERVER_ROUTES.URL.GET_ALL);

  return result.data;
};

const createUrl = async (url: ICreateUrl): Promise<void> => {
  await AxiosService.post(SERVER_ROUTES.URL.CREATE, url);
};

const createQrCode = async (qrCode: ICreateQrCode): Promise<void> => {
  await AxiosService.post(SERVER_ROUTES.URL.QR_CODE, qrCode);
};

const deleteUrl = async (redirectHash: string): Promise<void> => {
  await AxiosService.delete(`${SERVER_ROUTES.URL.CREATE}/${redirectHash}`);
};

export const UrlService = {
  getAllUrls,
  createUrl,
  createQrCode,
  deleteUrl,
};
