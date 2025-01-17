'use client';
import { useState } from 'react';

import {
  createSubscription,
  editSubscription,
  deleteSubscription,
} from '../../actions/actions';
import { fieldType } from './types';
import { Subscription } from '@/app/subscriptions/types';

type FormProps = {
  openText: string;
  submitText: string;
  formTitle: string;
  formFields: fieldType[];
  initialData?: Subscription;
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
    serviceName: '',
    description: '',
    logo: '',
    cost: '',
    expirationDate: '',
  };
  const initialState: Subscription = initialData || emptyForm;
  const formId = initialData
    ? `${initialState.id}_edit_form`
    : 'new_sub_form';

  const [formData, setFormData] =
    useState<Subscription>(initialState);

  const handleSubmit = async () => {
    if (initialData) {
      editSubscription(formData);
    } else {
      createSubscription(formData);
      setFormData(emptyForm);
    }
  };

  const handleDelete = async () => {
    deleteSubscription(formData.id as number);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      modal.close();
    }
  };

  const convertValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  };

  return (
    <div>
      <button className="btn" onClick={toggleModal}>
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
              onSubmit={toggleModal}
            >
              {formFields.map((field, idx) => (
                <label
                  key={idx}
                  className="input input-bordered flex items-center gap-2"
                >
                  {field.title}
                  <input
                    type={field.type}
                    name={field.name}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    value={convertValue(
                      formData[field.name as keyof Subscription]
                    )}
                    step={0.01}
                    className="grow"
                    required={field.required}
                  />
                  {field.optional && (
                    <span className="badge badge-info">Optional</span>
                  )}
                </label>
              ))}
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
