'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';

import { fetchWatchProviders } from '@/app/actions/search/actions';

import { SearchResultItem } from '../type';
import AddToWatchList from './AddToWatchList';
import ResultModal from './ResultModal';
import { WatchProvidersResponse } from './types';

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

type ResultCardProps = {
  result: SearchResultItem;
  subscriptions: Set<number>;
  isInWatchList: Boolean;
  handleAddClick: (resultItem: SearchResultItem) => void;
  handleRemoveClick: (resultItem: SearchResultItem) => void;
};

const ResultCard = ({
  result,
  subscriptions,
  isInWatchList,
  handleAddClick,
  handleRemoveClick,
}: ResultCardProps) => {
  const [watchProviders, setWatchProviders] =
    useState<WatchProvidersResponse | null>(null);

  const resultClick = async (type: string, id: number) => {
    const wp = await fetchWatchProviders(type, id);
    setWatchProviders(wp);
    const modal = document.getElementById(`modal-${id}`);

    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  const isTV = result.media_type === 'tv';
  const title = isTV ? result.original_name : result.original_title;

  return (
    <div className="relative">
      <AddToWatchList
        isInWatchList={isInWatchList}
        onAdd={() => handleAddClick(result)}
        onRemove={() => handleRemoveClick(result)}
        className="absolute top-2 right-2 text-5xl rounded-badge backdrop-blur-lg  font-bold mix-blend-overlay hover:cursor-pointer z-10"
      />
      <div
        onClick={() => resultClick(result.media_type, result.id)}
        className="card bg-base-300 shadow-xl w-[300px] mx-auto rounded-3xl hover:cursor-pointer"
      >
        <figure>
          <img
            src={`${baseImageURL}${result.poster_path}`}
            alt={title}
            className="w-full max-h-[300px] object-top object-cover"
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
        result={result}
        title={title}
        isTV={isTV}
        watchProviders={watchProviders}
        subscriptions={subscriptions}
        handleAddClick={handleAddClick}
        handleRemoveClick={handleRemoveClick}
        isInWatchList={isInWatchList}
      />
    </div>
  );
};

export default ResultCard;
