const LoadingSkeleton = () => {
  return (
    <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5 2xl:gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden border border-base-300 bg-base-100"
        >
          <div className="skeleton aspect-[2/3] w-full rounded-none" />
          <div className="space-y-2 px-3 py-3 sm:px-3.5 sm:py-3.5 xl:px-4 xl:py-4">
            <div className="skeleton h-3 w-12 rounded-none xl:h-3.5" />
            <div className="skeleton h-4 w-20 rounded-none xl:h-5 xl:w-28" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LoadingSkeleton;
