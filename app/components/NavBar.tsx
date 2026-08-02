'use client';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'motion/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { menuEnter, transitionFast } from '@/app/lib/motion';

import BrandWordmark from './BrandWordmark';
import SignOutButton from './SignOut';

const NavBar = () => {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const linkClass = (href: string) =>
    clsx(
      'text-sm font-medium transition-colors underline-offset-4',
      pathname?.startsWith(href)
        ? 'text-primary underline decoration-primary/40'
        : 'text-secondary hover:text-primary'
    );

  const firstName = session?.user?.name?.split(' ')[0];
  const email = session?.user?.email;
  const image = session?.user?.image;

  return (
    <header
      className={clsx(
        'w-full border-b border-base-300 surface',
        status === 'unauthenticated' && 'hidden',
        (status === 'authenticated' || status === 'loading') &&
          'block'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.25rem] md:px-8 xl:max-w-7xl 2xl:max-w-[90rem] 2xl:px-10">
        {status === 'loading' && (
          <p className="text-sm text-secondary">Loading...</p>
        )}
        {status === 'authenticated' && (
          <>
            <div className="flex items-center gap-8">
              <Link
                href="/subscriptions"
                className="shrink-0"
              >
                <BrandWordmark className="font-display text-xl font-medium leading-none tracking-tight md:text-2xl" />
              </Link>
              <nav className="hidden items-center gap-5 md:flex">
                <Link
                  href="/subscriptions"
                  className={linkClass('/subscriptions')}
                >
                  Subscriptions
                </Link>
                <Link href="/watch" className={linkClass('/watch')}>
                  Watch List
                </Link>
              </nav>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 py-1 pl-1 pr-2.5 transition-colors hover:border-primary/40"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {image ? (
                  <Image
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                    src={image}
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
                    {(firstName || 'U').charAt(0)}
                  </span>
                )}
                {firstName && (
                  <span className="hidden max-w-[8rem] truncate text-sm font-medium text-base-content sm:block">
                    {firstName}
                  </span>
                )}
                <svg
                  viewBox="0 0 16 16"
                  className={clsx(
                    'h-3.5 w-3.5 text-secondary transition-transform',
                    menuOpen && 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" />
                </svg>
              </button>

              {menuOpen && (
                <motion.div
                  role="menu"
                  variants={menuEnter}
                  initial={reduceMotion ? false : 'hidden'}
                  animate="visible"
                  transition={
                    reduceMotion ? { duration: 0 } : transitionFast
                  }
                  className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-md border border-base-300 surface shadow-sm"
                >
                  <div className="border-b border-base-300 px-4 py-3">
                    <p className="truncate text-sm font-medium text-base-content">
                      {session.user?.name}
                    </p>
                    {email && (
                      <p className="truncate text-xs text-secondary">
                        {email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col p-1 md:hidden">
                    <Link
                      href="/subscriptions"
                      role="menuitem"
                      className="rounded px-3 py-2 text-sm text-base-content hover:bg-base-200"
                    >
                      Subscriptions
                    </Link>
                    <Link
                      href="/watch"
                      role="menuitem"
                      className="rounded px-3 py-2 text-sm text-base-content hover:bg-base-200"
                    >
                      Watch List
                    </Link>
                  </div>

                  <div className="border-t border-base-300 p-1">
                    <SignOutButton className="w-full rounded px-3 py-2 text-left text-sm text-secondary transition-colors hover:bg-base-200 hover:text-base-content" />
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
