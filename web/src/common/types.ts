import React from 'react';

export enum EPage {
  Landing,
  SignIn,
  CreateAccount,
  Dashboard,
}

export interface IPageProps {
  onPageChange: React.Dispatch<React.SetStateAction<EPage>>;
}

export interface IUrl {
  alias: string;
  url: string;
  created: string;
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
