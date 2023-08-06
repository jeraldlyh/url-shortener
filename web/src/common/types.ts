export enum EPage {
  Landing,
  SignIn,
  CreateAccount,
  Dashboard,
}

export interface IUrl {
  url: string;
  title?: string;
  qrFgColor?: string;
  redirectHash: string;
  createdAt: string;
  copied?: boolean;
}

export interface ICreateUrl {
  title?: string;
  url: string;
  qrFgColor?: string;
}

export interface IBaseModalProps {
  onSubmit?: () => Promise<void>;
  onClose?: () => void;
  isOpen: boolean;
}

export interface IUser {
  username: string | null;
}
