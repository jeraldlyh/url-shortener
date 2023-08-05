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
  const auth = useAuth();

  const { isLoading } = useAuth();

  const renderChildren = (): React.ReactNode => {
    console.log(isLoading);
    if (isLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="custom-loader" />
        </div>
      );
    }
    return children;
  };

  return (
    <AuthContext.Provider value={auth}>{renderChildren()}</AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
