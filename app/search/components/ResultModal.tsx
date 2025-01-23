import { IoMdCloseCircleOutline } from 'react-icons/io';

import { SearchResultItem } from '../type';
import { ProviderDictionary, WatchProvidersResponse } from './types';

type ResultModalProps = {
  result: SearchResultItem;
  title: string;
  isTV: boolean;
  watchProviders: WatchProvidersResponse | null;
};

const TMDB_IMAGE_URL = 'https://www.themoviedb.org/t/p/w500';

const ResultModal = ({
  result,
  title,
  watchProviders,
}: ResultModalProps) => {
  const generateProviderDictionary = (): ProviderDictionary => {
    if (!watchProviders) {
      return {};
    }

    const providerDictionary: ProviderDictionary = {};

    // Iterate over the keys ('buy', 'flatrate', etc.) in the watchProviders object
    for (const key in watchProviders) {
      const providers =
        watchProviders[key as keyof WatchProvidersResponse];

      // Iterate over each provider in the array
      if (Array.isArray(providers)) {
        providers.forEach((provider) => {
          providerDictionary[provider.provider_id] = {
            provider_name: provider.provider_name,
            logo_path: provider.logo_path,
          };
        });
      }
    }

    return providerDictionary;
  };

  const renderWatchProviders = () => {
    const watchProviderDict = generateProviderDictionary();

    return (
      <div className="mt-2">
        <ul className="flex flex-row space-x-2">
          {Object.keys(watchProviderDict).map((providerId, idx) => {
            const provider = watchProviderDict[Number(providerId)];
            return (
              <li key={idx}>
                <img
                  src={`${TMDB_IMAGE_URL}${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-10 rounded-xl h-full"
                ></img>
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
            <button className="absolute top-0 right-0 p-2 text-5xl text-primary hover:text-accent">
              <IoMdCloseCircleOutline />
            </button>
          </form>
          <div className="p-5">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-2">{result.overview}</p>
            <h4 className="font-bold text-lg">Where to watch</h4>
            {watchProviders ? (
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
