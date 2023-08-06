export enum EPage {
  Landing,
  SignIn,
  CreateAccount,
  Dashboard,
}

export interface IUrl {
  url: string;
  title?: string;
  redirectHash?: string;
  qrCode: {
    fgColor?: string;
    isCreated: boolean;
  };
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

export interface IQrCode {
  isCreated: boolean;
  redirectUrl?: string;
  fgColor?: string;
}

export interface ICreateUrl {
  url: string;
  title?: string;
  qrCode: IQrCode;
}
