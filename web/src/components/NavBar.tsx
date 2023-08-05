import { LuLogOut } from 'react-icons/lu';

interface IProps {
  onLogout: () => void;
}

export const NavBar = ({ onLogout }: IProps) => {
  return (
    <div className="flex w-full justify-between rounded-2xl bg-custom-gray-primary px-10 py-5 text-2xl text-custom-white">
      <div className="font-bold">LinkNow</div>
      <LuLogOut onClick={onLogout} className="cursor-pointer" />
    </div>
  );
};
