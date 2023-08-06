import QRCode from 'qrcode.react';
import { useState } from 'react';
import { IBaseModalProps, IDownload, Modal } from '../common';
import { ImageSelect } from './ImageSelect';

interface IProps extends IBaseModalProps {
  redirectUrl: string;
  fgColor?: string;
}

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
  const { redirectUrl, fgColor, ...otherProps } = props;
  const defaultOption = IMAGE_DOWNLOAD_TYPES[0];
  const [selected, setSelected] = useState<IDownload>(defaultOption);

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleOnChange = (option: string): void => {
    const selectedOption = IMAGE_DOWNLOAD_TYPES.find(
      (o) => o.option === option,
    ) as IDownload;

    setSelected(selectedOption);
  };
  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Modal title="Your QR code is ready 🥳" {...otherProps}>
      <div className="flex w-full flex-col items-center text-custom-gray-primary">
        <span className="font-semilight mb-2 text-sm italic">
          Scan the image below to checkout your QR code
        </span>
        <div className="border p-4">
          <QRCode
            renderAs={selected.option === 'PNG' ? 'canvas' : 'svg'}
            id="qrCode"
            className="my-2"
            value={redirectUrl}
            {...(fgColor && { fgColor: fgColor })}
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
            Download
          </button>
          <button className="btn btn-secondary w-full" onClick={props.onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
