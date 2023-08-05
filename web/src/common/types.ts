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
}

export interface ICreateUrl {
  title?: string;
  url: string;
  qrFgColor?: string;
}

export interface IModalCallbacks {
  onConfirm?: () => void;
  onClose?: () => void;
}
