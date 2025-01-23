'use client';
import clsx from 'clsx';
import { motion } from 'motion/react';

import ResultCard from './components/ResultCard';
import { SearchResultItem } from './type';

type SearchResultsProps = {
  searchResults: SearchResultItem[];
};
const MotionUl = motion.ul;
const MotionLi = motion.li;

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const renderItems = () => {
    const results = searchResults.map((result, idx) => {
      return (
        <MotionLi
          key={idx}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <ResultCard result={result} />
        </MotionLi>
      );
    });

    return results;
  };

  const numColumns = Math.min(searchResults.length, 3); // Max of 3 columns

  return (
    <div className="w-full flex justify-center">
      <MotionUl
        className={clsx(
          'grid gap-4 grid-cols-1', // Default 1 column for small screens
          numColumns === 2 && 'md:grid-cols-2',
          numColumns === 2 && 'lg:grid-cols-2',
          numColumns === 3 && 'md:grid-cols-3',
          numColumns === 3 && 'lg:grid-cols-3'
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderItems()}
      </MotionUl>
    </div>
  );
};

export default SearchResults;
