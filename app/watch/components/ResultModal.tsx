'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';

import { filterStandaloneProviders } from '@/app/lib/streamingProviders';
import { useMainStore } from '@/app/store/providers/main-store-provider';

import {
  StreamingProviderType,
  WatchListItemType,
} from '../watch-list/types';
import AddToWatchList from './AddToWatchList';
import PosterLightbox from './PosterLightbox';

type ResultModalProps = {
  result: WatchListItemType;
  title: string | null;
  isTV: boolean;
  watchProviders: StreamingProviderType[];
  isInWatchList: boolean;
  watchModal: boolean;
};

const TMDB_POSTER_URL = 'https://www.themoviedb.org/t/p/w500';
const TMDB_POSTER_LARGE_URL = 'https://www.themoviedb.org/t/p/w780';
const TMDB_LOGO_URL = 'https://www.themoviedb.org/t/p/w92';

const ResultModal = ({
  result,
  title,
  isTV,
  watchProviders,
  isInWatchList,
  watchModal,
}: ResultModalProps) => {
  const { subscriptionIds } = useMainStore((store) => store);
  const subscriptionSet = new Set(subscriptionIds);
  const modalId = `${watchModal ? 'watch' : 'search'}-modal-${result.id}`;
  const [posterExpanded, setPosterExpanded] = useState(false);

  const providers = filterStandaloneProviders([
    ...(watchProviders ?? []),
  ]).sort((a, b) => {
    const aOnPlan = subscriptionSet.has(a.providerId);
    const bOnPlan = subscriptionSet.has(b.providerId);
    if (aOnPlan && !bOnPlan) return -1;
    if (!aOnPlan && bOnPlan) return 1;
    return a.name.localeCompare(b.name);
  });

  const onPlan = providers.filter((p) =>
    subscriptionSet.has(p.providerId)
  );
  const other = providers.filter(
    (p) => !subscriptionSet.has(p.providerId)
  );

  const closeModal = () => {
    setPosterExpanded(false);
    const modal = document.getElementById(
      modalId
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const renderProviderGroup = (
    label: string,
    list: StreamingProviderType[],
    available: boolean
  ) => {
    if (list.length === 0) return null;

    return (
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-secondary">
          {label}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map((provider) => (
            <li
              key={provider.providerId}
              className={clsx(
                'flex items-center gap-2.5 border px-2.5 py-2',
                available
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-base-300 bg-base-100'
              )}
            >
              <Image
                src={`${TMDB_LOGO_URL}${provider.logoUrl}`}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-base-content">
                {provider.name}
              </span>
              {available ? (
                <span className="shrink-0 text-xs font-medium text-primary">
                  Available
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <dialog
        id={modalId}
        className="modal modal-bottom sm:modal-middle"
        onClose={() => setPosterExpanded(false)}
      >
        <div className="modal-box relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-none border border-base-300 p-0 surface">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-base-300 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-secondary">
              <span className="shrink-0 text-primary" aria-hidden>
                {isTV ? <ImTv /> : <MdLocalMovies />}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.14em]">
                {isTV ? 'TV series' : 'Movie'}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {!watchModal && (
                <AddToWatchList
                  isInWatchList={isInWatchList}
                  result={result}
                />
              )}
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
              <div className="w-24 shrink-0 sm:w-32">
                {result.posterPath ? (
                  <button
                    type="button"
                    onClick={() => setPosterExpanded(true)}
                    className="group relative block w-full cursor-zoom-in border border-base-300 transition-colors hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label={`View larger poster for ${title || 'this title'}`}
                  >
                    <Image
                      src={`${TMDB_POSTER_URL}${result.posterPath}`}
                      alt=""
                      width={200}
                      height={300}
                      className="aspect-[2/3] w-full object-cover"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-base-100/80 px-1.5 py-1 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-secondary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      Expand
                    </span>
                  </button>
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center border border-base-300 bg-base-200 text-xs text-secondary">
                    No poster
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-base-content sm:text-2xl">
                  {title || 'Untitled'}
                </h3>
                {onPlan.length > 0 && (
                  <p className="mt-1.5 text-sm font-medium text-primary">
                    {onPlan.length === 1
                      ? `Available on ${onPlan[0].name}`
                      : `Available on ${onPlan.length} of your plans`}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {result.overview?.trim()
                    ? result.overview
                    : 'No overview available.'}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-base-300 px-4 py-4 sm:px-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                Where to watch
              </p>
              {providers.length > 0 ? (
                <div className="space-y-4">
                  {renderProviderGroup('On your plans', onPlan, true)}
                  {renderProviderGroup('Other services', other, false)}
                </div>
              ) : (
                <p className="border border-base-300 bg-base-100 px-3 py-3 text-sm text-secondary">
                  No streaming providers found for this title.
                </p>
              )}
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>

      {result.posterPath ? (
        <PosterLightbox
          open={posterExpanded}
          onClose={() => setPosterExpanded(false)}
          src={`${TMDB_POSTER_LARGE_URL}${result.posterPath}`}
          alt={title || 'Poster'}
          title={title || 'Poster'}
        />
      ) : null}
    </>
  );
};

export default ResultModal;
