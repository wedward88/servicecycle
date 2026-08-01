import Image from 'next/image';

import { StreamingProvider } from '../types';

const baseImageURL = 'https://www.themoviedb.org/t/p/w92';

type StreamingProviderListProps = {
  list: StreamingProvider[];
  itemOnClick: (provider: StreamingProvider) => void;
};

const StreamingProviderList = ({
  list,
  itemOnClick,
}: StreamingProviderListProps) => {
  return (
    <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto border border-base-300 surface shadow-sm">
      {list.map((provider) => (
        <li key={provider.id}>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-base-content transition-colors hover:bg-base-200"
            onClick={() => itemOnClick(provider)}
          >
            {provider.logoUrl ? (
              <Image
                src={`${baseImageURL}${provider.logoUrl}`}
                alt=""
                width={36}
                height={36}
                className="h-8 w-8 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span className="h-8 w-8 shrink-0 rounded-md bg-base-300" />
            )}
            <span className="font-medium">{provider.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default StreamingProviderList;
