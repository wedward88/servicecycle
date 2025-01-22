import SearchForm from './SearchForm';

const SearchPage = () => {
  return (
    <div className="flex flex-col items-center space-y-10">
      <h1 className="text-3xl">Search for shows or movies</h1>
      <SearchForm />
    </div>
  );
};

export default SearchPage;
