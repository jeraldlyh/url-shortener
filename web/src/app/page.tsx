'use client';

import { useState } from 'react';
import { EPage } from '../common';
import { Landing } from '../components';

export default function Home() {
  const [page, setPage] = useState<EPage>(EPage.Landing);

  const renderPage = (): JSX.Element => {
    switch (page) {
      case EPage.Landing:
      default:
        return <Landing onPageChange={setPage} />;
    }
  };

  return <div className="flex h-screen bg-custom-black">{renderPage()}</div>;
}
