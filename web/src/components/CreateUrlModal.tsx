import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiError } from 'react-icons/bi';
import { ValidationError } from 'yup';
import {
  CREATE_URL_SCHEMA,
  DEFAULT_QR_CODE,
  ICreateUrl,
  Modal,
  MODAL_IDS,
  PRESET_COLORS,
  TModalProps,
} from '../common';
import { UrlService } from '../services';
import { Utils } from '../utils';

export const CreateUrlModal = (props: TModalProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [payload, setPayload] = useState<ICreateUrl>({
    title: '',
    url: '',
    qrCode: DEFAULT_QR_CODE,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    console.log(payload);
  }, [payload]);
  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleOnChange = async (
    key: keyof typeof payload,
    value: string | boolean,
  ): Promise<void> => {
    switch (key) {
      case 'title':
      case 'url':
        try {
          await CREATE_URL_SCHEMA.validate(payload);
          setErrorMessage('');
        } catch (error) {
          setErrorMessage((error as ValidationError).message);
        } finally {
          setPayload({
            ...payload,
            [key]: value,
          });
        }
        return;
      case 'qrCode':
        if (typeof value === 'boolean') {
          setPayload({
            ...payload,
            qrCode: {
              ...payload.qrCode,
              isCreated: value,
            },
          });
        } else {
          // NOTE: Prevent user from deleting hashtag
          const newInput = value as string;
          const isHashTag = newInput.length < 1;
          const isExceedChar = newInput.length > 7;
          const isAlphaNumeric =
            newInput === '#' ||
            Utils.isAlphaNumeric(newInput.charAt(newInput.length - 1));
          const isFirstCharHashTag = newInput.charAt(0) === '#';

          if (
            !isFirstCharHashTag ||
            isHashTag ||
            isExceedChar ||
            !isAlphaNumeric
          )
            return;

          setPayload({
            ...payload,
            qrCode: {
              ...payload.qrCode,
              fgColor: newInput,
            },
          });
        }
    }
  };

  const handleOnColorPreset = (value: string): void => {
    setPayload({
      ...payload,
      qrCode: {
        ...payload.qrCode,
        fgColor: value,
      },
    });
  };

  const handleSubmit = async (): Promise<void> => {
    await toast.promise(UrlService.createUrl(payload), {
      loading: 'Creating url...',
      success: 'Successfully created a new url',
      error: (e) => Utils.capitalize(e.response.data.message.toString()),
    });

    props.onSubmit && (await props.onSubmit());
  };

  const isSubmitDisabled = (): boolean => {
    return !payload.url || !!errorMessage;
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  const renderQrCode = (): JSX.Element | undefined => {
    if (!payload.qrCode.isCreated) return;

    const renderPresetColours = (): JSX.Element[] => {
      return PRESET_COLORS.map((color) => (
        <button
          className="h-9 w-9 rounded-full"
          style={{ backgroundColor: color }}
          onClick={() => handleOnColorPreset(color)}
        />
      ));
    };

    return (
      <div className="flex w-full flex-col items-center space-y-4">
        <div className="input-group w-full">
          <div
            className={`h-auto w-1/6 rounded-l-lg bg-[${payload.qrCode.fgColor}]`}
            style={{ backgroundColor: payload.qrCode.fgColor }}
          />
          <input
            className="input input-bordered w-5/6 px-3 italic placeholder:text-sm focus:outline-none"
            placeholder="#000000"
            type="text"
            value={payload.qrCode.fgColor}
            onChange={(e) => handleOnChange('qrCode', e.target.value)}
          />
        </div>
        <div className="w-full">
          <div className="mb-2 self-start">
            <span className="font-semibold">Presets </span>
            <span className="italic">(optional)</span>
          </div>
          <div className="flex w-full">
            <div className="grid w-1/3 grid-cols-3 gap-4">
              {renderPresetColours()}
            </div>
            <div className="mx-auto rounded-lg border border-base-content/20 p-4">
              <QRCodeSVG value={payload.url} fgColor={payload.qrCode.fgColor} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderErrorMessage = (): JSX.Element | undefined => {
    if (!errorMessage) return;

    return (
      <div
        className="tooltip tooltip-left absolute right-0 top-0"
        data-tip={errorMessage}
      >
        <button className="focused:outline-none btn border-none bg-inherit text-2xl text-error hover:bg-inherit">
          <BiError />
        </button>
      </div>
    );
  };

  return (
    <Modal
      {...props}
      id={MODAL_IDS.CREATE_URL}
      title="Create a shortened URL"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span className="mb-2 font-semibold">Destination</span>
          <div className="relative w-full">
            <input
              className="input input-bordered w-full px-3 placeholder:text-sm placeholder:italic focus:outline-none"
              placeholder="https://jeraldlyh.com"
              onChange={(e) => handleOnChange('url', e.target.value)}
            />
            {renderErrorMessage()}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="font-semibold">Title </span>
            <span className="italic">(optional)</span>
          </div>
          <input
            className="input input-bordered px-3 placeholder:text-sm placeholder:italic focus:outline-none"
            onChange={(e) => handleOnChange('title', e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="font-semibold">QR code </span>
            <span className="italic">(optional)</span>
          </div>
          <div className="mb-2 flex items-center space-x-3">
            <input
              type="checkbox"
              className="toggle"
              checked={payload.qrCode.isCreated}
              onChange={() =>
                handleOnChange('qrCode', !payload.qrCode.isCreated)
              }
            />
            <span>Generate a QR code for anyone to scan it</span>
          </div>
        </div>
        {renderQrCode()}
      </div>
      <div className="mt-5 flex justify-between space-x-4">
        <button
          className="btn btn-primary w-1/2 flex-shrink"
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
        >
          Confirm
        </button>
        <button
          className="btn btn-secondary w-1/2 flex-shrink"
          onClick={props.onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
