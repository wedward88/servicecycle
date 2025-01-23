import SearchForm from './SearchForm';

const SearchPage = () => {
  return (
    <div className="flex flex-col items-start md:items-center lg:items-center space-y-10">
      <h1 className="text-2xl pl-[8px]">
        Search for shows or movies
      </h1>
      <SearchForm />
    </div>
  );
};

export default SearchPage;
