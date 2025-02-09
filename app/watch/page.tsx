'use client';
import { useEffect } from 'react';

import { validateSessionUser } from '../actions/utils';
import { getUserWatchList } from '../actions/watch-list/actions';
import { useMainStore } from '../store/providers/main-store-provider';
import SearchSection from './search/SearchSection';
import WatchList from './watch-list/WatchList';

const SearchPage = () => {
  const { setUserWatchList } = useMainStore((state) => state);

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

  return (
    <div className="flex flex-col items-start md:items-center lg:items-center space-y-10">
      <div className="flex flex-col items-center xl:items-start mt-10 w-full md:w-[90vw] space-y-5 xl:space-y-0 xl:space-x-5 xl:flex-row">
        <WatchList />
        <SearchSection />
      </div>
    </div>
  );
};

export default SearchPage;
