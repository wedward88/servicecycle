'use client';
import Image from 'next/image';

import { Subscription } from '@/app/subscriptions/types';

import { fieldType, StreamingProvider } from '../types';
import CommonProviders from './CommonProviders';
import SelectedProviders, {
  SelectedSubscription,
} from './SelectedProviders';
import StreamingProviderList from './StreamingProviderList';

const baseImageURL = 'https://www.themoviedb.org/t/p/w92';

type InputListProps = {
  formData: Subscription;
  formFields: fieldType[];
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resultOnClick: (provider: StreamingProvider) => void;
  searchValue: string;
  selectedLogo?: string;
  dropDownData: StreamingProvider[];
  commonProviders?: StreamingProvider[];
  selectedItems?: SelectedSubscription[];
  onToggleProvider?: (provider: StreamingProvider) => void;
  onCostChange?: (providerId: number, cost: string) => void;
  multiSelect?: boolean;
};

const InputList = ({
  dropDownData,
  formData,
  formFields,
  searchValue,
  selectedLogo,
  handleSearch,
  handleChange,
  resultOnClick,
  commonProviders = [],
  selectedItems = [],
  onToggleProvider,
  onCostChange,
  multiSelect = false,
}: InputListProps) => {
  const convertValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value.toString();
    }
    return '';
  };

  const showCommon = multiSelect && commonProviders.length > 0;
  const hasSelection =
    selectedItems.length > 0 || Boolean(formData.streamingProviderId);

  return (
    <div className="flex w-full flex-col gap-4">
      {showCommon && onToggleProvider && (
        <CommonProviders
          providers={commonProviders}
          selectedIds={selectedItems.map((item) => item.provider.id)}
          onToggle={onToggleProvider}
        />
      )}

      {multiSelect && onToggleProvider && onCostChange && (
        <SelectedProviders
          items={selectedItems}
          onRemove={onToggleProvider}
          onCostChange={onCostChange}
        />
      )}

      {formFields.map((field) => {
        const isSearch = field.name === 'serviceName';
        const isCost = field.name === 'cost';

        // Per-row costs replace the single cost field in create/multi mode
        if (isCost && multiSelect) return null;

        return (
          <div key={field.name} className="relative w-full">
            <label className="mb-1.5 block text-sm font-medium text-secondary">
              {isSearch && showCommon ? 'Or search' : field.title}
              {field.optional && (
                <span className="ml-1 font-normal text-secondary/70">
                  (optional)
                </span>
              )}
            </label>
            <div className="flex items-center gap-2 border border-base-300 bg-base-100 px-3 py-2 transition-colors focus-within:border-primary">
              {isSearch && !multiSelect && selectedLogo ? (
                <Image
                  src={`${baseImageURL}${selectedLogo}`}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-md object-cover"
                />
              ) : null}
              <input
                type={field.type}
                name={field.name}
                onChange={isSearch ? handleSearch : handleChange}
                placeholder={
                  isSearch && showCommon
                    ? 'Search all services'
                    : field.placeholder
                }
                value={
                  isSearch
                    ? searchValue
                    : convertValue(
                        formData[field.name as keyof Subscription]
                      )
                }
                step={field.type === 'number' ? 0.01 : undefined}
                className="w-full bg-transparent text-base text-base-content outline-none placeholder:text-secondary/50"
                required={field.required && !hasSelection}
                autoComplete="off"
              />
            </div>
            {isSearch && dropDownData.length > 0 && (
              <StreamingProviderList
                itemOnClick={resultOnClick}
                list={dropDownData}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InputList;
