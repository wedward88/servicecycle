import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import AuthProvider from './api/auth/Provider';
import NavBar from './components/NavBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ServiceCycle',
  description: 'Track your subscriptions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="aqua">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center m-2 p-5`}
      >
        <AuthProvider>
          <NavBar />
          <main className="w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
