import { SearchResultItem } from '../type';
import { IoMdCloseCircleOutline } from 'react-icons/io';

type ResultModalProps = {
  result: SearchResultItem;
  title: string;
  isTV: boolean;
  watchProviders: any;
};

const TMDB_IMAGE_URL = 'https://www.themoviedb.org/t/p/w500';

const ResultModal = ({
  result,
  title,
  watchProviders,
}: ResultModalProps) => {
  const buildWatchProviderDict = () => {
    const providerDict: { [key: string]: any } = {};
    if (watchProviders) {
      for (const type in watchProviders) {
        if (typeof watchProviders[type] === 'object') {
          for (const provider in watchProviders[type]) {
            providerDict[provider] = watchProviders[type][provider];
          }
        }
      }
    }
    return providerDict;
  };

  const renderWatchProviders = () => {
    const watchProviderDict = buildWatchProviderDict();
    return (
      <div className="mt-2">
        <ul className="flex flex-row space-x-2">
          {Object.keys(watchProviderDict).map((provider, idx) => {
            return (
              <li key={idx}>
                <a href={watchProviderDict[provider].link}>
                  <img
                    src={`${TMDB_IMAGE_URL}${watchProviderDict[provider].logo_path}`}
                    alt={provider}
                    className="w-10 rounded-xl"
                  ></img>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog
        id={`modal-${result.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box p-0">
          <img
            src={`https://www.themoviedb.org/t/p/w500${result.poster_path}`}
            alt={title}
            className="w-full max-h-[50vh] object-top"
          />
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="absolute top-0 right-0 p-2 text-5xl text-primary hover:text-accent">
              <IoMdCloseCircleOutline />
            </button>
          </form>
          <div className="p-5">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-2">{result.overview}</p>
            <h4 className="font-bold text-lg">Watch Providers</h4>
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
