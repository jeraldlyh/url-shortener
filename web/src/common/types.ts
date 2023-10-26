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
  redirectHash: string;
  qrCode: IBaseQrCode;
  copied?: boolean;
  createdAt: string;
}

export interface ICallbacks {
  onSubmit?: () => Promise<void> | void;
  onClose?: () => void;
}
export interface IBaseModalProps extends ICallbacks {
  id: string;
  title?: string;
  children?: React.ReactNode;
  isSubmitDisabled?: boolean;
  submitText: string;
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

export type Theme = 'dark' | 'light';
