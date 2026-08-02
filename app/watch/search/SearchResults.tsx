'use client';

import { motion, useReducedMotion } from 'motion/react';

import { fadeIn, transitionBase } from '@/app/lib/motion';
import { useMainStore } from '@/app/store/providers/main-store-provider';

import ResultCard from '../components/ResultCard';
import { SearchResultItemType } from './types';

type SearchResultsProps = {
  searchResults: SearchResultItemType[];
};

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const { watchListMediaIds } = useMainStore((state) => state);
  const watchListSet = new Set(watchListMediaIds);
  const reduceMotion = useReducedMotion();

  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <motion.ul
        key={searchResults.map((r) => r.id).join('-')}
        className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5 2xl:gap-6"
        variants={fadeIn}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        transition={reduceMotion ? { duration: 0 } : transitionBase}
      >
        {searchResults.map((result) => (
          <li key={`${result.media_type}-${result.id}`}>
            <ResultCard
              isInWatchList={watchListSet.has(result.id)}
              result={result}
            />
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SearchResults;
