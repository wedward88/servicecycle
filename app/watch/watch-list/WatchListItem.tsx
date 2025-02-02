import { motion } from 'motion/react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa6';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';
import { RiDeleteBin6Fill } from 'react-icons/ri';

import { WatchListItemType } from './type';

interface WatchListItemProps {
  item: WatchListItemType;
  handleRemoveClick: (resultItem: WatchListItemType) => void;
  subscriptions: Set<number>;
}

const MotionTr = motion.tr;
const itemVariants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, type: 'spring' },
  },
};
const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

const WatchListItem = ({
  item,
  subscriptions,
  handleRemoveClick,
}: WatchListItemProps) => {
  const isSubscribed =
    item.streamingProviders &&
    item.streamingProviders.some((provider) =>
      subscriptions.has(provider.providerId)
    );

  return (
    <MotionTr
      className="relative font-bold hover:bg-base-300 hover:cursor-pointer"
      variants={itemVariants}
    >
      <td className="text-xl md:text-3xl">
        {item.mediaType === 'tv' ? <ImTv /> : <MdLocalMovies />}
      </td>
      <td className="hidden md:flex">
        <Image
          src={`${baseImageURL}${item.posterPath}`}
          alt={
            item.originalTitle ||
            item.originalName ||
            'No title available.'
          }
          style={{
            width: 'auto',
            height: 'auto',
          }}
          width={100}
          height={100}
          priority
          className="w-full max-h-[200px] object-cover rounded-xl aspect-[3/2.2]"
        />
      </td>
      <td>
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold text-xl line-clamp-1">
              {item.originalName || item.originalTitle}
            </div>
          </div>
        </div>
      </td>
      <td>{isSubscribed ? <FaCheck className="text-xl" /> : ''}</td>
      <td className="text-2xl md:text-3xl">
        <RiDeleteBin6Fill
          className="hover:cursor-pointer hover:text-red-400"
          onClick={() => handleRemoveClick(item)}
        />
      </td>
    </MotionTr>
  );
};

export default WatchListItem;
