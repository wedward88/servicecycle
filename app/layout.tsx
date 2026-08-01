import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';

import AuthProvider from './api/auth/Provider';
import MainShell from './components/MainShell';
import NavBar from './components/NavBar';
import TmdbAttribution from './components/TmdbAttribution';
import { MainStoreProvider } from './store/providers/main-store-provider';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'ServiceCycle',
  description:
    'Track streaming subscriptions and find where to watch.',
  icons: {
    icon: '/servicecycle-mark.png',
    apple: '/servicecycle-mark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="servicecycle">
      <body
        className={`${roboto.variable} font-body antialiased min-h-screen flex flex-col bg-base-100 text-base-content`}
      >
        <AuthProvider>
          <NavBar />
          <MainShell>
            <MainStoreProvider>{children}</MainStoreProvider>
          </MainShell>
          <footer className="mt-auto border-t border-base-300 bg-base-100">
            <div className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8">
              <TmdbAttribution />
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
