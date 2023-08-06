import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
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
            className={`h-auto w-1/6 rounded-l-lg bg-[${payload.qrFgColor}]`}
            style={{ backgroundColor: payload.qrFgColor }}
          />
          <input
            className="input input-bordered w-5/6 px-3 placeholder:text-sm placeholder:italic focus:outline-none"
            placeholder="#000000"
            type="text"
            value={payload.qrFgColor}
            onChange={(e) => handleOnChange('qrFgColor', e.target.value)}
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
            <div className="mx-auto rounded-lg border-[0.5px] p-4">
              <QRCodeSVG
                value={payload.url}
                fgColor={payload.qrFgColor || '#000'}
              />
            </div>
          </div>
        </div>
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
          <input
            className="input input-bordered px-3 placeholder:text-sm placeholder:italic focus:outline-none"
            placeholder="https://jeraldlyh.com"
            onChange={(e) => handleOnChange('url', e.target.value)}
          />
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
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
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
