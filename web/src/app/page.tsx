'use client';

import { useState } from 'react';
import { EPage } from '../common';
import { CreateAccount, Dashboard, Landing } from '../components';

export default function Home() {
  const [page, setPage] = useState<EPage>(EPage.Landing);

  const renderPage = (): JSX.Element => {
    switch (page) {
      case EPage.CreateAccount:
        return <CreateAccount onPageChange={setPage} />;
      case EPage.Dashboard:
        return <Dashboard onPageChange={setPage} />;
      case EPage.Landing:
      default:
        return <Landing onPageChange={setPage} />;
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center bg-custom-black">
      {renderPage()}
    </div>
  );
}
