import clsx from 'clsx';
import { IoMdCloseCircleOutline } from 'react-icons/io';

import { SearchResultItem } from '../type';
import AddToWatchList from './AddToWatchList';
import { ProviderDictionary, WatchProvidersResponse } from './types';

type ResultModalProps = {
  result: SearchResultItem;
  title: string;
  isTV: boolean;
  watchProviders: WatchProvidersResponse | null;
  subscriptions: Set<number>;
  handleAddClick: (resultItem: SearchResultItem) => void;
  handleRemoveClick: (resultItem: SearchResultItem) => void;
  isInWatchList: Boolean;
};

const TMDB_IMAGE_URL = 'https://www.themoviedb.org/t/p/w500';

const ResultModal = ({
  result,
  title,
  watchProviders,
  subscriptions,
  handleAddClick,
  handleRemoveClick,
  isInWatchList,
}: ResultModalProps) => {
  const generateProviderDictionary = (): ProviderDictionary => {
    if (!watchProviders) {
      return {};
    }

    const providerDictionary: ProviderDictionary = {};

    for (const key in watchProviders) {
      const providers =
        watchProviders[key as keyof WatchProvidersResponse];

      if (Array.isArray(providers)) {
        providers.forEach((provider) => {
          providerDictionary[provider.provider_id] = {
            provider_name: provider.provider_name,
            logo_path: provider.logo_path,
            id: provider.provider_id,
          };
        });
      }
    }

    return providerDictionary;
  };

  const sortProviderList = () => {
    const providerList = Object.values(generateProviderDictionary());

    providerList.sort((a, b) => {
      const aInSubscriptions = subscriptions.has(a.id);
      const bInSubscriptions = subscriptions.has(b.id);

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
                    !subscriptions.has(provider.id) && 'opacity-20'
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
                isInWatchList={isInWatchList}
                onAdd={() => handleAddClick(result)}
                onRemove={() => handleRemoveClick(result)}
                className="text-4xl text-white hover:cursor-pointer"
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
