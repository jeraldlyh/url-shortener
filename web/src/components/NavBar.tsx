import { LuLogOut } from 'react-icons/lu';

interface IProps {
  onLogout: () => Promise<void>;
}

export const NavBar = ({ onLogout }: IProps) => {
  return (
    <div className="navbar flex justify-between rounded-2xl bg-neutral px-10 text-xl text-neutral-content">
      <div className="font-bold">LinkNow</div>
      <button onClick={onLogout}>
        <LuLogOut />
      </button>
    </div>
  );
};
