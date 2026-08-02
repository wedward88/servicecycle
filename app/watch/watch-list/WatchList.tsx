'use client';

import { Reorder } from 'motion/react';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import ResultModal from '../components/ResultModal';
import WatchListItem from './WatchListItem';

const WatchList = () => {
  const {
    userWatchList,
    reorderWatchList,
    persistWatchListOrder,
  } = useMainStore((state) => state);

  const noWatchList = !userWatchList || userWatchList.length === 0;

  const watchListItemClick = (id: number) => {
    const modal = document.getElementById(`watch-modal-${id}`);

    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  return (
    <section className="overflow-hidden border border-base-300 surface">
      <div className="flex items-center justify-between border-b border-base-300 px-4 py-3 xl:px-5 xl:py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-base-content xl:text-lg">
            Watch list
          </h2>
          {!noWatchList && (
            <p className="mt-0.5 text-xs text-secondary xl:text-sm">
              Drag to reorder
            </p>
          )}
        </div>
        <p className="text-xs text-secondary xl:text-sm">
          {noWatchList ? '0' : userWatchList.length}
        </p>
      </div>

      {noWatchList ? (
        <p className="px-4 py-5 text-sm text-secondary xl:px-5 xl:py-6 xl:text-base">
          Save titles from search to build your list.
        </p>
      ) : (
        <>
          <Reorder.Group
            axis="y"
            values={userWatchList}
            onReorder={reorderWatchList}
            className="max-h-[28rem] divide-y divide-base-300 overflow-y-auto no-scrollbar lg:max-h-[min(72vh,42rem)] 2xl:max-h-[min(78vh,52rem)]"
          >
            {userWatchList.map((listItem) => (
              <WatchListItem
                key={listItem.id}
                item={listItem}
                onClick={() => watchListItemClick(listItem.id)}
                onDragEnd={() => {
                  void persistWatchListOrder();
                }}
              />
            ))}
          </Reorder.Group>
          {userWatchList.map((listItem) => (
            <ResultModal
              key={`modal-${listItem.id}`}
              result={listItem}
              title={listItem.originalName || listItem.originalTitle}
              isTV={listItem.mediaType === 'tv'}
              isInWatchList={true}
              watchProviders={listItem.streamingProviders}
              watchModal={true}
            />
          ))}
        </>
      )}
    </section>
  );
};

export default WatchList;
