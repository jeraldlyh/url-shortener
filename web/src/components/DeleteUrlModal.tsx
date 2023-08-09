import toast from 'react-hot-toast';
import { BiError } from 'react-icons/bi';
import { ICallbacks, Modal, MODAL_IDS } from '../common';
import { UrlService } from '../services';
import { Utils } from '../utils';

interface IProps extends ICallbacks {
  redirectHash: string;
}

export const DeleteUrlModal = ({ redirectHash, onClose, onSubmit }: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (): Promise<void> => {
    await toast.promise(UrlService.deleteUrl(redirectHash), {
      loading: 'Deleting QR code...',
      success: `Successfully deleted ${redirectHash}`,
      error: (e) => Utils.capitalize(e.response.data.message.toString()),
    });
    onSubmit && (await onSubmit());
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Modal
      id={MODAL_IDS.DELETE_URL}
      title="Delete link?"
      submitText="Confirm"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <span className="font-semilight">
        Deleting this link will redirect you to the error page
      </span>
      <div className="alert alert-warning my-5">
        <BiError />
        <span>
          The QR code that&rsquo;s attached to this link will also be removed
          from your account
        </span>
      </div>
    </Modal>
  );
};
