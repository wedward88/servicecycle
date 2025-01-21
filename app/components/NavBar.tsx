'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

import SignOutLink from './SignOut';

const NavBar = () => {
  const { status, data: session } = useSession();

  return (
    <div className="w-full">
      {status === 'loading' && <div>Loading...</div>}
      {status === 'authenticated' && (
        <div className="flex w-full justify-between">
          <div>
            <Link className="mr-5" href="/">
              Home
            </Link>
            <Link href="/subscriptions">Subscriptions</Link>
          </div>

          <div className="flex items-center w-[200px] justify-between">
            <Image
              alt=""
              width="50"
              height="50"
              className="rounded-full"
              src={session.user?.image || ''}
            />
            <SignOutLink />
          </div>
        </div>
      )}
      {status === 'unauthenticated' && (
        <Link href="/api/auth/signin">Login</Link>
      )}
    </div>
  );
};

export default NavBar;
