'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const MainShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <main
      className={clsx(
        'w-full flex-1',
        !isLanding && 'hero-atmosphere'
      )}
    >
      {isLanding ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10">
          {children}
        </div>
      )}
    </main>
  );
};

export default MainShell;
