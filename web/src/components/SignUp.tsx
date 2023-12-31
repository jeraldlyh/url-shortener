import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CLIENT_ROUTES, Container, UrlIcon } from '../common';
import { useAuth } from '../hooks';

export const SignUp = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasVisibility, setHasVisibility] = useState<boolean>(false);
  const router = useRouter();
  const { signUp } = useAuth();

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleToggleVisibility = (): void => {
    setHasVisibility(!hasVisibility);
  };

  const handleOnSubmit = async (): Promise<void> => {
    await signUp(username, password);
  };

  const handleGoToSignIn = (): void => {
    router.push(CLIENT_ROUTES.SIGN_IN);
  };

  const isButtonDisabled = () => !username || !password;

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Container>
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl bg-base-100 p-10 shadow-xl">
        <UrlIcon />
        <span className="my-3 w-full text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          Create an account
        </span>
        <span className="mb-8 text-center text-xs italic md:text-sm">
          An account allows you to create and delete shortened URLs
        </span>
        <input
          className="input input-bordered mb-2 w-full text-sm sm:text-base"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative w-full">
          <input
            className="input input-bordered relative w-full text-sm sm:text-base"
            type={hasVisibility ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="swap absolute right-4 h-full">
            <input type="checkbox" />
            <AiFillEyeInvisible
              className="swap-off text-2xl"
              onClick={handleToggleVisibility}
            />
            <AiFillEye
              className="swap-on text-2xl"
              onClick={handleToggleVisibility}
            />
          </label>
        </div>
        <button
          className="btn btn-primary my-5 w-full disabled:cursor-not-allowed"
          onClick={handleOnSubmit}
          disabled={isButtonDisabled()}
        >
          Create
        </button>
        <div className="text-xs sm:text-sm">
          <span>Already have an account? </span>
          <button className="btn-link text-primary" onClick={handleGoToSignIn}>
            Sign in
          </button>
        </div>
      </div>
    </Container>
  );
};
