'use client';
import { CiCircleCheck, CiCirclePlus } from 'react-icons/ci';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import { WatchListItemType } from '../watch-list/types';

interface AddToWatchListProps {
  result: WatchListItemType;
  isInWatchList: boolean;
  className: string;
}

const AddToWatchList = ({
  result,
  isInWatchList,
  className,
}: AddToWatchListProps) => {
  const { addToWatchList, removeFromWatchList } = useMainStore(
    (state) => state
  );

  return (
    <div className={className}>
      {isInWatchList ? (
        <CiCircleCheck
          onClick={() => removeFromWatchList(result.id)}
        />
      ) : (
        <CiCirclePlus onClick={() => addToWatchList(result)} />
      )}
    </div>
  );
};

export default AddToWatchList;
