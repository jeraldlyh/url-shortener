import { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AUTH_ERROR_MESSAGES,
  CLIENT_ROUTES,
  WHITELISTED_ROUTES,
} from '../common';
import { AuthService } from '../services';
import { Utils } from '../utils';

export const useAuth = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
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
    try {
      setIsLoading(true);
      const isPathAllowed = WHITELISTED_ROUTES.has(pathname);
      const isLoggedIn = await AuthService.validateUserAuth();

      if (isPathAllowed) {
        if (isLoggedIn) {
          goToDashboard();
        } else {
          resetAccessToken();
          goToLanding();
        }
      } else if (pathname !== CLIENT_ROUTES.NOT_FOUND) {
        goToDashboard();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (AUTH_ERROR_MESSAGES.includes(error.response?.data.message)) {
          resetAccessToken();
          goToLanding();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAccessToken = (): string => {
    return localStorage.getItem('accessToken') || '';
  };

  const resetAccessToken = (): void => {
    localStorage.setItem('accessToken', '');
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
        localStorage.setItem('accessToken', data);

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
        localStorage.setItem('accessToken', data);

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
      success: () => {
        resetAccessToken();

        return 'Logged out';
      },
      error: (e) => Utils.capitalize(e.response.data.message.toString()),
    });
    goToLanding();
  };

  return { getAccessToken, signIn, signUp, signOut, isLoading };
};
