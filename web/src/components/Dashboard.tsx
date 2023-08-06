import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  AiFillCopy,
  AiFillPlusCircle,
  AiOutlineCloudDownload,
  AiOutlineDelete,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { TiTickOutline } from 'react-icons/ti';
import {
  BASE_URL,
  Container,
  DEFAULT_QR_CODE,
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

  useEffect(() => {
    fetchUrls();
  }, []);

  const columns = useMemo<ColumnDef<IUrl>[]>(
    () => [
      {
        header: 'Title',
        cell: (props) =>
          props.getValue() || props.row.original.url.split('.')[1],
        accessorKey: 'title',
      },
      {
        header: 'URL',
        cell: (props) => {
          const redirectHash = props.getValue<string>();
          const redirectUrl = `${BASE_URL}/url/${redirectHash}`;
          const isCopied = copiedUrls.has(props.row.index);

          // NOTE: Prevent user from copying multiple times
          const handleCopyToClipboard = (): boolean => {
            if (isCopied) return false;

            const updatedCopiedUrls = new Set(copiedUrls);
            updatedCopiedUrls.add(props.row.index);

            setCopiedUrls(updatedCopiedUrls);
            return true;
          };

          return (
            <div className="flex items-center space-x-2">
              <CopyToClipboard
                text={redirectUrl}
                onCopy={handleCopyToClipboard}
              >
                <label className="swap swap-rotate text-lg">
                  <input type="checkbox" />
                  <AiFillCopy className="swap-off cursor-pointer" />
                  <TiTickOutline className="swap-on cursor-pointer" />
                </label>
              </CopyToClipboard>
              <a
                className="text-ellipsis text-custom-gold-primary"
                href={redirectUrl}
              >
                {redirectUrl}
              </a>
            </div>
          );
        },
        accessorKey: 'redirectHash',
      },
      {
        header: 'Created',
        cell: (props) =>
          new Date(props.getValue<string>()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            minute: 'numeric',
            hour: 'numeric',
          }),
        accessorKey: 'createdAt',
      },
      {
        header: 'Actions',
        cell: (props) => {
          const {
            redirectHash,
            qrCode: { fgColor, isCreated },
          } = props.row.original;

          const handleViewUrl = (): void => {
            const redirectUrl = `${BASE_URL}/url/${redirectHash}`;

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

          return (
            <div className="flex space-x-3 text-lg">
              <AiOutlineCloudDownload
                className="cursor-pointer hover:text-custom-gold-primary"
                onClick={handleViewUrl}
              />
              <AiOutlineDelete
                className="cursor-pointer hover:text-custom-gold-primary"
                onClick={handleDeleteUrl}
              />
            </div>
          );
        },
      },
    ],
    [copiedUrls],
  );

  const data = urls as IUrl[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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

  const renderTableHeader = (): JSX.Element[] => {
    return table.getHeaderGroups().map((headerGroup, index) => (
      <tr
        key={headerGroup.id || index}
        className="border-b-[0.5px] border-gray-500"
      >
        {headerGroup.headers.map((header, index) => (
          <th
            key={header.id || index}
            className="p-4 text-start"
            colSpan={header.colSpan}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ));
  };

  const renderTableBody = (): JSX.Element[] => {
    return table.getRowModel().rows.map((row) => (
      <tr key={row.id} className="border-b-[0.5px] border-gray-500">
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="text-ellipsis px-4 py-5">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ));
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
    <Container styles="py-16">
      {renderModal()}
      <NavBar onLogout={signOut} />
      <div className="mt-5 flex max-h-full w-full flex-col items-center rounded-2xl border border-neutral p-10">
        <div className="mb-5 flex w-full items-center justify-between self-start text-2xl">
          <span className="font-bold">Dashboard</span>
          <button
            className="hover:text-custom-gold-primary"
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
