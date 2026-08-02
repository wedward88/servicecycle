'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';

import { fetchWatchProviders } from '@/app/actions/search/actions';

import { SearchResultItemType } from '../search/types';
import { WatchListItemType } from '../watch-list/types';
import AddToWatchList from './AddToWatchList';
import ResultModal from './ResultModal';
import { mapSearchResultToWatchListItem } from './utils/util';

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

type ResultCardProps = {
  result: SearchResultItemType;
  isInWatchList: boolean;
};

const ResultCard = ({ result, isInWatchList }: ResultCardProps) => {
  const [searchResult, setSearchResult] = useState<WatchListItemType>(
    mapSearchResultToWatchListItem(result, [])
  );
  const [isOpening, setIsOpening] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  useEffect(() => {
    if (!pendingOpen) return;

    const modal = document.getElementById(
      `search-modal-${result.id}`
    ) as HTMLDialogElement | null;
    modal?.showModal();
    setPendingOpen(false);
  }, [pendingOpen, searchResult, result.id]);

  const resultClick = async () => {
    if (isOpening) return;

    setIsOpening(true);
    try {
      const wp = await fetchWatchProviders(
        result.media_type,
        result.id
      );
      setSearchResult(mapSearchResultToWatchListItem(result, wp));
      setPendingOpen(true);
    } finally {
      setIsOpening(false);
    }
  };

  const isTV = result.media_type === 'tv';
  const title = isTV ? result.original_name : result.original_title;
  const hasPoster = Boolean(result.poster_path);

  return (
    <div className="group flex h-full flex-col overflow-hidden border border-base-300 bg-base-100 transition-colors hover:border-primary/40">
      <button
        type="button"
        onClick={resultClick}
        disabled={isOpening}
        className="w-full text-left disabled:cursor-wait"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-base-300">
          {hasPoster ? (
            <Image
              src={`${baseImageURL}${result.poster_path}`}
              alt=""
              width={300}
              height={450}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-secondary">
              No poster
            </div>
          )}
          {isOpening && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 backdrop-blur-[1px]">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 px-3 py-3 sm:gap-2.5 sm:px-3.5 sm:py-3.5 xl:gap-3 xl:px-4 xl:py-4">
        <button
          type="button"
          onClick={resultClick}
          disabled={isOpening}
          className="min-w-0 flex-1 text-left disabled:cursor-wait"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-secondary xl:text-[0.8125rem]">
            <span className="text-primary" aria-hidden>
              {isTV ? <ImTv /> : <MdLocalMovies />}
            </span>
            {isTV ? 'TV' : 'Movie'}
          </span>
          <h2 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-base-content xl:mt-1.5 xl:min-h-[2.75rem] xl:text-base">
            {title}
          </h2>
        </button>

        <AddToWatchList
          compact
          className="mt-auto w-full xl:px-2.5 xl:py-1.5 xl:text-sm"
          isInWatchList={isInWatchList}
          result={searchResult}
        />
      </div>

      <ResultModal
        result={searchResult}
        title={title}
        isTV={isTV}
        watchProviders={searchResult.streamingProviders}
        isInWatchList={isInWatchList}
        watchModal={false}
      />
    </div>
  );
};

export default ResultCard;
