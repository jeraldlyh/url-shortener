import { LuLogOut } from 'react-icons/lu';
import { IPageProps } from '../common';
import { Container } from './Container';

interface IProps extends IPageProps {}

export const Dashboard = ({}: IProps) => {
  const handleLogout = (): Promise<void> => {
    console.log('logout');
  };

  return (
    <Container styles="mt-16">
      <div className="navbar w-full justify-between rounded-2xl bg-custom-gray px-10 text-custom-white">
        <div className="font-bold">LinkNow</div>
        <LuLogOut onClick={handleLogout} className="cursor-pointer text-xl" />
      </div>
    </Container>
  );
};
