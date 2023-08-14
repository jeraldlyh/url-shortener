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
    router.push(CLIENT_ROUTES.SIGN_UP);
  };

  const handleContinue = (): void => {
    router.push(CLIENT_ROUTES.SIGN_IN);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Container styles="space-y-5 justify-center">
      <LandingIcon />
      <div className="flex flex-col items-center font-bold uppercase tracking-wide">
        <span className="text-3xl md:text-4xl">Tiny URLs</span>
        <span className="text-4xl md:text-5xl lg:text-6xl">Big Impact</span>
      </div>
      <div className="flex w-full flex-col items-center space-y-3">
        <button
          className="btn btn-primary btn-md flex w-full max-w-xs items-center font-bold md:max-w-xs"
          onClick={handleGetStarted}
        >
          Get started
        </button>
        <button
          className="btn btn-secondary btn-outline btn-md flex w-full max-w-xs items-center font-bold md:max-w-xs"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </Container>
  );
};
