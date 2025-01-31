'use client';
import { section } from 'motion/react-client';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { User } from '@prisma/client';

import { fetchTMDBResults } from '../actions/search/actions';
import { getUserWatchList } from '../actions/watch-list/actions';
import LoadingSkeleton from './LoadingSkeleton';
import SearchResults from './SearchResults';
import { WatchListItemType } from './watch-list/type';
import WatchList from './watch-list/WatchList';

interface SearchSectionProps {
  subscriptions: Set<number>;
  user: User;
}

const DEBOUNCE_DELAY = 500;

const SearchSection = ({
  subscriptions,
  user,
}: SearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userWatchList, setUserWatchList] = useState<
    WatchListItemType[] | null
  >(null);

  const debouncedSearch = useDebouncedCallback(
    async (value: string) => {
      setIsLoading(true);
      const results = await fetchTMDBResults(value);
      setSearchResults(results);
      setIsLoading(false);
    },
    DEBOUNCE_DELAY
  );

  useEffect(() => {
    const fetchUserWatchList = async () => {
      try {
        const watchList = await getUserWatchList(user);
        console.log(watchList);
        setUserWatchList(watchList);
      } catch (error) {
        console.error('Error fetching user watchlist:', error);
      }
    };

    fetchUserWatchList();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  return (
    <section className="flex flex-col xl:flex-row xl:space-x-[20vw]">
      <div className="flex flex-col space-y-10 w-full items-center">
        <h1 className="w-full text-2xl pl-[8px]">
          Search for shows or movies
        </h1>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
          className="text-2xl border-b-4 b-t-0 border-l-0 border-r-0 border-primary w-full max-w-xs focus:outline-none bg-inherit h-10"
        />
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <SearchResults
            subscriptions={subscriptions}
            searchResults={searchResults}
            setWatchList={setUserWatchList}
            watchList={userWatchList}
          />
        )}
      </div>
      <WatchList watchList={userWatchList} />
    </section>
  );
};

export default SearchSection;
