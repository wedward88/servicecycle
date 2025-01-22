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
    <ul className="scrollbar rounded-xl w-full max-h-[400%] mt-2 border border-base-300 overflow-y-auto absolute z-10">
      {list.map((provider, idx) => {
        return (
          <li
            key={idx}
            className="input join-item flex items-center hover:bg-base-300 cursor-pointer"
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
