import { motion } from 'motion/react';

import { WatchListItemType } from './type';

interface WatchListProps {
  watchList: WatchListItemType[] | null;
}
const WatchList = ({ watchList }: WatchListProps) => {
  const MotionTable = motion.table;
  const MotionTr = motion.tr;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, type: 'spring' },
    },
  };
  return (
    <div className="w-full">
      <h1 className="text-2xl pl-[8px]">Watch List</h1>
      {watchList && (
        <MotionTable
          className="table rounded-xl bg-base-200 mt-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {watchList.map((listItem, idx) => (
              <MotionTr
                key={idx}
                className="hover:bg-base-300 last:hover:rounded-2xl font-bold"
                variants={itemVariants}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold">
                        {listItem.originalName ||
                          listItem.originalTitle}
                      </div>
                    </div>
                  </div>
                </td>
              </MotionTr>
            ))}
          </tbody>
        </MotionTable>
      )}
    </div>
  );
};

export default WatchList;
