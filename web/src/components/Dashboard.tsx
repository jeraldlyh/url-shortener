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
  AiFillEdit,
  AiFillPlusCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { TiTickOutline } from 'react-icons/ti';
import { BASE_URL, CLIENT_ROUTES, Container, IUrl } from '../common';
import { AuthService, UrlService } from '../services';
import { CreateUrlModal } from './CreateUrlModal';
import { NavBar } from './NavBar';

interface IToggleModal {
  isOpen: boolean;
  type?: 'Create' | '';
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
  });
  const router = useRouter();

  useEffect(() => {
    fetchUrls();
  }, []);

  const columns = useMemo<ColumnDef<IUrl>[]>(
    () => [
      {
        header: 'Title',
        cell: (props) => props.getValue(),
        accessorKey: 'title',
      },
      {
        header: 'URL',
        cell: (props) => {
          const redirectHash = props.getValue<string>();
          const redirectUrl = `${BASE_URL}/url/${redirectHash}`;
          const isCopied = copiedUrls.has(props.row.index);

          return (
            <div className="flex items-center space-x-2">
              <CopyToClipboard
                text={redirectUrl}
                onCopy={() => handleCopyToClipboard(props.row.index, isCopied)}
              >
                <label className="swap swap-rotate">
                  <input type="checkbox" />
                  <AiFillCopy className="swap-on cursor-pointer text-lg hover:text-custom-gold-primary" />
                  <TiTickOutline className="swap-off" />
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
        cell: () => (
          <div className="flex space-x-3">
            <AiFillEdit className="cursor-pointer text-lg hover:text-custom-gold-primary" />
            <AiFillDelete className="cursor-pointer text-lg hover:text-custom-gold-primary" />
          </div>
        ),
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
    setToggleModal({ isOpen: false });
  };

  const handleLogout = async (): Promise<void> => {
    await AuthService.logout();
    router.push(CLIENT_ROUTES.HOME);
  };

  const handleToggleCreate = (): void => {
    setToggleModal({
      isOpen: true,
      type: 'Create',
    });
  };

  const handleCreateUrl = async (): Promise<void> => {
    await fetchUrls();
    resetModal();
  };

  // NOTE: Prevent user from copying multiple times
  const handleCopyToClipboard = (index: number, isCopied: boolean): boolean => {
    if (isCopied) return false;

    const updatedCopiedUrls = new Set(copiedUrls);
    updatedCopiedUrls.add(index);

    setCopiedUrls(updatedCopiedUrls);
    return true;
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
      <NavBar onLogout={handleLogout} />
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
