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
      type: 'image/jpg',
      sizes: 'any',
      url: '/favicon.jpg',
    },
  ],
  openGraph: {
    title: 'LinkNow | Tiny URLs, Big Impact',
    description:
      'Experience big impact with tiny URLs that are easy to share and remember',
    images: {
      url: '/favicon.jpg',
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
      <body>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          toastOptions={{
            duration: 5000,
          }}
        />
        <AuthProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
