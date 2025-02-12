'use client';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import SignOutLink from './SignOut';

const NavBar = () => {
  const { status, data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div
      className={clsx(
        'navbar bg-base-100 justify-between',
        status === 'unauthenticated' && 'hidden',
        status === 'authenticated' && 'flex'
      )}
    >
      {status === 'unauthenticated' && <></>}
      {status === 'loading' && <div>Loading...</div>}
      {status === 'authenticated' && (
        <>
          <a className="text-3xl mr-5 font-thin text-primary underline decoration-4 decoration-base-200">
            ServiceCycle
          </a>
          <div className="gap-2">
            <div className="flex-1 space-x-5 whitespace-nowrap underline decoration-1 decoration-accent hidden md:flex">
              <Link href="/subscriptions">Subscriptions</Link>
              <Link href="/watch">Watch List</Link>
            </div>

            <div
              className="dropdown dropdown-end"
              data-toggle="dropdown"
            >
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    alt=""
                    width="30"
                    height="30"
                    className="rounded-full"
                    onClick={toggleDropdown}
                    src={session.user?.image || ''}
                  />
                </div>
              </div>
              {isOpen && (
                <ul
                  tabIndex={0}
                  className="menu menu-md dropdown-content bg-base-content text-base-200 font-bold rounded-box z-[1] mt-3 w-auto p-2 shadow"
                  onClick={toggleDropdown}
                >
                  <li>
                    <Link href="/watch" className="whitespace-nowrap">
                      Watch List
                    </Link>
                  </li>
                  <li>
                    <Link href="/subscriptions">Subscriptions</Link>
                  </li>
                  <li>
                    <SignOutLink />
                  </li>
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
