import { IoLogOut } from 'react-icons/io5';

interface IProps {
  onLogout: () => Promise<void>;
}

export const NavBar = ({ onLogout }: IProps) => {
  return (
    <div className="navbar rounded-box flex justify-between bg-base-100 px-10 shadow-xl">
      <a className="btn btn-ghost text-xl font-bold normal-case">LinkNow</a>
      <button className="text-2xl hover:text-accent-focus" onClick={onLogout}>
        <IoLogOut />
      </button>
    </div>
  );
};
