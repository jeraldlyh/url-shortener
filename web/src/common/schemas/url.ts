import { boolean, object, string } from 'yup';

export const QR_CODE_SCHEMA = object({
  fgColor: string().optional(),
  isCreated: boolean().required(),
});

export const CREATE_URL_SCHEMA = object({
  url: string()
    .matches(/^(https?:\/\/)www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid URL')
    .required(),
  title: string().optional(),
  qrCode: QR_CODE_SCHEMA,
});
