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
    router.push(CLIENT_ROUTES.LOGIN);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Container styles="relative space-y-5 justify-center">
      <LandingIcon />
      <div className="flex flex-col items-center font-bold uppercase tracking-widest text-custom-white">
        <span className="text-6xl">Tiny URLs</span>
        <span className="text-9xl">Big Impact</span>
      </div>
      <div className="flex flex-col space-y-3">
        <button
          className="btn btn-primary btn-lg font-semibold"
          onClick={handleGetStarted}
        >
          Get started
        </button>
        <button
          className="btn btn-secondary btn-outline btn-lg font-semibold"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </Container>
  );
};
