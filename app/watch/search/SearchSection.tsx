'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';
import { useDebouncedCallback } from 'use-debounce';

import {
  fetchTMDBByProvider,
  fetchTMDBResults,
} from '@/app/actions/search/actions';
import { useMainStore } from '@/app/store/providers/main-store-provider';

import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchResults from './SearchResults';
import { MediaTypeFilter, SearchResultItemType } from './types';

const DEBOUNCE_DELAY = 500;
const baseImageURL = 'https://www.themoviedb.org/t/p/w92';

const MEDIA_FILTERS: {
  id: MediaTypeFilter;
  label: string;
  Icon?: typeof MdLocalMovies;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies', Icon: MdLocalMovies },
  { id: 'tv', label: 'TV', Icon: ImTv },
];

const SearchSection = () => {
  const { subscriptions } = useMainStore((state) => state);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    SearchResultItemType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<
    number | null
  >(null);
  const [mediaFilter, setMediaFilter] =
    useState<MediaTypeFilter>('all');

  const subscribedProviders = subscriptions
    .map((sub) => sub.streamingProvider)
    .filter(
      (
        provider
      ): provider is NonNullable<typeof provider> =>
        Boolean(provider?.providerId)
    );

  const runTextSearch = async (
    value: string,
    mediaType: MediaTypeFilter
  ) => {
    if (!value.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchTMDBResults(value, mediaType);
      setSearchResults(results);
    } catch (error) {
      console.error('Title search failed', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const runProviderSearch = async (
    providerId: number,
    mediaType: MediaTypeFilter
  ) => {
    setIsLoading(true);
    try {
      const results = await fetchTMDBByProvider(
        providerId,
        mediaType
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Provider search failed', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebouncedCallback(
    runTextSearch,
    DEBOUNCE_DELAY
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    setSelectedProviderId(null);
    debouncedSearch(value, mediaFilter);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedProviderId(null);
  };

  const handleMediaFilterChange = (next: MediaTypeFilter) => {
    if (next === mediaFilter) return;
    setMediaFilter(next);

    if (selectedProviderId != null) {
      void runProviderSearch(selectedProviderId, next);
      return;
    }

    if (searchTerm.trim()) {
      void runTextSearch(searchTerm, next);
    }
  };

  const handleProviderSelect = async (providerId: number) => {
    if (selectedProviderId === providerId) {
      clearSearch();
      return;
    }

    setSelectedProviderId(providerId);
    setSearchTerm('');
    await runProviderSearch(providerId, mediaFilter);
  };

  const selectedProvider = subscribedProviders.find(
    (provider) => provider.providerId === selectedProviderId
  );

  return (
    <section className="overflow-hidden border border-base-300 surface">
      <div className="border-b border-base-300 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-base-content">
          Search for shows or movies
        </h2>
        <label className="mt-3 flex items-center gap-2 border-b-2 border-primary pb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={handleChange}
            className="h-9 w-full bg-transparent text-base text-base-content focus:outline-none"
          />
          {(searchTerm || selectedProviderId) && (
            <FaCircleXmark
              className="cursor-pointer text-secondary hover:text-base-content"
              onClick={() => clearSearch()}
            />
          )}
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {MEDIA_FILTERS.map(({ id, label, Icon }) => {
            const isSelected = mediaFilter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleMediaFilterChange(id)}
                className={clsx(
                  'inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-sm transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-base-300 bg-base-100 text-base-content hover:border-primary/50'
                )}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-secondary">
            Browse by your subscriptions
          </p>
          {subscribedProviders.length === 0 ? (
            <p className="mt-2 text-sm text-secondary/80">
              Add subscriptions to filter search by provider.
            </p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {subscribedProviders.map((provider) => {
                const isSelected =
                  selectedProviderId === provider.providerId;
                return (
                  <li key={provider.providerId}>
                    <button
                      type="button"
                      onClick={() =>
                        handleProviderSelect(provider.providerId)
                      }
                      className={clsx(
                        'inline-flex items-center gap-2 border px-2.5 py-1.5 text-sm transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 bg-base-100 text-base-content hover:border-primary/50'
                      )}
                    >
                      {provider.logoUrl ? (
                        <Image
                          src={`${baseImageURL}${provider.logoUrl}`}
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-md object-cover"
                        />
                      ) : null}
                      <span className="font-medium">
                        {provider.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="p-4">
        {selectedProvider && !isLoading && (
          <p className="mb-3 text-sm text-secondary">
            Popular{' '}
            {mediaFilter === 'movie'
              ? 'movies'
              : mediaFilter === 'tv'
                ? 'TV shows'
                : 'titles'}{' '}
            on {selectedProvider.name}
          </p>
        )}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <SearchResults searchResults={searchResults} />
        )}
      </div>
    </section>
  );
};

export default SearchSection;
