type BrandMarkProps = {
  className?: string;
};

/** BingeQueue mark: Q with a play triangle inside. Uses currentColor. */
const BrandMark = ({ className }: BrandMarkProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle
        cx="29"
        cy="29"
        r="18"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        d="M41.5 41.5 L52 52"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M23.5 20.5 L23.5 37.5 L38.5 29 Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default BrandMark;
