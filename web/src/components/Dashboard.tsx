import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import {
  AiFillDelete,
  AiFillPauseCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { LuLogOut } from 'react-icons/lu';
import { IPageProps, IUrl } from '../common';
import { Container } from './Container';

interface IProps extends IPageProps {}

const getData = (): IUrl[] => [
  ...Array(30)
    .fill(0)
    .map((x, index) => ({
      index,
      url: 'http://google.com',
      alias: 'asd',
      created: 'asd',
    })),
];
const data = getData();

export const Dashboard = ({}: IProps) => {
  const columns = useMemo<ColumnDef<IUrl>[]>(
    () => [
      {
        header: '',
        accessorKey: 'index',
      },
      {
        header: 'Alias',
        cell: (info) => info.getValue(),
        accessorKey: 'alias',
      },
      {
        header: 'URL',
        cell: (info) => {
          const value = info.getValue<string>();
          return (
            <a className="hover:text-custom-gold" href={value}>
              {value}
            </a>
          );
        },
        accessorKey: 'url',
      },
      {
        header: 'QR',
        cell: (info) => (
          <QRCodeSVG
            className="h-10 w-10"
            value={info.row.original.url}
            level="M"
            // imageSettings={{ excavate: true }}
          />
        ),
        accessorKey: 'qr',
      },
      {
        header: 'Created',
        cell: (info) => info.getValue(),
        accessorKey: 'created',
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

  const handleLogout = (): Promise<void> => {
    console.log('logout');
  };

  const renderTableHeader = (): JSX.Element[] => {
    return table.getHeaderGroups().map((headerGroup, index) => (
      <tr
        key={headerGroup.id || index}
        className="border-b-[0.5px] border-gray-500"
      >
        {headerGroup.headers.map((header, index) => (
          <th key={header.id || index} className="py-3 text-start">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
        <th />
        <th />
      </tr>
    ));
  };

  const renderTableBody = (): JSX.Element[] => {
    return table.getRowModel().rows.map((row) => (
      <tr key={row.id} className="border-b-[0.5px] border-gray-500">
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className="min-w-[10px] max-w-[100px] text-ellipsis py-3"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
        <td className="w-10">
          <AiFillPauseCircle className="cursor-pointer text-lg hover:text-custom-gold" />
        </td>
        <td className="w-10">
          <AiFillDelete className="cursor-pointer text-lg hover:text-custom-gold" />
        </td>
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
      <div className="flex w-full justify-between rounded-2xl bg-custom-gray-primary px-10 py-5 text-custom-white">
        <div className="font-bold">LinkNow</div>
        <LuLogOut onClick={handleLogout} className="cursor-pointer text-xl" />
      </div>
      <div className="flex max-h-full w-full flex-col items-center rounded-2xl bg-custom-gray-primary px-10 py-5">
        <table className="w-full overflow-y-scroll">
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
        {renderPagination()}
      </div>
    </Container>
  );
};
