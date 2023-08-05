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
  index: number;
  alias: string;
  url: string;
  created: string;
}
