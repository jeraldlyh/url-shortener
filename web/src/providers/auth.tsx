'use client';
import { Transition } from '@headlessui/react';
import Lottie from 'lottie-react';
import { createContext, useContext, useEffect, useState } from 'react';
import urlAnimation from '../../public/urlAnimation.json';
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
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  useEffect(() => {
    if (auth.isLoading) {
      setShowAnimation(true);
    } else {
      const timeoutId = setTimeout(() => {
        setShowAnimation(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [auth.isLoading]);

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  // TODO: Shift into a loadingProvider/HOC
  const renderChildren = (): React.ReactNode => {
    return (
      <>
        <Transition
          show={showAnimation}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="h-[400px] w-[400px]">
              <Lottie animationData={urlAnimation} />
            </div>
          </div>
        </Transition>
        <Transition
          show={!showAnimation}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex h-screen w-screen justify-center">
            {children}
          </div>
        </Transition>
      </>
    );
  };

  return (
    <AuthContext.Provider value={auth}>{renderChildren()}</AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
