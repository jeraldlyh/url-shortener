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
  console.log(qrCode);
  await AxiosService.post(SERVER_ROUTES.URL.QR_CODE, qrCode);
};

export const UrlService = {
  getAllUrls,
  createUrl,
  createQrCode,
};
