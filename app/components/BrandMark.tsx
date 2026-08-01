type BrandMarkProps = {
  className?: string;
  /** Tighter crop + lighter stroke for use as the Q in “BingeQueue”. */
  variant?: 'default' | 'wordmark';
};

/** BingeQueue mark: Q with a play triangle inside. Uses currentColor. */
const BrandMark = ({ className, variant = 'default' }: BrandMarkProps) => {
  const isWordmark = variant === 'wordmark';

  return (
    <svg
      viewBox={isWordmark ? '8 8 46 46' : '0 0 64 64'}
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
        strokeWidth={isWordmark ? 5.5 : 5}
      />
      <path
        d="M41.5 41.5 L52 52"
        stroke="currentColor"
        strokeWidth={isWordmark ? 5.5 : 5}
        strokeLinecap="round"
      />
      <path
        d={
          isWordmark
            ? 'M25 22 L25 36 L36.5 29 Z'
            : 'M23.5 20.5 L23.5 37.5 L38.5 29 Z'
        }
        fill="currentColor"
      />
    </svg>
  );
};

export default BrandMark;
