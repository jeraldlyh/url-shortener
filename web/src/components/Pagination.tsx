import { Table } from '@tanstack/react-table';
import { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { IUrl } from '../common';

interface IProps {
  urls: IUrl[];
  onClick: () => void;
  table: Table<IUrl>;
}

export const Pagination = ({ urls, onClick, table }: IProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const [index, setIndex] = useState<number>(1);

  /* -------------------------------------------------------------------------- */
  /*                              HELPER FUNCTIONS                              */
  /* -------------------------------------------------------------------------- */
  const handlePreviousPage = (): void => {
    if (!table.getCanPreviousPage()) return;

    setIndex(index - 1);
    table.previousPage();
  };

  const handleNextPage = (): void => {
    if (!table.getCanNextPage()) return;

    setIndex(index + 1);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  if (!urls || urls?.length === 0) {
    return (
      <button className="btn btn-primary my-4 w-full" onClick={onClick}>
        Create your first link
      </button>
    );
  }
  return (
    <div className="join mt-4">
      <button
        className="btn join-item disabled:cursor-not-allowed"
        onClick={handlePreviousPage}
        disabled={!table.getCanPreviousPage()}
      >
        <AiOutlineLeft />
      </button>
      <button
        className="btn join-item"
        disabled={!table.getCanPreviousPage() && !table.getCanNextPage()}
      >
        Page {index}/{table.getPageCount()}
      </button>
      <button
        className="btn join-item disabled:cursor-not-allowed"
        onClick={handleNextPage}
        disabled={!table.getCanNextPage()}
      >
        <AiOutlineRight />
      </button>
    </div>
  );
};
