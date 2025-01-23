import clsx from 'clsx';

import ResultCard from './components/ResultCard';
import { SearchResultItem } from './type';

type SearchResultsProps = {
  searchResults: SearchResultItem[];
};

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const renderItems = () => {
    const results = searchResults.map((result, idx) => {
      return (
        <li key={idx}>
          <ResultCard result={result} />
        </li>
      );
    });

    return results;
  };

  const numColumns = Math.min(searchResults.length, 3); // Max of 3 columns

  return (
    <div className="w-full flex justify-center">
      <ul
        className={clsx(
          'grid gap-4 grid-cols-1', // Default 1 column for small screens
          numColumns === 2 && 'md:grid-cols-2',
          numColumns === 2 && 'lg:grid-cols-2',
          numColumns === 3 && 'md:grid-cols-3',
          numColumns === 3 && 'lg:grid-cols-3'
        )}
      >
        {renderItems()}
      </ul>
    </div>
  );
};

export default SearchResults;
