'use client';
import clsx from 'clsx';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useMainStore } from '@/app/store/providers/main-store-provider';
import { Subscription } from '@/app/subscriptions/types';

import { searchStreamingProvider } from '../../actions/subscription/actions';
import Error from './components/Error';
import InputList from './components/InputList';
import { fieldType, StreamingProvider } from './types';

type FormProps = {
  openText: string;
  submitText: string;
  formTitle: string;
  formFields: fieldType[];
  initialData?: Subscription;
};

const DEBOUNCE_DELAY = 500;

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

  const [formData, setFormData] =
    useState<Subscription>(initialState);

  const [dropDownData, setdropDownData] = useState<
    StreamingProvider[]
  >([]);

  const initialSearchVal = initialData
    ? initialData.streamingProvider!.name
    : '';
  const [searchValue, setSearchValue] = useState(initialSearchVal);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback(
    async (value: string) => {
      const result = await searchStreamingProvider(value);
      setdropDownData(result);
    },
    DEBOUNCE_DELAY
  );

  const { editSubscription, createSubscription, deleteSubscription } =
    useMainStore((state) => state);

  const clearAllValues = () => {
    setSearchValue('');
    setFormData(emptyForm);
  };

  const handleSubmit = async () => {
    if (initialData) {
      editSubscription(formData);
      toggleModal();
    } else {
      const result = await createSubscription(formData);

      if (result && result.error) {
        setErrorMsg(result.error);
        return;
      } else {
        clearAllValues();
        toggleModal();
      }
    }
  };

  const handleDelete = async () => {
    deleteSubscription(formData.id as number);
    toggleModal();
    clearAllValues();
  };

  const resultOnClick = (provider: StreamingProvider) => {
    setSearchValue(provider.name);
    setdropDownData([]);
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
      modal.showModal();
    } else if (modal && modal.open) {
      if (!errorMsg) {
        if (!initialData) {
          setSearchValue('');
        }
        modal.close();
        return;
      }
      if (!initialData) {
        setSearchValue('');
      }
      setErrorMsg(null);
      modal.close();
    }
  };

  return (
    <div>
      <button
        className={clsx(
          'p-2 hover:bg-base-300 rounded-lg',
          !initialData && 'underline decoration-2 decoration-accent'
        )}
        onClick={toggleModal}
      >
        {openText}
      </button>
      <dialog
        id={formId}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box flex flex-col items-center">
          <h3 className="font-bold text-lg">{formTitle}</h3>
          <button
            onClick={toggleModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <div className="modal-action">
            <form
              action={handleSubmit}
              className="flex flex-col space-y-5"
            >
              <InputList
                dropDownData={dropDownData}
                formData={formData}
                formFields={formFields}
                searchValue={searchValue}
                handleSearch={handleSearch}
                handleChange={handleChange}
                resultOnClick={resultOnClick}
              />
              {errorMsg ? (
                <Error message={errorMsg} />
              ) : (
                <div className="alert opacity-0 h-12" />
              )}
              <button type="submit" className="btn">
                {submitText}
              </button>
              {initialData && (
                <div
                  className="btn bg-red-400 text-slate-950 hover:bg-red-500"
                  onClick={handleDelete}
                >
                  Delete
                </div>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Form;
