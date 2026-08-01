'use client';
import clsx from 'clsx';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { getSuggestedCost } from '@/app/lib/commonProviders';
import { useMainStore } from '@/app/store/providers/main-store-provider';
import { Subscription } from '@/app/subscriptions/types';

import {
  getCommonStreamingProviders,
  searchStreamingProvider,
} from '../../actions/subscription/actions';
import Error from './components/Error';
import InputList from './components/InputList';
import { SelectedSubscription } from './components/SelectedProviders';
import { fieldType, StreamingProvider } from './types';

type FormProps = {
  openText: string;
  submitText: string;
  formTitle: string;
  formFields: fieldType[];
  initialData?: Subscription;
};

const DEBOUNCE_DELAY = 500;

const toSelectedItem = (
  provider: StreamingProvider
): SelectedSubscription => {
  const suggested = getSuggestedCost(provider.providerId);
  return {
    provider,
    cost: suggested,
    suggested: Boolean(suggested),
  };
};

const Form = ({
  submitText,
  openText,
  formTitle,
  formFields,
  initialData,
}: FormProps) => {
  const emptyForm = {
    id: undefined,
    userId: '',
    streamingProviderId: undefined,
    streamingProvider: undefined,
    logo: '',
    cost: '',
  };
  const initialState: Subscription = initialData || emptyForm;
  const formId = initialData
    ? `${initialState.id}_edit_form`
    : 'new_sub_form';
  const isCreate = !initialData;

  const [formData, setFormData] =
    useState<Subscription>(initialState);

  const [dropDownData, setdropDownData] = useState<
    StreamingProvider[]
  >([]);

  const initialSearchVal = initialData
    ? initialData.streamingProvider!.name
    : '';
  const [searchValue, setSearchValue] = useState(initialSearchVal);
  const [selectedLogo, setSelectedLogo] = useState(
    initialData?.streamingProvider?.logoUrl || ''
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [commonProviders, setCommonProviders] = useState<
    StreamingProvider[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<
    SelectedSubscription[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebouncedCallback(
    async (value: string) => {
      const result = await searchStreamingProvider(value);
      setdropDownData(result);
    },
    DEBOUNCE_DELAY
  );

  const {
    editSubscription,
    createSubscription,
    deleteSubscription,
    subscriptionIds,
  } = useMainStore((state) => state);

  const availableCommonProviders = commonProviders.filter(
    (provider) => !subscriptionIds.includes(provider.providerId)
  );

  const filteredDropDownData = dropDownData.filter(
    (provider) =>
      !subscriptionIds.includes(provider.providerId) &&
      !selectedItems.some((item) => item.provider.id === provider.id)
  );

  const loadCommonProviders = async () => {
    if (!isCreate || commonProviders.length > 0) return;
    const providers = await getCommonStreamingProviders();
    setCommonProviders(providers);
  };

  const clearAllValues = () => {
    setSearchValue('');
    setSelectedLogo('');
    setSelectedItems([]);
    setdropDownData([]);
    setFormData(emptyForm);
    setErrorMsg(null);
  };

  const toggleProvider = (provider: StreamingProvider) => {
    setErrorMsg(null);
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) => item.provider.id === provider.id
      );
      if (exists) {
        return prev.filter((item) => item.provider.id !== provider.id);
      }
      return [...prev, toSelectedItem(provider)];
    });
  };

  const handleCostChange = (providerId: number, cost: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.provider.id === providerId
          ? { ...item, cost, suggested: false }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    if (initialData) {
      editSubscription(formData);
      toggleModal();
      return;
    }

    if (selectedItems.length === 0) {
      setErrorMsg('Select at least one service.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const failures: string[] = [];

    for (const item of selectedItems) {
      const result = await createSubscription({
        ...emptyForm,
        streamingProviderId: item.provider.id,
        cost: item.cost,
      });

      if (result && result.error) {
        failures.push(item.provider.name);
      }
    }

    setIsSubmitting(false);

    if (failures.length === selectedItems.length) {
      setErrorMsg('Could not add the selected services.');
      return;
    }

    if (failures.length > 0) {
      setErrorMsg(
        `Added some services, but failed for: ${failures.join(', ')}`
      );
      setSelectedItems((prev) =>
        prev.filter((item) => failures.includes(item.provider.name))
      );
      return;
    }

    clearAllValues();
    toggleModal();
  };

  const handleDelete = async () => {
    deleteSubscription(formData.id as number);
    toggleModal();
    clearAllValues();
  };

  const resultOnClick = (provider: StreamingProvider) => {
    setErrorMsg(null);
    setdropDownData([]);

    if (isCreate) {
      setSelectedItems((prev) => {
        if (prev.some((item) => item.provider.id === provider.id)) {
          return prev;
        }
        return [...prev, toSelectedItem(provider)];
      });
      setSearchValue('');
      setSelectedLogo('');
      return;
    }

    setSearchValue(provider.name);
    setSelectedLogo(provider.logoUrl || '');
    setFormData((prevData) => ({
      ...prevData,
      serviceName: provider.name,
      streamingProviderId: provider.id,
    }));
  };

  const handleSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setErrorMsg(null);
    setSearchValue(value);
    setSelectedLogo('');
    if (!isCreate) {
      setFormData((prevData) => ({
        ...prevData,
        streamingProviderId: undefined,
      }));
    }
    debouncedSearch(value);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleModal = () => {
    const modal = document.getElementById(
      formId
    ) as HTMLDialogElement | null;

    if (modal && !modal.open) {
      void loadCommonProviders();
      modal.showModal();
    } else if (modal && modal.open) {
      if (isCreate) {
        clearAllValues();
      }
      setErrorMsg(null);
      modal.close();
    }
  };

  const submitLabel =
    isCreate && selectedItems.length > 1
      ? `Add ${selectedItems.length} subscriptions`
      : isCreate && selectedItems.length === 1
        ? 'Add subscription'
        : submitText;

  return (
    <div>
      <button
        type="button"
        className={clsx(
          initialData
            ? 'rounded-md px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-base-200 hover:text-primary'
            : 'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium leading-none text-primary-content transition-colors hover:bg-primary/90'
        )}
        onClick={toggleModal}
      >
        {openText}
      </button>
      <dialog
        id={formId}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box w-full max-w-md rounded-none border border-base-300 surface">
          <div className="mb-6 flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-base-content">
              {isCreate ? 'Add subscriptions' : formTitle}
            </h3>
            <button
              type="button"
              onClick={toggleModal}
              className="btn btn-sm btn-circle btn-ghost"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form action={handleSubmit} className="flex flex-col gap-5">
            <InputList
              dropDownData={filteredDropDownData}
              formData={formData}
              formFields={formFields}
              searchValue={searchValue}
              selectedLogo={selectedLogo}
              handleSearch={handleSearch}
              handleChange={handleChange}
              resultOnClick={resultOnClick}
              commonProviders={
                isCreate ? availableCommonProviders : undefined
              }
              selectedItems={isCreate ? selectedItems : undefined}
              onToggleProvider={isCreate ? toggleProvider : undefined}
              onCostChange={isCreate ? handleCostChange : undefined}
              multiSelect={isCreate}
            />

            {errorMsg && <Error message={errorMsg} />}

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full normal-case"
              >
                {isSubmitting ? 'Adding…' : submitLabel}
              </button>
              {initialData && (
                <button
                  type="button"
                  className="btn w-full border-error/40 bg-transparent normal-case text-error hover:border-error hover:bg-error hover:text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" onClick={toggleModal}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default Form;
