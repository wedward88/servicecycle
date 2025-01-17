'use client';

import { createSubscription } from '../actions/actions';

export type fieldType = {
  name: string;
  title: string;
  placeholder?: string;
  optional?: boolean;
  type: 'text' | 'number' | 'date' | 'email';
  required: boolean;
};

type FormProps = {
  openText: string;
  submitText: string;
  formTitle: string;
  formFields: fieldType[];
};

const Form = ({
  submitText,
  openText,
  formTitle,
  formFields,
}: FormProps) => {
  const toggleModal = () => {
    const modal = document.getElementById(
      'form_modal'
    ) as HTMLDialogElement | null;

    if (modal && !modal.open) {
      modal.showModal();
    } else if (modal && modal.open) {
      modal.close();
    }
  };

  return (
    <div>
      <button className="btn" onClick={toggleModal}>
        {openText}
      </button>
      <dialog
        id="form_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box flex flex-col items-center">
          <h3 className="font-bold text-lg">{formTitle}</h3>
          <div className="modal-action">
            <form
              action={createSubscription}
              className="flex flex-col space-y-5"
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
                    placeholder={field.placeholder}
                    step={0.01}
                    className="grow"
                    required={field.required}
                  />
                  {field.optional && (
                    <span className="badge badge-info">Optional</span>
                  )}
                </label>
              ))}
              <button
                onClick={toggleModal}
                type="submit"
                className="btn"
              >
                {submitText}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Form;
