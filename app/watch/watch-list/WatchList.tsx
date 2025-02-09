'use client';
import { motion } from 'motion/react';

import { useMainStore } from '@/app/store/providers/main-store-provider';

import ResultModal from '../components/ResultModal';
import WatchListItem from './WatchListItem';

const WatchList = () => {
  const { userWatchList } = useMainStore((state) => state);

  const MotionTable = motion.table;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const noWatchList = !userWatchList || userWatchList.length === 0;

  const watchListItemClick = (id: number) => {
    const modal = document.getElementById(`watch-modal-${id}`);

    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  return (
    <section className="flex flex-col w-full md:w-[50vw] items-center">
      <h1 className="text-2xl">Watch List</h1>
      {noWatchList ? (
        <p className="bg-base-200 rounded-lg p-5">
          Search for TV shows or movies to add them to your watch
          list.
        </p>
      ) : (
        <div>
          <MotionTable
            className="table table-xs rounded-t-xl rounded-b-none bg-base-200 mt-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <thead>
              <tr>
                <th />
                <th className="hidden md:block text-2xl">Poster</th>
                <th className="text-xl md:text-2xl">Name</th>
                <th className="text-xl md:text-2xl"></th>
              </tr>
            </thead>
            <tbody>
              {userWatchList.map((listItem, idx) => (
                <WatchListItem
                  onClick={() => watchListItemClick(listItem.id)}
                  key={idx}
                  item={listItem}
                />
              ))}
            </tbody>
          </MotionTable>
          <p className=" w-full bg-base-200 rounded-b-xl p-5">
            Note: A check mark indicates an active subscription for
            that line item.
          </p>
          {userWatchList.map((listItem, idx) => (
            <ResultModal
              key={idx}
              result={listItem}
              title={listItem.originalName || listItem.originalTitle}
              isTV={listItem.mediaType === 'tv'}
              isInWatchList={true}
              watchProviders={listItem.streamingProviders}
              watchModal={true}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default WatchList;
