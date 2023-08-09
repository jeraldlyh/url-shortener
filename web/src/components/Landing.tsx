import { useRouter } from 'next/navigation';
import { CLIENT_ROUTES, Container } from '../common';
import { LandingIcon } from './LandingIcon';

export const Landing = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleGetStarted = (): void => {
    router.push(CLIENT_ROUTES.SIGNUP);
  };

  const handleContinue = (): void => {
    router.push(CLIENT_ROUTES.SIGNIN);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Container styles="relative space-y-5 justify-center">
      <LandingIcon />
      <div className="flex flex-col items-center font-bold uppercase tracking-widest">
        <span className="text-2xl lg:text-5xl">Tiny URLs</span>
        <span className="text-4xl sm:text-5xl lg:text-8xl">Big Impact</span>
      </div>
      <div className="flex w-full flex-col items-center space-y-3">
        <button
          className="btn btn-primary w-full max-w-xs font-semibold lg:max-w-sm"
          onClick={handleGetStarted}
        >
          Get started
        </button>
        <button
          className="btn btn-secondary btn-outline w-full max-w-xs font-semibold lg:max-w-sm"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </Container>
  );
};
