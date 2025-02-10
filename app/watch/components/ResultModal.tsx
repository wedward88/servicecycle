import clsx from 'clsx';
import Image from 'next/image';
import { IoIosClose } from 'react-icons/io';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import { SearchResultItemType } from '../search/types';
import {
  StreamingProviderType,
  WatchListItemType,
} from '../watch-list/types';
import AddToWatchList from './AddToWatchList';

type ResultModalProps = {
  result: WatchListItemType;
  title: string | null;
  isTV: boolean;
  watchProviders: StreamingProviderType[];
  isInWatchList: boolean;
  watchModal: boolean;
};

const TMDB_IMAGE_URL = 'https://www.themoviedb.org/t/p/w500';

const ResultModal = ({
  result,
  title,
  watchProviders,
  isInWatchList,
  watchModal,
}: ResultModalProps) => {
  const { subscriptionIds } = useMainStore((store) => store);
  const subscriptionSet = new Set(subscriptionIds);
  const sortProviderList = () => {
    const providerList = watchProviders ?? [];

    providerList.sort((a, b) => {
      const aInSubscriptions = subscriptionSet.has(a.providerId);
      const bInSubscriptions = subscriptionSet.has(b.providerId);

      if (aInSubscriptions && !bInSubscriptions) return -1;
      if (!aInSubscriptions && bInSubscriptions) return 1;

      return 0;
    });

    return providerList;
  };

  const renderWatchProviders = () => {
    const watchProviderList = sortProviderList();

    return (
      <div className="mt-2">
        <ul className="flex flex-row space-x-2">
          {watchProviderList.map((provider, idx) => {
            return (
              <li key={idx}>
                <Image
                  src={`${TMDB_IMAGE_URL}${provider.logoUrl}`}
                  alt={provider.name}
                  width={100}
                  height={100}
                  title={provider.name}
                  className={clsx(
                    'w-10 rounded-xl h-full object-fill',
                    !subscriptionSet.has(provider.providerId) &&
                      'opacity-20'
                  )}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <dialog
        id={`${watchModal ? 'watch' : 'search'}-modal-${result.id}`}
        className="modal modal-bottom sm:modal-middle max-h-[100vh] max-w-[100vw]"
      >
        <div className="modal-box p-0">
          <div className="sticky top-0">
            <form method="dialog">
              <button className="absolute top-0 right-0 p-2 text-4xl">
                <IoIosClose className="shadow-xl mix-blend-normal rounded-badge backdrop-contrast-200 backdrop-blur-lg" />
              </button>
            </form>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <Image
              src={`https://www.themoviedb.org/t/p/w500${result.posterPath}`}
              width={500}
              height={500}
              alt={title ?? 'No title available.'}
              className="w-full object-cover object-top"
            />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{title}</h3>
              {!watchModal && (
                <AddToWatchList
                  className="text-4xl text-white hover:cursor-pointer"
                  isInWatchList={isInWatchList}
                  result={result as unknown as SearchResultItemType}
                />
              )}
            </div>
            <p className="py-2">{result.overview}</p>
            <h4 className="font-bold text-lg">Where to watch</h4>
            {watchProviders &&
            Object.keys(watchProviders).length > 0 ? (
              renderWatchProviders()
            ) : (
              <p>No watch providers found.</p>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ResultModal;
