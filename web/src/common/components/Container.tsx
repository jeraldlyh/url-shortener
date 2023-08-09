import { clsx } from 'clsx';

interface IProps {
  children: React.ReactNode;
  styles?: string;
}

export const Container = ({ children, styles }: IProps) => {
  const classname = clsx({
    'flex h-full w-full md:px-24 px-12 flex-col items-center max-w-5xl': true,
    ...(styles && { [styles]: true }),
  });

  return <div className={classname}>{children}</div>;
};
