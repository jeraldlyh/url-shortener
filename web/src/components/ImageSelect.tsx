import { Listbox, Transition } from '@headlessui/react';
import { clsx } from 'clsx';
import { Fragment } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { PiCaretUpDownBold } from 'react-icons/pi';
import { IDownload } from '../common';

interface IProps {
  selected: string;
  images: IDownload[];
  onChange: (option: string) => void;
}

export const ImageTypeSelect = ({ selected, images, onChange }: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  const renderOptions = (): JSX.Element[] => {
    return images.map((image, index) => {
      const renderOptionDetails = (
        option: string,
        description: string,
        selected: boolean,
      ): JSX.Element => {
        const classnames = clsx({
          'mr-3': true,
          'font-medium': selected,
          'font-normal': !selected,
        });
        return (
          <div className="flex">
            {selected && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                <AiOutlineCheck className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            <span className={classnames}>{option}</span>
            <span className="font-light italic">{description}</span>
          </div>
        );
      };

      return (
        <Listbox.Option
          key={index}
          className={({ active }) =>
            `relative cursor-default select-none py-2 pl-10 pr-4 ${
              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
            }`
          }
          value={image.option}
        >
          {({ selected }) =>
            renderOptionDetails(image.option, image.description, selected)
          }
        </Listbox.Option>
      );
    });
  };

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative mt-1 h-10">
        <Listbox.Button className="border-outline h-full w-full cursor-pointer rounded-lg border px-4 py-2 text-left">
          <span className="font-semibold">{selected}</span>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <PiCaretUpDownBold
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg">
            {renderOptions()}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
