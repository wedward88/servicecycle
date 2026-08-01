'use client';

import clsx from 'clsx';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import { WatchListItemType } from '../watch-list/types';

interface AddToWatchListProps {
  result: WatchListItemType;
  isInWatchList: boolean;
  className?: string;
  compact?: boolean;
}

const AddToWatchList = ({
  result,
  isInWatchList,
  className,
  compact = false,
}: AddToWatchListProps) => {
  const { addToWatchList, removeFromWatchList } = useMainStore(
    (state) => state
  );

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isInWatchList) {
      removeFromWatchList(result.mediaId);
    } else {
      addToWatchList(result);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isInWatchList}
      aria-label={
        isInWatchList ? 'Remove from watch list' : 'Add to watch list'
      }
      className={clsx(
        'inline-flex items-center justify-center border font-medium transition-colors',
        compact
          ? 'gap-1 px-2 py-1 text-xs'
          : 'gap-1.5 px-2.5 py-1.5 text-sm',
        isInWatchList
          ? 'border-primary/40 bg-primary/10 text-primary hover:border-error/40 hover:bg-error/10 hover:text-error'
          : 'border-base-300 bg-base-100/95 text-base-content hover:border-primary/50 hover:text-primary',
        className
      )}
    >
      <span aria-hidden>{isInWatchList ? '✓' : '+'}</span>
      <span>
        {isInWatchList
          ? compact
            ? 'Saved'
            : 'On watch list'
          : 'Watch list'}
      </span>
    </button>
  );
};

export default AddToWatchList;
