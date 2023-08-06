import QRCode from 'qrcode.react';
import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ICallbacks,
  IDownload,
  IQrCode,
  Modal,
  MODAL_IDS,
  QrCodeCanvas,
} from '../common';
import { UrlService } from '../services';
import { Utils } from '../utils';
import { ImageTypeSelect } from './ImageSelect';

interface IProps extends ICallbacks, IQrCode {}

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

export const ViewUrlModal = ({
  isCreated,
  redirectUrl,
  onClose,
  onSubmit,
}: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const defaultOption = IMAGE_DOWNLOAD_TYPES[0];
  const [selected, setSelected] = useState<IDownload>(defaultOption);
  const [fgColor, setFgColor] = useState<string>('#000000');

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleOnChange = (option: string): void => {
    const selectedOption = IMAGE_DOWNLOAD_TYPES.find(
      (o) => o.option === option,
    ) as IDownload;

    setSelected(selectedOption);
  };

  const handleSubmit = async (): Promise<void> => {
    const tokens = redirectUrl.split('/');
    const redirectHash = tokens[tokens.length - 1];

    await toast.promise(
      UrlService.createQrCode({
        qrCode: {
          fgColor,
          isCreated: true,
        },
        redirectHash,
      }),
      {
        loading: 'Creating QR code...',
        success: 'Successfully created a QR code',
        error: (e) => Utils.capitalize(e.response.data.message.toString()),
      },
    );
    onSubmit && (await onSubmit());
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  const renderBody = (): JSX.Element => {
    if (!isCreated)
      return (
        <Fragment>
          <span className="font-semilight mb-5 text-sm italic">
            You have yet to create a QR code for this URL
          </span>
          <QrCodeCanvas
            fgColor={fgColor}
            url={redirectUrl}
            onPresetChange={setFgColor}
            onTextChange={setFgColor}
          />
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
          <ImageTypeSelect
            selected={selected.option}
            images={IMAGE_DOWNLOAD_TYPES}
            onChange={handleOnChange}
          />
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
      submitText={isCreated ? 'Download' : 'Generate'}
      onSubmit={isCreated ? selected.handleDownload : handleSubmit}
      onClose={onClose}
    >
      <div className="flex w-full flex-col items-center">{renderBody()}</div>
    </Modal>
  );
};
