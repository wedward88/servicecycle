'use client';

import clsx from 'clsx';
import Image from 'next/image';

import { COMMON_PROVIDER_LABELS } from '@/app/lib/commonProviders';

import { StreamingProvider } from '../types';

const baseImageURL = 'https://www.themoviedb.org/t/p/w92';

type CommonProvidersProps = {
  providers: StreamingProvider[];
  selectedIds: number[];
  onToggle: (provider: StreamingProvider) => void;
};

const CommonProviders = ({
  providers,
  selectedIds,
  onToggle,
}: CommonProvidersProps) => {
  if (providers.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-secondary">
        Popular
        <span className="ml-1 font-normal text-secondary/70">
          (select one or more)
        </span>
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {providers.map((provider) => {
          const selected = selectedIds.includes(provider.id);
          const label =
            COMMON_PROVIDER_LABELS[provider.providerId] ||
            provider.name;

          return (
            <li key={provider.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onToggle(provider)}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-sm transition-colors',
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-base-300 bg-base-100 text-base-content hover:border-primary/40 hover:bg-base-200'
                )}
              >
                {provider.logoUrl ? (
                  <Image
                    src={`${baseImageURL}${provider.logoUrl}`}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="h-7 w-7 shrink-0 rounded-md bg-base-300" />
                )}
                <span className="min-w-0 flex-1 truncate font-medium">
                  {label}
                </span>
                {selected && (
                  <span
                    className="shrink-0 text-primary"
                    aria-hidden
                  >
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CommonProviders;
