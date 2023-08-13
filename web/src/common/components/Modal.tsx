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
      <div className="modal-box p-6 md:px-10 md:py-8">
        <p className="mb-3 text-center text-lg font-semibold md:text-xl">
          {title}
        </p>
        {children}
        <div className="mt-4 flex w-full flex-col-reverse md:flex-row md:space-x-4">
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
