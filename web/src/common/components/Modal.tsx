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
    <dialog id={id} className="modal bg-neutral/75">
      <div className="modal-box">
        <p className="mb-3 text-center text-lg font-semibold md:text-xl">
          {title}
        </p>
        {children}
        <div className="mt-3 flex w-full flex-col-reverse md:flex-row md:space-x-4">
          <button
            className="btn btn-secondary w-full flex-shrink"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary mb-2 w-full flex-shrink md:m-0"
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
