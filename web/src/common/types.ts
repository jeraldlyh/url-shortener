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
