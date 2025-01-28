'use client';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { fetchTMDBResults } from '../actions/search/actions';
import LoadingSkeleton from './LoadingSkeleton';
import SearchResults from './SearchResults';

interface SearchFormProps {
  subscriptions: Set<number>;
}

const DEBOUNCE_DELAY = 500;

const SearchForm = ({ subscriptions }: SearchFormProps) => {
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
        />
      )}
    </div>
  );
};

export default SearchForm;
