'use client';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { fetchTMDBResults } from '../actions/actions';
import SearchResults from './SearchResults';
import LoadingSkeleton from './LoadingSkeleton';

const DEBOUNCE_DELAY = 500;

const SearchForm = () => {
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
  return (
    <div className="flex flex-col space-y-10 w-full items-center">
      <input
        type="text"
        placeholder="Ex...Severance"
        value={searchTerm}
        onChange={handleChange}
        className="text-2xl border-b-2 b-t-0 border-l-0 border-r-0 border-primary w-full max-w-xs focus:outline-none bg-inherit h-10"
      />
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <SearchResults searchResults={searchResults} />
      )}
    </div>
  );
};

export default SearchForm;
