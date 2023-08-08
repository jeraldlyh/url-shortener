import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiError } from 'react-icons/bi';
import { ValidationError } from 'yup';
import {
  CREATE_URL_SCHEMA,
  DEFAULT_QR_CODE,
  ICallbacks,
  ICreateUrl,
  Modal,
  MODAL_IDS,
  QrCodeCanvas,
} from '../common';
import { UrlService } from '../services';
import { Utils } from '../utils';

export const CreateUrlModal = ({ onClose, onSubmit }: ICallbacks) => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const DEFAULT_PAYLOAD = {
    title: '',
    url: '',
    qrCode: DEFAULT_QR_CODE,
  };
  const [payload, setPayload] = useState<ICreateUrl>(DEFAULT_PAYLOAD);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
          setPayload({
            ...payload,
            [key]: value,
          });

          await CREATE_URL_SCHEMA.validate(payload);
          setErrorMessage('');
          console.log('ok');
        } catch (error) {
          console.log(payload);
          setErrorMessage((error as ValidationError).message);
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
    onSubmit && (await onSubmit());
    resetState();
  };

  const handleClose = (): void => {
    onClose && onClose();
    resetState();
  };

  const isSubmitDisabled = (): boolean => {
    return !payload.url || !!errorMessage;
  };

  const resetState = (): void => {
    setPayload(DEFAULT_PAYLOAD);
    setErrorMessage('');
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  const renderQrCode = (): JSX.Element | undefined => {
    if (!payload.qrCode.isCreated) return;

    const handleTextChange = async (value: string) => {
      await handleOnChange('qrCode', value);
    };

    return (
      <QrCodeCanvas
        onPresetChange={handleOnColorPreset}
        onTextChange={handleTextChange}
        url={payload.url}
        fgColor={payload.qrCode.fgColor || '#000000ba'}
      />
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
      id={MODAL_IDS.CREATE_URL}
      title="Create a shortened URL"
      isSubmitDisabled={isSubmitDisabled()}
      submitText="Confirm"
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-2">
          <span className="font-semibold">Destination</span>
          <div className="relative w-full">
            <input
              className="input input-bordered w-full px-3 placeholder:text-sm placeholder:italic"
              placeholder="https://jeraldlyh.com"
              value={payload.url}
              onChange={(e) => handleOnChange('url', e.target.value)}
            />
            {renderErrorMessage()}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="">
            <span className="font-semibold">Title </span>
            <span className="italic">(optional)</span>
          </div>
          <input
            className="input input-bordered px-3 placeholder:text-sm placeholder:italic"
            value={payload.title}
            onChange={(e) => handleOnChange('title', e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <span className="font-semibold">QR code </span>
            <span className="italic">(optional)</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="toggle"
              checked={payload.qrCode.isCreated}
              onChange={() =>
                handleOnChange('qrCode', !payload.qrCode.isCreated)
              }
            />
            <span className="text-sm">
              Generate a QR code for anyone to scan it
            </span>
          </div>
        </div>
        {renderQrCode()}
      </div>
    </Modal>
  );
};
