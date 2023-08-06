import QRCode from 'qrcode.react';
import { Fragment, useState } from 'react';
import {
  DEFAULT_QR_CODE,
  IDownload,
  IQrCode,
  Modal,
  MODAL_IDS,
  QrCodeCanvas,
  TModalProps,
} from '../common';
import { ImageSelect } from './ImageSelect';

interface IProps extends TModalProps, IQrCode {}

const handleDownloadQr = (link: string): void => {
  const anchor = document.createElement('a');
  anchor.download = 'QrCode';
  anchor.href = link;
  anchor.click();
  anchor.remove();
};

const IMAGE_DOWNLOAD_TYPES: IDownload[] = [
  {
    option: 'PNG',
    description: 'Higher quality, recommended for web',
    handleDownload: (): void => {
      const canvas = document.querySelector('#qrCode') as HTMLCanvasElement;
      const pngFile = canvas.toDataURL('image/png');

      handleDownloadQr(pngFile);
    },
  },
  {
    option: 'SVG',
    description: 'Vector-based image that can be resized',
    handleDownload: () => {
      const canvas = document.querySelector('#qrCode') as HTMLCanvasElement;
      const contentWithSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="128" width="128" viewBox="0 0 29 29">${canvas.innerHTML}</svg>`;
      const blob = new Blob([contentWithSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      handleDownloadQr(url);
    },
  },
];

export const ViewUrlModal = (props: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const { isCreated, redirectUrl, fgColor, ...otherProps } = props;
  const defaultOption = IMAGE_DOWNLOAD_TYPES[0];
  const [selected, setSelected] = useState<IDownload>(defaultOption);
  const [qrCode, setQrCode] = useState<IQrCode>(DEFAULT_QR_CODE);

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleOnChange = (option: string): void => {
    const selectedOption = IMAGE_DOWNLOAD_TYPES.find(
      (o) => o.option === option,
    ) as IDownload;

    setSelected(selectedOption);
  };

  const handleFgColorChange = (value: string): void => {
    setQrCode({
      ...qrCode,
      fgColor: value,
    });
  };

  const handleSubmit = (): Promise<void> => {};

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  const renderBody = (): JSX.Element => {
    if (!isCreated)
      return (
        <Fragment>
          <QrCodeCanvas
            fgColor={qrCode.fgColor}
            url={redirectUrl}
            onPresetChange={handleFgColorChange}
            onTextChange={handleFgColorChange}
          />
          <div className="mt-5 flex w-full space-x-4">
            <button
              className="btn btn-primary w-full flex-shrink"
              onClick={handleSubmit}
            >
              Generate
            </button>
            <button
              className="btn btn-secondary w-full flex-shrink"
              onClick={props.onClose}
            >
              Cancel
            </button>
          </div>
        </Fragment>
      );

    return (
      <Fragment>
        <span className="font-semilight mb-5 text-sm italic">
          Scan the image below to checkout your QR code
        </span>
        <div className="rounded-lg border border-base-content/20 p-4">
          <QRCode
            renderAs={selected.option === 'PNG' ? 'canvas' : 'svg'}
            id="qrCode"
            className="my-2"
            value={redirectUrl}
            fgColor={fgColor || '#000000'}
          />
        </div>
        <div className="my-5 flex w-full flex-col space-y-2">
          <ImageSelect
            selected={selected.option}
            images={IMAGE_DOWNLOAD_TYPES}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex w-full flex-col space-y-2">
          <button
            className="btn btn-primary w-full"
            onClick={selected.handleDownload}
          >
            Generate
          </button>
          <button className="btn btn-secondary w-full" onClick={props.onClose}>
            Cancel
          </button>
        </div>
      </Fragment>
    );
  };

  return (
    <Modal
      id={MODAL_IDS.VIEW_URL}
      title={
        isCreated ? 'Your QR code is ready 🥳' : 'Start generating your QR code'
      }
      {...otherProps}
    >
      <div className="flex w-full flex-col items-center">{renderBody()}</div>
    </Modal>
  );
};
