'use client';
import { useState } from 'react';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';

import { fetchWatchProviders } from '@/app/actions/actions';

import { SearchResultItem } from '../type';
import ResultModal from './ResultModal';
import { WatchProvidersResponse } from './types';

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

type ResultCardProps = {
  result: SearchResultItem;
};

const ResultCard = ({ result }: ResultCardProps) => {
  const [watchProviders, setWatchProviders] =
    useState<WatchProvidersResponse | null>(null);

  const resultClick = async (type: string, id: number) => {
    const wp = await fetchWatchProviders(type, id);
    console.log(wp);
    setWatchProviders(wp);
    const modal = document.getElementById(`modal-${id}`);

    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  const isTV = result.media_type === 'tv';
  const title = isTV ? result.original_name : result.original_title;

  return (
    <div>
      <div className="card bg-base-300 shadow-xl w-[300px] mx-auto rounded-3xl">
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
          <h2
            onClick={() => resultClick(result.media_type, result.id)}
            className="card-title line-clamp-1 cursor-pointer border-b-4 border-base-300 hover:border-b-4 hover:border-accent"
          >{`${title}`}</h2>
        </div>
        <ResultModal
          result={result}
          title={title}
          isTV={isTV}
          watchProviders={watchProviders}
        />
      </div>
    </div>
  );
};

export default ResultCard;
