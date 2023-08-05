import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import {
  AiFillCopy,
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { BASE_URL, Container, IPageProps, IUrl } from '../common';
import { UrlService } from '../services';
import { CreateUrlModal } from './CreateUrlModal';
import { NavBar } from './NavBar';

interface IProps extends IPageProps {}

const getData = (): IUrl[] => [
  ...Array(30)
    .fill(0)
    .map((x, index) => ({
      url: 'http://google.com',
      title: 'asd',
      redirectHash: 'a',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        minute: 'numeric',
        hour: 'numeric',
      }),
    })),
];
const data = getData();

interface IToggleModal {
  isOpen: boolean;
  type?: 'Create' | '';
}

export const Dashboard = ({}: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */
  const [urls, setUrls] = useState<IUrl[]>([]);
  const [toggleModal, setToggleModal] = useState<IToggleModal>({
    isOpen: false,
    type: '',
  });

  useEffect(() => {
    fetchUrls();
  }, []);

  const columns = useMemo<ColumnDef<IUrl>[]>(
    () => [
      {
        header: 'Title',
        cell: (info) => info.getValue(),
        accessorKey: 'title',
      },
      {
        header: 'URL',
        cell: (info) => {
          const redirectHash = info.getValue<string>();
          const redirectUrl = `${BASE_URL}/url/${redirectHash}`;

          return (
            <div className="flex items-center space-x-2">
              <AiFillCopy className="cursor-pointer text-lg hover:text-custom-gold-primary" />
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
        cell: (info) => info.getValue(),
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
    [],
  );

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

  const handleLogout = (): void => {
    console.log('logout');
  };

  const handleToggleCreate = (): void => {
    setToggleModal({
      isOpen: true,
      type: 'Create',
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                              RENDER FUNCTIONS                              */
  /* -------------------------------------------------------------------------- */
  const renderModal = (): JSX.Element | undefined => {
    switch (toggleModal.type) {
      case 'Create':
        return (
          <CreateUrlModal isOpen={toggleModal.isOpen} onClose={resetModal} />
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
            className="py-3 text-start"
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
          <td key={cell.id} className="text-ellipsis py-4">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ));
  };

  const renderPagination = (): JSX.Element => {
    return (
      <div className="mt-5 flex h-10 rounded-xl bg-custom-gray-secondary/10">
        <button
          className="h-full w-8 px-2 hover:rounded-l-xl hover:bg-custom-gray-secondary/25 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <AiOutlineLeft />
        </button>
        <div className="flex h-full cursor-pointer items-center px-3 font-medium uppercase hover:bg-custom-gray-secondary/25">
          Page {table.getPageCount()}
        </div>
        <button
          className="h-full w-8 px-2 hover:rounded-r-xl hover:bg-custom-gray-secondary/25 disabled:cursor-not-allowed"
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
      <div className="flex max-h-full w-full flex-col items-center rounded-2xl bg-custom-gray-primary px-10 py-5">
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
