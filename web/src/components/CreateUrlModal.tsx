import { Switch } from '@headlessui/react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { COLORS, ICreateUrl, IModalCallbacks, Modal } from '../common';
import { UrlService } from '../services';
import { Utils } from '../utils';

interface IProps extends IModalCallbacks {
  isOpen: boolean;
}

export const CreateUrlModal = (props: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [enabled, setEnabled] = useState<boolean>(false);
  const [payload, setPayload] = useState<ICreateUrl>({
    title: '',
    url: '',
    qrFgColor: '#000000',
  });

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleOnChange = (key: keyof typeof payload, value: string): void => {
    setPayload({
      ...payload,
      [key]: value,
    });
  };

  const handleOnColorPreset = (value: string): void => {
    setPayload({
      ...payload,
      qrFgColor: value,
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

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  const renderQrCode = (): JSX.Element | undefined => {
    if (!enabled) return;

    return (
      <div className="flex flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex">
            <div
              className={`h-11 w-11 rounded-l-lg bg-[${payload.qrFgColor}]`}
              style={{ backgroundColor: payload.qrFgColor }}
            />
            <input
              className="w-25 rounded-r-lg border border-custom-gray-secondary bg-inherit p-2 placeholder:text-sm placeholder:italic focus:border focus:border-custom-gold-primary focus:outline-none"
              placeholder="#000000"
              type="text"
              value={payload.qrFgColor}
              onChange={(e) => handleOnChange('qrFgColor', e.target.value)}
            />
          </div>
          <button
            className="h-9 w-9 rounded-full bg-custom-qr-primary"
            onClick={() => handleOnColorPreset(COLORS.QR.PRIMARY)}
          />
          <button
            className="h-9 w-9 rounded-full bg-custom-qr-secondary"
            onClick={() => handleOnColorPreset(COLORS.QR.SECONDARY)}
          />
          <button
            className="h-9 w-9 rounded-full bg-custom-qr-tertiary"
            onClick={() => handleOnColorPreset(COLORS.QR.TERTIARY)}
          />
        </div>
        <QRCodeSVG
          className="my-7"
          value={payload.url}
          fgColor={payload.qrFgColor}
        />
      </div>
    );
  };

  return (
    <Modal title="Create a shortened URL" {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4 text-custom-gray-primary">
        <div className="flex flex-col space-y-2">
          <span className="font-semibold">Destination</span>
          <input
            className="rounded-lg border border-custom-gray-secondary bg-inherit p-2 placeholder:text-sm placeholder:italic focus:border focus:border-custom-gold-primary focus:outline-none"
            placeholder="https://jeraldlyh.com"
            onChange={(e) => handleOnChange('url', e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <span className="font-semibold">Title </span>
            <span className="italic">(optional)</span>
          </div>
          <input
            className="rounded-lg border border-custom-gray-secondary bg-inherit p-2 placeholder:text-sm placeholder:italic focus:border focus:border-custom-gold-primary focus:outline-none"
            onChange={(e) => handleOnChange('title', e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <span className="font-semibold">QR code </span>
            <span className="italic">(optional)</span>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? 'bg-custom-gold-primary' : 'bg-[#DBE0EB]'}
          relative inline-flex h-6 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <span>Generate a QR code for anyone to scan it</span>
          </div>
          {renderQrCode()}
        </div>
      </div>
    </Modal>
  );
};
