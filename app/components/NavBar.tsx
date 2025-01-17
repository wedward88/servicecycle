'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SignOutLink from './SignOut';

const NavBar = () => {
  const { status, data: session } = useSession();

  return (
    <div className="flex w-full justify-end">
      {status === 'loading' && <div>Loading...</div>}
      {status === 'authenticated' && (
        <div className="flex w-[17%] justify-between">
          {session.user!.name}
          {/* <Link href="/api/auth/signout">Sign Out</Link> */}
          <SignOutLink />
        </div>
      )}
      {status === 'unauthenticated' && (
        <Link href="/api/auth/signin">Login</Link>
      )}
    </div>
  );
};

export default NavBar;
