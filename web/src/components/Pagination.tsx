import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
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
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */
  // NOTE: Reset page number when user creates new url
  useEffect(() => {
    setIndex(1);
  }, [urls]);

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
    table.nextPage();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  if (!urls || urls?.length === 0) {
    return (
      <button className="btn btn-primary w-full" onClick={onClick}>
        Create your first link
      </button>
    );
  }
  return (
    <div className="join mt-4 border border-base-100 disabled:cursor-not-allowed">
      <button
        className="btn join-item"
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
        className="btn join-item"
        onClick={handleNextPage}
        disabled={!table.getCanNextPage()}
      >
        <AiOutlineRight />
      </button>
    </div>
  );
};
