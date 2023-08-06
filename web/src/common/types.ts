export enum EPage {
  Landing,
  SignIn,
  CreateAccount,
  Dashboard,
}

interface IBaseQrCode {
  isCreated: boolean;
  fgColor: string;
}
export interface IUrl {
  url: string;
  title?: string;
  redirectHash?: string;
  qrCode: IBaseQrCode;
  copied?: boolean;
  createdAt: string;
}

export interface IBaseModalProps {
  id: string;
  onSubmit?: () => Promise<void>;
  onClose?: () => void;
}

export type TModalProps = Omit<IBaseModalProps, 'id'>;

export interface IUser {
  username: string | null;
}

export interface IDownload {
  option: 'PNG' | 'SVG';
  description: string;
  handleDownload: () => void;
}
export interface ICreateQrCode {
  qrCode: IBaseQrCode;
  redirectHash: string;
}

export interface IQrCode {
  redirectUrl: string;
  isCreated: boolean;
  fgColor: string;
}

export interface ICreateUrl {
  url: string;
  title?: string;
  qrCode: IQrCode;
}
