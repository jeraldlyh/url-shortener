import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Fragment, useEffect, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  AiFillCalendar,
  AiFillCopy,
  AiFillDelete,
  AiFillPlusCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { BiLink, BiSolidDownload } from 'react-icons/bi';
import { FaLocationArrow } from 'react-icons/fa';
import { TiTickOutline } from 'react-icons/ti';
import { useMediaQuery } from 'react-responsive';
import {
  BACKEND_BASE_URL,
  Container,
  DEFAULT_QR_CODE,
  DEVICE_WIDTHS,
  IQrCode,
  IUrl,
  MODAL_IDS,
} from '../common';
import { useAuth } from '../hooks';
import { UrlService } from '../services';
import { CreateUrlModal } from './CreateUrlModal';
import { DeleteUrlModal } from './DeleteUrlModal';
import { NavBar } from './NavBar';
import { ViewUrlModal } from './ViewUrlModal';

export const Dashboard = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [urls, setUrls] = useState<IUrl[]>([]);
  const [copiedUrls, setCopiedUrls] = useState<Set<number>>(new Set());
  const [viewQrCode, setViewQrCode] = useState<IQrCode>(DEFAULT_QR_CODE);
  const [deleteRedirectHash, setDeleteRedirectHash] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { signOut } = useAuth();
  const isDesktop = useMediaQuery({ minWidth: DEVICE_WIDTHS.DESKTOP });
  const columns = useMemo<ColumnDef<IUrl>[]>(() => [], []);

  const data = urls as IUrl[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* -------------------------------------------------------------------------- */
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    fetchUrls();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              HANDLER FUNCTIONS                             */
  /* -------------------------------------------------------------------------- */
  const fetchUrls = async (): Promise<void> => {
    const urls = await UrlService.getAllUrls();
    setUrls(urls);
    setIsLoading(false);
  };

  const handleOpenModal = (id: keyof typeof MODAL_IDS): void => {
    const modalId = MODAL_IDS[id];
    const modal = document.getElementById(modalId) as HTMLFormElement;

    modal.showModal();
  };

  const handleCloseModal = (id: keyof typeof MODAL_IDS): void => {
    const modalId = MODAL_IDS[id];
    const modal = document.getElementById(modalId) as HTMLFormElement;

    modal.close();
  };

  const resetModal = async (id: keyof typeof MODAL_IDS): Promise<void> => {
    await fetchUrls();
    handleCloseModal(id);
    setDeleteRedirectHash('');
    setViewQrCode(DEFAULT_QR_CODE);
  };

  /* -------------------------------------------------------------------------- */
  /*                              RENDER FUNCTIONS                              */
  /* -------------------------------------------------------------------------- */
  const renderModal = (): JSX.Element => {
    return (
      <Fragment>
        <CreateUrlModal
          onSubmit={() => resetModal('CREATE_URL')}
          onClose={() => handleCloseModal('CREATE_URL')}
        />
        <ViewUrlModal
          {...viewQrCode}
          onSubmit={() => resetModal('VIEW_URL')}
          onClose={() => handleCloseModal('VIEW_URL')}
        />
        <DeleteUrlModal
          redirectHash={deleteRedirectHash}
          onSubmit={() => resetModal('DELETE_URL')}
          onClose={() => handleCloseModal('DELETE_URL')}
        />
      </Fragment>
    );
  };

  const renderTableHeader = (): JSX.Element[] | undefined => {
    if (!isDesktop) {
      return;
    }

    return table.getHeaderGroups().map((headerGroup, index) => (
      <tr
        key={headerGroup.id || index}
        className="border-b-[0.5px] border-gray-500"
      >
        <th className="flex w-full">
          <span className="w-1/12 text-start uppercase">Title</span>
          <span className="w-6/12 text-start uppercase">URL</span>
          <span className="w-3/12 text-start uppercase">Created at</span>
          <span className="w-1/12 text-start uppercase">Actions</span>
        </th>
      </tr>
    ));
  };

  const renderTableBody = (): JSX.Element[] => {
    return table.getRowModel().rows.map((row, index) => {
      const {
        url: originalUrl,
        redirectHash,
        createdAt,
        qrCode: { fgColor, isCreated },
      } = row.original;
      const redirectUrl = `${BACKEND_BASE_URL}/url/${row.original.redirectHash}`;
      const isCopied = copiedUrls.has(index);

      // NOTE: Prevent user from copying multiple times
      const handleCopyToClipboard = (): boolean => {
        if (isCopied) return false;
        const updatedCopiedUrls = new Set(copiedUrls);
        updatedCopiedUrls.add(index);
        setCopiedUrls(updatedCopiedUrls);
        return true;
      };

      const isChecked = (): boolean => copiedUrls.has(index);

      const formatTitle = (): string =>
        row.original.title || row.original.url.split('.')[1];

      const formatCreatedAt = (): string =>
        new Date(createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          ...(isDesktop && {
            minute: 'numeric',
            hour: 'numeric',
          }),
        });

      const handleViewUrl = (): void => {
        const redirectUrl = `${BACKEND_BASE_URL}/url/${redirectHash}`;
        setViewQrCode({
          isCreated,
          redirectUrl,
          fgColor,
        });
        handleOpenModal('VIEW_URL');
      };

      const handleDeleteUrl = (): void => {
        setDeleteRedirectHash(redirectHash);
        handleOpenModal('DELETE_URL');
      };

      if (!isDesktop) {
        return (
          <tr key={row.id}>
            <td className="flex flex-col space-y-2">
              <div className="flex flex-col space-y-3">
                <span className="text-base font-semibold md:text-lg">
                  {formatTitle()}
                </span>
                <span className="flex items-center space-x-3 text-sm md:text-lg">
                  <BiLink />
                  <a className="link-secondary link">{originalUrl}</a>
                </span>
                <span className="flex items-center space-x-3 text-sm md:text-lg">
                  <FaLocationArrow />
                  <a
                    className="link-primary link w-full shrink"
                    href={redirectUrl}
                  >
                    {redirectUrl}
                  </a>
                </span>
                <span className="flex items-center space-x-3 text-sm md:text-lg">
                  <AiFillCalendar />
                  <span>{formatCreatedAt()}</span>
                </span>
              </div>
              <div className="flex space-x-2">
                <CopyToClipboard
                  text={redirectUrl}
                  onCopy={handleCopyToClipboard}
                >
                  <button className="btn btn-outline btn-sm flex w-full shrink space-x-2 md:btn-md">
                    <label className="swap swap-rotate">
                      <input type="checkbox" checked={isChecked()} />
                      <div className="swap-off flex items-center space-x-2 text-sm md:text-lg">
                        <AiFillCopy />
                        <span>Copy</span>
                      </div>
                      <div className="swap-on flex items-center space-x-2 text-sm md:text-lg">
                        <TiTickOutline />
                        <span>Copied</span>
                      </div>
                    </label>
                  </button>
                </CopyToClipboard>
                <button className="btn btn-primary btn-outline btn-sm md:btn-md">
                  <BiSolidDownload onClick={handleViewUrl} />
                </button>
                <button className="btn btn-secondary btn-outline btn-sm md:btn-md">
                  <AiFillDelete onClick={handleDeleteUrl} />
                </button>
              </div>
              <div className="divider" />
            </td>
          </tr>
        );
      }

      return (
        <tr key={row.id} className="border-b-[0.5px] border-gray-500">
          <td className="flex py-3">
            <span className="w-1/12 text-start">{formatTitle()}</span>
            <span className="flex w-6/12 items-center space-x-2 text-start">
              <CopyToClipboard
                text={redirectUrl}
                onCopy={handleCopyToClipboard}
              >
                <label className="swap-rotate swap text-lg">
                  <input type="checkbox" checked={isChecked()} />
                  <AiFillCopy className="swap-off cursor-pointer" />
                  <TiTickOutline className="swap-on cursor-pointer" />
                </label>
              </CopyToClipboard>
              <a
                className="link-secondary link text-ellipsis"
                href={redirectUrl}
              >
                {redirectUrl}
              </a>
            </span>
            <span className="w-3/12 text-start">{formatCreatedAt()}</span>
            <span className="flex w-1/12 space-x-3 text-lg">
              <BiSolidDownload
                className="cursor-pointer hover:text-primary-focus"
                onClick={handleViewUrl}
              />
              <AiFillDelete
                className="cursor-pointer hover:text-primary-focus"
                onClick={handleDeleteUrl}
              />
            </span>
          </td>
        </tr>
      );
    });
  };

  const renderPagination = (): JSX.Element => {
    if (!urls || urls?.length === 0) {
      return (
        <button
          className="btn btn-primary my-4 w-full"
          onClick={() => handleOpenModal('CREATE_URL')}
        >
          Create your first link
        </button>
      );
    }
    return (
      <div className="join mt-4">
        <button
          className="btn join-item disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <AiOutlineLeft />
        </button>
        <button
          className="btn join-item"
          disabled={!table.getCanPreviousPage() && !table.getCanNextPage()}
        >
          Page {table.getPageCount()}
        </button>
        <button
          className="btn join-item disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <AiOutlineRight />
        </button>
      </div>
    );
  };

  return (
    <Container styles="py-12">
      {renderModal()}
      <NavBar onLogout={signOut} />
      <div className="card mt-5 flex h-full w-full flex-col items-center bg-base-200 px-10 py-8 text-base-content shadow-xl">
        <div className="mb-5 flex w-full items-center justify-between self-start text-2xl">
          <span className="text-lg font-bold md:text-xl">Dashboard</span>
          <button
            className="hover:text-primary-focus"
            onClick={() => handleOpenModal('CREATE_URL')}
          >
            <AiFillPlusCircle />
          </button>
        </div>
        <table className="w-full overflow-y-scroll">
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
        {renderPagination()}
      </div>
    </Container>
  );
};
