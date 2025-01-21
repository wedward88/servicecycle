import { StreamingProvider } from '../types';

type StreamingProviderListProps = {
  list: StreamingProvider[];
  itemOnClick: (provider: StreamingProvider) => void;
};

const StreamingProviderList = ({
  list,
  itemOnClick,
}: StreamingProviderListProps) => {
  return (
    <ul className="join join-vertical absolute mt-2 border border-gray-600">
      {list.map((provider, idx) => {
        return (
          <li
            key={idx}
            className="input join-item flex items-center hover:bg-gray-600 cursor-pointer"
            onClick={() => itemOnClick(provider)}
          >
            {provider.name}
          </li>
        );
      })}
    </ul>
  );
};

export default StreamingProviderList;
