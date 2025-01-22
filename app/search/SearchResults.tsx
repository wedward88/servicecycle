import ResultCard from './components/ResultCard';
import { SearchResultItem } from './type';

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

type SearchResultsProps = {
  searchResults: SearchResultItem[];
};

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  console.log(searchResults);

  const renderItems = () => {
    const results = searchResults.map((result, idx) => {
      const isTV = result.media_type === 'tv';
      return (
        <li key={idx}>
          <ResultCard
            title={
              isTV ? result.original_name : result.original_title
            }
            imgUrl={`${baseImageURL}${result.poster_path}`}
            overview={result.overview}
            firstAirDate={result.first_air_date}
          />
          {}
        </li>
      );
    });

    return results;
  };

  const numColumns = Math.min(searchResults.length, 4); // Max of 4 columns
  const columnClasses = `grid-cols-${numColumns} md:grid-cols-${Math.min(
    searchResults.length,
    3
  )} lg:grid-cols-${Math.min(searchResults.length, 5)}`;
  return (
    <div className="w-full">
      <ul
        className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4`}
      >
        {renderItems()}
      </ul>
    </div>
  );
};

export default SearchResults;
