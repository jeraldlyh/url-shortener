import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CLIENT_ROUTES,
  DEFAULT_USER,
  IUser,
  WHITELISTED_ROUTES,
} from '../common';
import { AuthService } from '../services';
import { Utils } from '../utils';

export const useAuth = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [user, setUser] = useState<IUser>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    validateIsUserLoggedIn();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              HELPER FUNCTIONS                              */
  /* -------------------------------------------------------------------------- */
  const validateIsUserLoggedIn = async (): Promise<void> => {
    const isPathAllowed = WHITELISTED_ROUTES.has(pathname);

    if (!isPathAllowed) {
      try {
        const isLoggedIn = await AuthService.validateUserAuth();

        if (!isLoggedIn) {
          resetUser();
          goToLanding();
        }
      } catch (error) {
        resetUser();
        goToLanding();
      }
    }

    setIsLoading(false);
  };

  const resetUser = (): void => {
    setUser(DEFAULT_USER);
  };

  const goToLanding = (): void => {
    router.push(CLIENT_ROUTES.HOME);
  };

  const goToDashboard = (): void => {
    router.push(CLIENT_ROUTES.DASHBOARD);
  };

  const signIn = async (username: string, password: string): Promise<void> => {
    let hasError = false;

    await toast.promise(AuthService.signIn(username, password), {
      loading: 'Attempting to login',
      success: (data) => {
        setUser({ username: data });

        return 'Logged in';
      },
      error: (e) => {
        hasError = true;

        return Utils.capitalize(e.response.data.message.toString());
      },
    });
    if (!hasError) goToDashboard();
  };

  const signUp = async (username: string, password: string): Promise<void> => {
    let hasError = false;

    await toast.promise(AuthService.signUp(username, password), {
      loading: 'Attempting to sign up',
      success: (data) => {
        setUser({ username: data });

        return 'Signed up & logged in';
      },
      error: (e) => {
        hasError = true;

        return Utils.capitalize(e.response.data.message.toString());
      },
    });

    if (!hasError) goToDashboard();
  };

  const signOut = async (): Promise<void> => {
    await toast.promise(AuthService.signOut(), {
      loading: 'Attempting to logout',
      success: 'Logged out',
      error: (e) => Utils.capitalize(e.response.data.message.toString()),
    });
    goToLanding();
  };

  return { user, signIn, signUp, signOut, isLoading };
};
