'use client';

import { Reorder, useDragControls } from 'motion/react';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import { WatchListItemType } from './types';

interface WatchListItemProps {
  item: WatchListItemType;
  onClick: () => void;
  onDragEnd: () => void;
}

const WatchListItem = ({
  item,
  onClick,
  onDragEnd,
}: WatchListItemProps) => {
  const { subscriptionIds, removeFromWatchList } = useMainStore(
    (state) => state
  );
  const controls = useDragControls();
  const subscriptionSet = new Set(subscriptionIds);
  const isAvailable =
    item.streamingProviders &&
    item.streamingProviders.some((provider) =>
      subscriptionSet.has(provider.providerId)
    );

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="flex items-center justify-between gap-2 surface px-2 py-2.5 sm:px-3 xl:gap-3 xl:px-4 xl:py-3.5"
    >
      <div className="flex min-w-0 items-center gap-1.5 xl:gap-2">
        <button
          type="button"
          aria-label={`Drag to reorder ${item.originalName || item.originalTitle}`}
          className="shrink-0 cursor-grab touch-none px-1 py-1 text-secondary transition-colors hover:text-base-content active:cursor-grabbing"
          onPointerDown={(event) => controls.start(event)}
        >
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 xl:h-5 xl:w-5"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="5" cy="4" r="1.25" />
            <circle cx="11" cy="4" r="1.25" />
            <circle cx="5" cy="8" r="1.25" />
            <circle cx="11" cy="8" r="1.25" />
            <circle cx="5" cy="12" r="1.25" />
            <circle cx="11" cy="12" r="1.25" />
          </svg>
        </button>
        <span className="shrink-0 text-sm text-secondary xl:text-base">
          {item.mediaType === 'tv' ? <ImTv /> : <MdLocalMovies />}
        </span>
        <button
          type="button"
          className="min-w-0 truncate text-left text-sm font-medium text-base-content hover:text-primary xl:text-base"
          onClick={onClick}
        >
          {item.originalName || item.originalTitle}
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-2 xl:gap-2.5">
        {isAvailable && (
          <span className="text-xs font-medium text-primary xl:text-sm">
            Available
          </span>
        )}
        <button
          type="button"
          aria-label="Remove from watch list"
          className="flex h-7 w-7 items-center justify-center text-lg leading-none text-secondary transition-colors hover:bg-base-200 hover:text-error xl:h-8 xl:w-8 xl:text-xl"
          onClick={() => removeFromWatchList(item.mediaId)}
        >
          ×
        </button>
      </div>
    </Reorder.Item>
  );
};

export default WatchListItem;
