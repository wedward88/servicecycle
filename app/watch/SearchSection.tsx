'use client';

import { useEffect, useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import { useDebouncedCallback } from 'use-debounce';

import {
  addToWatchList,
  removeFromWatchList,
} from '@/app/actions/watch-list/actions';
import { User } from '@prisma/client';

import { fetchTMDBResults } from '../actions/search/actions';
import { getUserWatchList } from '../actions/watch-list/actions';
import LoadingSkeleton from './LoadingSkeleton';
import SearchResults from './SearchResults';
import { SearchResultItem } from './type';
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

  const handleAddClick = async (resultItem: SearchResultItem) => {
    const newWatchList = await addToWatchList(resultItem);
    setUserWatchList(newWatchList);
  };

  const isWatchListItem = (
    item: SearchResultItem | WatchListItemType
  ): item is SearchResultItem => {
    return 'mediaId' in item;
  };

  const handleRemoveClick = async (
    resultItem: SearchResultItem | WatchListItemType
  ) => {
    if (userWatchList) {
      if (isWatchListItem(resultItem)) {
        for (const item of userWatchList) {
          if (item.id === resultItem.id) {
            const watchList = await removeFromWatchList(item);
            setUserWatchList(watchList);
          }
        }
      } else {
        for (const item of userWatchList) {
          if (item.mediaId === resultItem.id) {
            const watchList = await removeFromWatchList(item);
            setUserWatchList(watchList);
          }
        }
      }
    }
  };

  const getWatchListSet = (): Set<number> => {
    const watchListSet = new Set<number>();
    if (userWatchList) {
      for (const item of userWatchList) {
        watchListSet.add(item.mediaId);
      }
    }
    return watchListSet;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  useEffect(() => {
    const fetchUserWatchList = async () => {
      try {
        const watchList = await getUserWatchList(user);
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
    <section className="flex flex-col items-center xl:items-start mt-10 w-full md:w-[90vw] space-y-5 xl:space-y-0 xl:space-x-5 xl:flex-row">
      <WatchList
        handleRemoveClick={handleRemoveClick}
        watchList={userWatchList}
        subscriptions={subscriptions}
      />
      <div className="flex space-y-10 flex-col w-full items-center">
        <div>
          <h1 className="text-2xl">Search for shows or movies</h1>
          <label className="inline-flex items-center gap-2 text-2xl border-b-4 b-t-0 border-l-0 border-r-0 border-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
              className="w-full max-w-xs focus:outline-none bg-inherit h-10"
            />
            {searchTerm && (
              <FaCircleXmark
                className="hover:cursor-pointer"
                onClick={() => clearSearch()}
              />
            )}
          </label>
        </div>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <SearchResults
            subscriptions={subscriptions}
            searchResults={searchResults}
            getWatchListSet={getWatchListSet}
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
          />
        )}
      </div>
    </section>
  );
};

export default SearchSection;
