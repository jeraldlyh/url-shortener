import { IBaseModalProps } from '../types';

interface IModalProps extends IBaseModalProps {
  title?: string;
  children?: React.ReactNode;
}

export const Modal = ({ id, title, children }: IModalProps) => {
  return (
    <dialog id={id} className="modal bg-custom-black/75">
      <div className="modal-box">
        <p className="mb-3 text-center text-xl font-semibold">{title}</p>
        {children}
      </div>
    </dialog>
  );
};
