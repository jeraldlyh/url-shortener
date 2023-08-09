import { IoLogOut } from 'react-icons/io5';

interface IProps {
  onLogout: () => Promise<void>;
}

export const NavBar = ({ onLogout }: IProps) => {
  return (
    <div className="navbar rounded-box flex h-[5%] justify-between bg-base-100 pl-5 pr-10 shadow-xl md:pl-6">
      <a className="btn btn-ghost text-lg font-bold normal-case md:text-xl">
        LinkNow
      </a>
      <button className="text-2xl hover:text-primary-focus" onClick={onLogout}>
        <IoLogOut />
      </button>
    </div>
  );
};
