import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  AiFillCopy,
  AiFillDelete,
  AiFillEye,
  AiFillPlusCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { TiTickOutline } from 'react-icons/ti';
import { BASE_URL, Container, IUrl } from '../common';
import { useAuth } from '../hooks';
import { UrlService } from '../services';
import { CreateUrlModal } from './CreateUrlModal';
import { NavBar } from './NavBar';
import { ViewUrlModal } from './ViewUrlModal';

interface IToggleModal {
  isOpen: boolean;
  type: 'Create' | 'View' | '';
  redirectUrl: string;
  fgColor?: string;
}

export const Dashboard = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [urls, setUrls] = useState<IUrl[]>([]);
  const [copiedUrls, setCopiedUrls] = useState<Set<number>>(new Set());
  const [toggleModal, setToggleModal] = useState<IToggleModal>({
    isOpen: false,
    type: '',
    redirectUrl: '',
    fgColor: '',
  });
  const router = useRouter();
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
          const handleViewUrl = (): void => {
            const redirectUrl = `${BASE_URL}/url/${props.row.original.redirectHash}`;

            setToggleModal({
              isOpen: true,
              redirectUrl,
              fgColor: props.row.original.qrFgColor,
              type: 'View',
            });
          };

          return (
            <div className="flex space-x-3 text-lg">
              <AiFillEye
                className="cursor-pointer hover:text-custom-gold-primary"
                onClick={handleViewUrl}
              />
              <AiFillDelete className="cursor-pointer hover:text-custom-gold-primary" />
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
  };

  const resetModal = (): void => {
    setToggleModal({ isOpen: false, redirectUrl: '', fgColor: '', type: '' });
  };

  const handleToggleCreate = (): void => {
    setToggleModal({
      isOpen: true,
      type: 'Create',
      redirectUrl: '',
    });
  };

  const handleCreateUrl = async (): Promise<void> => {
    await fetchUrls();
    resetModal();
  };

  /* -------------------------------------------------------------------------- */
  /*                              RENDER FUNCTIONS                              */
  /* -------------------------------------------------------------------------- */
  const renderModal = (): JSX.Element | undefined => {
    switch (toggleModal.type) {
      case 'Create':
        return (
          <CreateUrlModal
            isOpen={toggleModal.isOpen}
            onClose={resetModal}
            onSubmit={handleCreateUrl}
          />
        );
      case 'View':
        return <ViewUrlModal {...toggleModal} onClose={resetModal} />;
    }
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
          onClick={handleToggleCreate}
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
    <Container styles="py-16 space-y-5">
      {renderModal()}
      <NavBar onLogout={signOut} />
      <div className="flex max-h-full w-full flex-col items-center rounded-2xl border border-neutral p-10">
        <div className="mb-5 flex w-full items-center justify-between self-start text-2xl">
          <span className="font-bold">Shorted URLs Dashboard</span>
          <button
            className="hover:text-custom-gold-primary"
            onClick={handleToggleCreate}
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
