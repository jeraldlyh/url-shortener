'use client';
import { createContext, useContext } from 'react';
import { IUser } from '../common';
import { useAuth } from '../hooks';

interface IAuthContext {
  user: IUser;
  signIn: (username: string, password: string) => void;
  signUp: (username: string, password: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

interface IAuthProvider {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  user: { username: '' },
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  isLoading: true,
});

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: IAuthProvider) => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const auth = useAuth();

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuthContext };
