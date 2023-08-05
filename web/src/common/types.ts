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

export interface IModalCallbacks {
  onSubmit?: () => Promise<void>;
  onClose?: () => void;
}
