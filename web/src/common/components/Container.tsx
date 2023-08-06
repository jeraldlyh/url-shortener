import { clsx } from 'clsx';

interface IProps {
  children: React.ReactNode;
  styles?: string;
}

export const Container = ({ children, styles }: IProps) => {
  const classname = clsx({
    'flex h-full w-full max-w-5xl flex-col items-center': true,
    ...(styles && { [styles]: true }),
  });

  return <div className={classname}>{children}</div>;
};
