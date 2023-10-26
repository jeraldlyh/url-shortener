'use client';
import { createContext, useContext } from 'react';
import { useAuth } from '../hooks';

interface IAuthContext {
  getAccessToken: () => string;
  signIn: (username: string, password: string) => void;
  signUp: (username: string, password: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

interface IAuthProvider {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  getAccessToken: () => '',
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
