import QRCode from 'qrcode.react';
import { IBaseModalProps, Modal } from '../common';

interface IProps extends IBaseModalProps {
  redirectUrl: string;
  fgColor?: string;
}

export const ViewUrlModal = (props: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const { redirectUrl, fgColor, ...otherProps } = props;

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleDownloadQr = (): void => {
    const canvas = document.querySelector('#qrCode') as HTMLCanvasElement;
    const pngFile = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = 'QrCode';
    link.href = pngFile;
    link.click();
    link.remove();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Modal title="Download your QR Code" {...otherProps}>
      <div className="flex flex-col items-center text-custom-gray-primary">
        <QRCode
          renderAs="canvas"
          id="qrCode"
          className="my-2"
          value={redirectUrl}
          {...(fgColor && { fgColor: fgColor })}
        />
        <div className="mt-2 flex w-full flex-col space-y-2">
          <button className="btn btn-primary" onClick={handleDownloadQr}>
            Download as PNG
          </button>
          <button className="btn btn-secondary" onClick={props.onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
