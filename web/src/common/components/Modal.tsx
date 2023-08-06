import { IBaseModalProps } from '../types';

export const Modal = ({
  id,
  title,
  isSubmitDisabled,
  submitText,
  children,
  onSubmit,
  onClose,
}: IBaseModalProps) => {
  return (
    <dialog id={id} className="modal bg-custom-black/75">
      <div className="modal-box">
        <p className="mb-3 text-center text-xl font-semibold">{title}</p>
        {children}
        <div className="mt-3 flex w-full space-x-4">
          <button
            className="btn btn-secondary w-full flex-shrink"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary w-full flex-shrink"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
          >
            {submitText}
          </button>
        </div>
      </div>
    </dialog>
  );
};
