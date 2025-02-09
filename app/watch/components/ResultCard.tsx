'use client';
import Image from 'next/image';
import { useState } from 'react';
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

  const resultClick = async (type: string, id: number) => {
    const wp = await fetchWatchProviders(type, id);
    const watchResult = mapSearchResultToWatchListItem(result, wp);
    setSearchResult(watchResult);

    const modal = document.getElementById(`search-modal-${id}`);

    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  const isTV = result.media_type === 'tv';
  const title = isTV ? result.original_name : result.original_title;

  return (
    <div className="relative w-full">
      <AddToWatchList
        className="absolute top-2 right-2 text-5xl rounded-badge backdrop-contrast-200 backdrop-blur-lg hover:cursor-pointer z-10"
        isInWatchList={isInWatchList}
        result={result}
      />
      <div
        onClick={() => resultClick(result.media_type, result.id)}
        className="card bg-base-300 shadow-xl w-full max-w-72 mx-auto rounded-3xl hover:cursor-pointer"
      >
        <figure>
          <Image
            src={`${baseImageURL}${result.poster_path}`}
            alt={title}
            width={300}
            height={100}
            className="w-full max-h-[300px] object-top object-cover aspect-[3/2.2]"
          />
        </figure>
        <div className="card-body flex flex-row">
          <div className="flex items-center text-2xl text-primary">
            {isTV ? <ImTv /> : <MdLocalMovies />}
          </div>
          <h2 className="card-title line-clamp-1 cursor-pointer border-b-4 border-base-300">{`${title}`}</h2>
        </div>
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
