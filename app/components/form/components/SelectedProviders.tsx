'use client';

import Image from 'next/image';

import { COMMON_PROVIDER_LABELS } from '@/app/lib/commonProviders';

import { StreamingProvider } from '../types';

const baseImageURL = 'https://www.themoviedb.org/t/p/w92';

export type SelectedSubscription = {
  provider: StreamingProvider;
  cost: string;
  suggested: boolean;
};

type SelectedProvidersProps = {
  items: SelectedSubscription[];
  onRemove: (provider: StreamingProvider) => void;
  onCostChange: (providerId: number, cost: string) => void;
};

const SelectedProviders = ({
  items,
  onRemove,
  onCostChange,
}: SelectedProvidersProps) => {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-secondary">
          Selected ({items.length})
        </p>
        <p className="text-xs text-secondary/70">
          Suggested US prices — edit anytime
        </p>
      </div>
      <ul className="divide-y divide-base-300 border border-base-300">
        {items.map(({ provider, cost, suggested }) => {
          const label =
            COMMON_PROVIDER_LABELS[provider.providerId] ||
            provider.name;

          return (
            <li
              key={provider.id}
              className="flex items-center gap-2 px-3 py-2.5"
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
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-base-content">
                {label}
              </span>
              <label className="flex shrink-0 items-center gap-1 text-sm text-secondary">
                <span className="sr-only">Cost for {label}</span>
                <span aria-hidden>$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step={0.01}
                  min={0}
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) =>
                    onCostChange(provider.id, e.target.value)
                  }
                  className="w-20 border border-base-300 bg-base-100 px-2 py-1 text-right tabular-nums text-base-content outline-none focus:border-primary"
                />
              </label>
              {suggested && cost ? (
                <span className="sr-only">Suggested price</span>
              ) : null}
              <button
                type="button"
                onClick={() => onRemove(provider)}
                className="shrink-0 px-1 text-lg leading-none text-secondary transition-colors hover:text-error"
                aria-label={`Remove ${label}`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectedProviders;
