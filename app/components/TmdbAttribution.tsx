import Link from 'next/link';

type TmdbAttributionProps = {
  className?: string;
};

const TmdbAttribution = ({ className }: TmdbAttributionProps) => {
  return (
    <section
      aria-labelledby="credits-heading"
      className={className}
    >
      <h2
        id="credits-heading"
        className="text-xs font-medium uppercase tracking-[0.14em] text-secondary"
      >
        Credits
      </h2>
      <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
          aria-label="The Movie Database (TMDB)"
        >
          {/* Official TMDB "Primary short (blue)" logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tmdb-logo.svg"
            alt="The Movie Database (TMDB)"
            width={120}
            height={16}
            className="h-4 w-auto"
          />
        </Link>
        <p className="max-w-xl text-sm leading-relaxed text-secondary">
          This product uses the TMDB API but is not endorsed or
          certified by TMDB.
        </p>
      </div>
    </section>
  );
};

export default TmdbAttribution;
