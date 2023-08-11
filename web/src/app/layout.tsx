import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../providers';
import { LoadingProvider } from '../providers/loading';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkNow',
  description:
    'Experience big impact with tiny URLs that are easy to share and remember',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: 'any',
      url: '/favicon.png',
    },
  ],
  openGraph: {
    title: 'Tiny URLs, Big Impact - LinkNow',
    description:
      'Experience big impact with tiny URLs that are easy to share and remember',
    images: {
      url: '/favicon.png',
    },
    url: 'https://url-shortener.jeraldlyh.com/',
    locale: 'en-US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <html lang="en" data-theme="light">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
          duration: 5000,
        }}
      />
      <body>
        <AuthProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
