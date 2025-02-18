import type { Metadata } from 'next';
import './globals.css';

import { Roboto } from 'next/font/google';

import AuthProvider from './api/auth/Provider';
import NavBar from './components/NavBar';
import { MainStoreProvider } from './store/providers/main-store-provider';

const roboto = Roboto({
  weight: ['100', '300'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ServiceCycle',
  description: 'Track your subscriptions.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="aqua">
      <body
        className={`${roboto.className} antialiased flex flex-col items-center m-2 p-5 h-[100vh]`}
      >
        <AuthProvider>
          <NavBar />
          <main className="w-full h-full">
            <MainStoreProvider>{children}</MainStoreProvider>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
