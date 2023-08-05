import { Container, EPage, IPageProps } from '../common';
import { LandingIcon } from './LandingIcon';

interface IProps extends IPageProps {}

export const Landing = ({ onPageChange }: IProps) => {
  const handleGetStarted = (): void => {
    onPageChange(EPage.CreateAccount);
  };

  const handleContinue = (): void => {
    onPageChange(EPage.SignIn);
  };

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
          className="btn btn-secondary btn-lg font-semibold"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </Container>
  );
};
