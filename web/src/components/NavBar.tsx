import { useEffect } from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { IoLogOut } from 'react-icons/io5';
import { useAuth } from '../hooks';

export const NavBar = () => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const { signOut } = useAuth();

  /* -------------------------------------------------------------------------- */
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              HELPER FUNCTIONS                              */
  /* -------------------------------------------------------------------------- */
  const handleThemeChange = (): void => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dracula' : 'light';

    localStorage.setItem('theme', nextTheme);

    setTheme(nextTheme);
  };

  const setTheme = (theme: string): void => {
    const htmlElement = document.querySelector('html');
    htmlElement?.setAttribute('data-theme', theme);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="navbar rounded-box flex justify-between bg-base-200 pl-5 pr-10 shadow-xl md:pl-6">
      <a className="btn btn-ghost text-lg font-bold normal-case md:text-xl">
        LinkNow
      </a>
      <div className="flex space-x-3">
        <label className="swap swap-rotate hover:text-primary-focus">
          <input type="checkbox" />
          <div
            onClick={handleThemeChange}
            className="swap-on flex items-center justify-center text-lg"
          >
            <BsFillMoonFill />
          </div>
          <div
            className="swap-off flex items-center justify-center text-2xl"
            onClick={handleThemeChange}
          >
            <BsFillSunFill />
          </div>
        </label>
        <button className="text-2xl hover:text-primary-focus" onClick={signOut}>
          <IoLogOut />
        </button>
      </div>
    </div>
  );
};
