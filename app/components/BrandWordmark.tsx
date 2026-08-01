import clsx from 'clsx';

import BrandMark from './BrandMark';

type BrandWordmarkProps = {
  className?: string;
  markClassName?: string;
};

/** “BingeQueue” with the play-Q mark standing in for the letter Q. */
const BrandWordmark = ({ className, markClassName }: BrandWordmarkProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-baseline whitespace-nowrap tracking-tight text-base-content',
        className
      )}
      aria-label="BingeQueue"
    >
      <span aria-hidden className="inline-flex items-baseline">
        Binge
        <BrandMark
          variant="wordmark"
          className={clsx(
            // Larger than the letterforms so the Q reads as the brand mark
            'ml-[0.05em] -mr-[0.06em] inline-block h-[0.95em] w-[0.95em] shrink-0 translate-y-[0.18em] text-primary',
            markClassName
          )}
        />
        ueue
      </span>
    </span>
  );
};

export default BrandWordmark;
