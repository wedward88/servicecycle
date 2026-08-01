'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { getUserSubscriptions } from '../actions/subscription/actions';
import { validateSessionUser } from '../actions/utils';
import { getUserWatchList } from '../actions/watch-list/actions';
import { useMainStore } from '../store/providers/main-store-provider';
import SearchSection from './search/SearchSection';
import WatchList from './watch-list/WatchList';

const SearchPage = () => {
  const { data: session, status } = useSession();
  const { setUserWatchList, setSubscriptions } = useMainStore(
    (state) => state
  );

  useEffect(() => {
    const fetchUserWatchList = async () => {
      const user = await validateSessionUser();

      if (!user) {
        throw new Error('User not found.');
      }

      try {
        const watchList = await getUserWatchList(user);
        if (watchList) {
          setUserWatchList(watchList);
        }
      } catch (error) {
        console.error('Error fetching user watchlist:', error);
      }
    };

    fetchUserWatchList();
  }, [setUserWatchList]);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchSubscriptions = async () => {
      const userEmail = session?.user?.email;
      if (typeof userEmail !== 'string') return;

      try {
        const userSubs = await getUserSubscriptions(userEmail);
        setSubscriptions(userSubs?.subscriptions || []);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptions();
  }, [session, status, setSubscriptions]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
          Watch
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-base-content md:text-4xl">
          Find something to watch
        </h1>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1">
          <SearchSection />
        </div>
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-72 xl:w-80">
          <WatchList />
        </aside>
      </div>
    </div>
  );
};

export default SearchPage;
