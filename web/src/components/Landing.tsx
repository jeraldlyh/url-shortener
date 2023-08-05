import { Container, EPage, IPageProps } from '../common';

interface IProps extends IPageProps {}

export const Landing = ({ onPageChange }: IProps) => {
  const handleGetStarted = (): void => {
    onPageChange(EPage.CreateAccount);
  };

  const handleContinue = (): void => {
    onPageChange(EPage.SignIn);
  };

  return (
    <Container styles="space-y-5">
      <div className="flex flex-col items-center font-bold uppercase tracking-widest text-custom-white">
        <span className="text-6xl">Tiny URLs</span>
        <span className="text-9xl">Big Impact</span>
      </div>
      <div className="flex flex-col space-y-3 text-xl font-bold">
        <button
          className="bg-custom-gold-primary hover:border-custom-gold-primary rounded-3xl border-2 border-transparent px-7 py-2 uppercase hover:bg-black"
          onClick={handleGetStarted}
        >
          Get started
        </button>
        <button
          className="border-custom-gold-primary hover:bg-custom-gold-primary rounded-3xl border-2 px-7 py-2 uppercase hover:text-custom-gray-primary"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </Container>
  );
};
