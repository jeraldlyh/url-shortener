'use client';
import { Transition } from '@headlessui/react';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import urlAnimation from '../../public/urlAnimation.json';
import { useAuth } from '../hooks';

interface IProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const auth = useAuth();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    if (auth.isLoading) {
      setShowAnimation(true);
    } else {
      const timeoutId = setTimeout(() => {
        setShowAnimation(false);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }

    if (!auth.getAccessToken()) {
      router.push('/signIn');
    }
  }, [auth.isLoading]);

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Fragment>
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
        <div>{children}</div>
      </Transition>
    </Fragment>
  );
};
