'use client';

import { useState } from 'react';
import { EPage } from '../common';
import { CreateAccount, Landing } from '../components';

export default function Home() {
  const [page, setPage] = useState<EPage>(EPage.CreateAccount);

  const renderPage = (): JSX.Element => {
    switch (page) {
      case EPage.CreateAccount:
        return <CreateAccount onPageChange={setPage} />;
      case EPage.Landing:
      default:
        return <Landing onPageChange={setPage} />;
    }
  };

  return <div className="flex h-screen bg-custom-black">{renderPage()}</div>;
}
