import { motion } from 'motion/react';

import { WatchListItemType } from './type';
import WatchListItem from './WatchListItem';

interface WatchListProps {
  watchList: WatchListItemType[] | null;
  handleRemoveClick: (resultItem: WatchListItemType) => void;
  subscriptions: Set<number>;
}
const WatchList = ({
  watchList,
  handleRemoveClick,
  subscriptions,
}: WatchListProps) => {
  const MotionTable = motion.table;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const noWatchList = !watchList || watchList.length === 0;

  return (
    <div className="flex flex-col w-full md:w-[50vw] items-center">
      <h1 className="text-2xl">Watch List</h1>
      {noWatchList ? (
        <p className="bg-base-200 rounded-lg p-5">
          Search for TV shows or movies to add them to your watch
          list.
        </p>
      ) : (
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
            {watchList.map((listItem, idx) => (
              <WatchListItem
                key={idx}
                item={listItem}
                handleRemoveClick={handleRemoveClick}
                subscriptions={subscriptions}
              />
            ))}
          </tbody>
        </MotionTable>
      )}
      <p className=" w-full bg-base-200 rounded-b-xl p-5">
        Note: A check mark indicates an active subscription for that
        line item.
      </p>
    </div>
  );
};

export default WatchList;
