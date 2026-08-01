const LoadingSkeleton = () => {
  return (
    <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden border border-base-300 bg-base-100"
        >
          <div className="skeleton aspect-[2/3] w-full rounded-none" />
          <div className="space-y-2 px-3 py-3">
            <div className="skeleton h-3 w-12 rounded-none" />
            <div className="skeleton h-4 w-20 rounded-none" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LoadingSkeleton;
