import Image from 'next/image';
import { ImTv } from 'react-icons/im';
import { MdLocalMovies } from 'react-icons/md';

const LOGO = 'https://www.themoviedb.org/t/p/w92';
const POSTER = 'https://www.themoviedb.org/t/p/w500';

const providers = [
  {
    name: 'Netflix',
    cost: '$19.99',
    logo: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  },
  {
    name: 'Max',
    cost: '$18.49',
    logo: '/jbe4gVSfRlbPTdESXhEKpornsfu.jpg',
  },
  {
    name: 'Hulu',
    cost: '$11.99',
    logo: '/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg',
  },
  {
    name: 'Apple TV+',
    cost: '$12.99',
    logo: '/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg',
  },
];

const searchResults = [
  {
    title: 'Severance',
    poster: '/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg',
    type: 'tv' as const,
    saved: true,
  },
  {
    title: 'The Night Agent',
    poster: '/4c5yUNcaff4W4aPrkXE6zr7papX.jpg',
    type: 'tv' as const,
    saved: false,
  },
  {
    title: 'The Dark Knight',
    poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    type: 'movie' as const,
    saved: false,
  },
];

const watchItems = [
  {
    name: 'Silo',
    type: 'tv' as const,
    active: true,
  },
  {
    name: 'The Dark Knight',
    type: 'movie' as const,
    active: false,
  },
  {
    name: 'Severance',
    type: 'tv' as const,
    active: true,
  },
  {
    name: 'Breaking Bad',
    type: 'tv' as const,
    active: true,
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function SubscriptionsMock() {
  return (
    <div className="grid w-full gap-0 overflow-hidden border border-base-300 lg:grid-cols-[1.5fr_1fr]">
      <div className="surface">
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-secondary">
            Name
          </p>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-secondary">
            Cost
          </p>
        </div>
        <ul className="divide-y divide-base-300">
          {providers.map((provider) => (
            <li
              key={provider.name}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src={`${LOGO}${provider.logo}`}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md object-cover"
                />
                <span className="truncate font-medium text-base-content">
                  {provider.name}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="tabular-nums text-secondary">
                  {provider.cost}
                </span>
                <span className="rounded-md px-3 py-2 text-sm font-medium text-secondary">
                  Edit
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-center border-t border-base-300 surface-muted px-6 py-8 md:px-8 lg:border-l lg:border-t-0">
        <p className="text-sm uppercase tracking-[0.14em] text-secondary">
          Total
        </p>
        <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-primary md:text-5xl">
          $63.46
        </p>
        <p className="mt-2 text-secondary">
          per month across {providers.length} services
        </p>
      </div>
    </div>
  );
}

export function SearchMock() {
  return (
    <div className="w-full overflow-hidden border border-base-300 surface">
      <div className="border-b border-base-300 px-5 py-4">
        <p className="font-display text-lg font-semibold text-base-content">
          Search for shows or movies
        </p>
        <div className="mt-3 flex items-center gap-2 border-b-2 border-primary pb-2">
          <SearchIcon />
          <span className="h-9 w-full text-base text-base-content">
            Search by title
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-secondary">
            Browse by your subscriptions
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {providers.slice(0, 3).map((provider, index) => (
              <li key={provider.name}>
                <span
                  className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-sm ${
                    index === 0
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-base-300 bg-base-100 text-base-content'
                  }`}
                >
                  <Image
                    src={`${LOGO}${provider.logo}`}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-md object-cover"
                  />
                  <span className="font-medium">{provider.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-3 text-sm text-secondary">
          Popular titles on Netflix
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {searchResults.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col overflow-hidden border border-base-300 bg-base-100"
            >
              <Image
                src={`${POSTER}${item.poster}`}
                alt=""
                width={300}
                height={450}
                className="aspect-[2/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 px-3 py-3">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-secondary">
                    <span className="text-primary" aria-hidden>
                      {item.type === 'tv' ? (
                        <ImTv />
                      ) : (
                        <MdLocalMovies />
                      )}
                    </span>
                    {item.type === 'tv' ? 'TV' : 'Movie'}
                  </span>
                  <p className="mt-1 line-clamp-2 min-h-[2.5rem] font-medium leading-snug text-base-content">
                    {item.title}
                  </p>
                </div>
                <span
                  className={`mt-auto inline-flex w-full items-center justify-center gap-1 border px-2 py-1 text-xs font-medium ${
                    item.saved
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-base-300 bg-base-100 text-base-content'
                  }`}
                >
                  <span aria-hidden>{item.saved ? '✓' : '+'}</span>
                  {item.saved ? 'Saved' : 'Watch list'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.25" />
      <circle cx="11" cy="4" r="1.25" />
      <circle cx="5" cy="8" r="1.25" />
      <circle cx="11" cy="8" r="1.25" />
      <circle cx="5" cy="12" r="1.25" />
      <circle cx="11" cy="12" r="1.25" />
    </svg>
  );
}

export function WatchListMock() {
  return (
    <div className="w-full overflow-hidden border border-base-300 surface">
      <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
        <div>
          <p className="font-display text-base font-semibold text-base-content">
            Watch list
          </p>
          <p className="mt-0.5 text-xs text-secondary">
            Drag to reorder
          </p>
        </div>
        <p className="text-xs text-secondary">{watchItems.length}</p>
      </div>
      <ul className="divide-y divide-base-300">
        {watchItems.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-2 px-2 py-2.5 sm:px-3"
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 px-1 py-1 text-secondary">
                <DragHandleIcon />
              </span>
              <span className="shrink-0 text-sm text-secondary">
                {item.type === 'tv' ? <ImTv /> : <MdLocalMovies />}
              </span>
              <span className="truncate text-sm font-medium text-base-content">
                {item.name}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {item.active ? (
                <span className="text-xs font-medium text-primary">
                  Available
                </span>
              ) : null}
              <span
                className="flex h-7 w-7 items-center justify-center text-lg leading-none text-secondary"
                aria-hidden
              >
                ×
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
