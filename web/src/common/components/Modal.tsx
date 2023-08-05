import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IModalCallbacks } from '../types';

export interface IModalProps extends IModalCallbacks {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
}

export const Modal = ({
  onConfirm,
  onClose,
  isOpen,
  title,
  children,
}: IModalProps) => {
  const handleOnConfirm = (): void => {
    onConfirm && onConfirm();
  };

  const handleOnClose = (): void => {
    onClose && onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleOnClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-custom-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-custom-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="mb-3 text-xl font-semibold text-gray-900"
                >
                  {title}
                </Dialog.Title>
                {children}

                <div className="mt-4 flex justify-between space-x-4">
                  <button
                    type="button"
                    className="w-full justify-center rounded-md bg-custom-gold-primary py-3 text-sm font-semibold text-custom-gray-primary hover:bg-custom-gold-secondary"
                    onClick={handleOnConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="w-full justify-center rounded-md border border-custom-gold-primary bg-inherit text-sm font-semibold text-custom-gray-primary hover:border-0 hover:bg-custom-gray-secondary"
                    onClick={handleOnClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
