'use client';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import { useDebouncedCallback } from 'use-debounce';

import { fetchTMDBResults } from '@/app/actions/search/actions';

import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchResults from './SearchResults';

const DEBOUNCE_DELAY = 500;

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebouncedCallback(
    async (value: string) => {
      setIsLoading(true);
      const results = await fetchTMDBResults(value);
      setSearchResults(results);
      setIsLoading(false);
    },
    DEBOUNCE_DELAY
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <section className="flex space-y-10 flex-col w-full items-center">
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
        <SearchResults searchResults={searchResults} />
      )}
    </section>
  );
};

export default SearchSection;
