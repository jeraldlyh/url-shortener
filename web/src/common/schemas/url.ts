import { boolean, object, string } from 'yup';

export const QR_CODE_SCHEMA = object({
  fgColor: string().optional(),
  isCreated: boolean().required(),
});

export const CREATE_URL_SCHEMA = object({
  url: string().url().required(),
  title: string().optional(),
  qrCode: QR_CODE_SCHEMA,
});
