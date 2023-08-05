import Image from 'next/image';
import { useState } from 'react';
import icon from '../../public/icon.png';
import { Container, IPageProps } from '../common';
// import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"

interface IProps extends IPageProps {}

export const CreateAccount = ({ onPageChange }: IProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleOnSubmit = (): void => {
    console.log('submit');
  };

  return (
    <Container styles="justify-center">
      <div className="flex w-[524px] flex-col items-center justify-center rounded-2xl bg-custom-gray-primary p-10">
        <div className="h-[100px] w-[100px]">
          <Image src={icon} sizes="100vw" alt="logo" />
        </div>
        <span className="my-3 w-full text-center text-4xl font-bold">
          Create an account
        </span>
        <span className="mb-8 text-center text-sm italic text-custom-white">
          An account allows you to create and delete shortened URLs
        </span>
        <input
          id="username"
          className="mb-2 h-14 w-full rounded-xl bg-custom-black px-5 font-light outline-none placeholder:text-custom-white"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="password"
          className="h-14 w-full rounded-xl bg-custom-black px-5 font-light outline-none placeholder:text-custom-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="my-6 w-full rounded-xl bg-custom-white py-3 text-center font-bold uppercase text-custom-black">
          Create
        </button>
        <div className="text-sm">
          <span>Already have an account? </span>
          <span className="text-custom-gold-primary">Sign in</span>
        </div>
      </div>
    </Container>
  );
};
