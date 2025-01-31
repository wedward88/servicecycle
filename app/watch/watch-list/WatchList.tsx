import { motion } from 'motion/react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa6';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';
import { RiDeleteBin6Fill } from 'react-icons/ri';

import { WatchListItemType } from './type';

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

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
    <div className="flex flex-col w-full items-center">
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
              <th className="text-xl md:text-2xl">Type</th>
              <th className="hidden md:block text-2xl">Poster</th>
              <th className="text-xl md:text-2xl">Name</th>
              {/* <th className="text-xl md:text-2xl">Subscribed</th> */}

              <th />
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
                  <div className="text-xl md:text-3xl">
                    {listItem.mediaType === 'tv' ? (
                      <ImTv />
                    ) : (
                      <MdLocalMovies />
                    )}
                  </div>
                </td>
                <td className="hidden md:flex">
                  <Image
                    src={`${baseImageURL}${listItem.posterPath}`}
                    alt={
                      listItem.originalTitle ||
                      listItem.originalName ||
                      'No title available.'
                    }
                    width={100}
                    height={100}
                    className="w-full max-h-[200px] object-cover rounded-3xl aspect-[3/2.2]"
                  />
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold text-xl md:text-2xl line-clamp-1">
                        {listItem.originalName ||
                          listItem.originalTitle}
                      </div>
                    </div>
                  </div>
                </td>
                {/* <td>
                  {subscriptions.has(listItem.) && (
                    <FaCheck className="text-2xl md:text-3xl" />
                  )}
                </td> */}
                <td className="text-2xl md:text-3xl">
                  <RiDeleteBin6Fill
                    className="hover:cursor-pointer hover:text-red-400"
                    onClick={() => handleRemoveClick(listItem)}
                  />
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
