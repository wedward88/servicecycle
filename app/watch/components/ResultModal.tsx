import clsx from 'clsx';
import { IoMdCloseCircleOutline } from 'react-icons/io';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import { SearchResultItemType } from '../type';
import AddToWatchList from './AddToWatchList';
import { ProviderDictionary } from './types';

type ResultModalProps = {
  result: SearchResultItemType;
  title: string;
  isTV: boolean;
  watchProviders: ProviderDictionary | null;
  isInWatchList: boolean;
};

const TMDB_IMAGE_URL = 'https://www.themoviedb.org/t/p/w500';

const ResultModal = ({
  result,
  title,
  watchProviders,
  isInWatchList,
}: ResultModalProps) => {
  const { subscriptionIds } = useMainStore((store) => store);
  const subscriptionSet = new Set(subscriptionIds);
  const sortProviderList = () => {
    const providerList = watchProviders
      ? Object.values(watchProviders)
      : [];

    providerList.sort((a, b) => {
      const aInSubscriptions = subscriptionSet.has(a.id);
      const bInSubscriptions = subscriptionSet.has(b.id);

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
                <img
                  src={`${TMDB_IMAGE_URL}${provider.logo_path}`}
                  alt={provider.provider_name}
                  title={provider.provider_name}
                  className={clsx(
                    'w-10 rounded-xl h-full',
                    !subscriptionSet.has(provider.id) && 'opacity-20'
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
        id={`modal-${result.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box p-0">
          <img
            src={`https://www.themoviedb.org/t/p/w500${result.poster_path}`}
            alt={title}
            className="w-full max-h-[60vh] object-top"
          />

          <form method="dialog">
            <button className="absolute top-0 right-0 p-2 text-4xl text-primary hover:text-accent">
              <IoMdCloseCircleOutline />
            </button>
          </form>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{title}</h3>
              <AddToWatchList
                className="text-4xl text-white hover:cursor-pointer"
                isInWatchList={isInWatchList}
                result={result}
              />
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
