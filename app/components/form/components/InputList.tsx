'use client';
import StreamingProviderList from './StreamingProviderList';
import { fieldType, StreamingProvider } from '../types';
import { Subscription } from '@/app/subscriptions/types';

type InputListProps = {
  formData: Subscription;
  formFields: fieldType[];
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resultOnClick: (provider: StreamingProvider) => void;
  searchValue: string;
  dropDownData: StreamingProvider[];
};

const InputList = ({
  dropDownData,
  formData,
  formFields,
  searchValue,
  handleSearch,
  handleChange,
  resultOnClick,
}: InputListProps) => {
  const convertValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  };

  const renderInput = () => {
    const allInputs = formFields.map((field, idx) => {
      const isSearch = field.name === 'serviceName';
      return (
        <div key={idx}>
          <label className="input input-bordered flex items-center gap-2 text-sm text-gray-700">
            {field.title}
            <input
              type={field.type}
              name={field.name}
              onChange={isSearch ? handleSearch : handleChange}
              placeholder={field.placeholder}
              value={
                isSearch
                  ? searchValue
                  : convertValue(
                      formData[field.name as keyof Subscription]
                    )
              }
              step={0.01}
              className={`${
                isSearch && 'relative '
              }grow text-slate-400 text-lg`}
              required={field.required}
            />
            {field.optional && (
              <span className="badge badge-info">Optional</span>
            )}
          </label>
          {field.name === 'serviceName' &&
            dropDownData.length > 0 && (
              <StreamingProviderList
                itemOnClick={resultOnClick}
                list={dropDownData}
              />
            )}
        </div>
      );
    });

    return allInputs;
  };

  return (
    <div className="flex flex-col space-y-5">{renderInput()}</div>
  );
};

export default InputList;
