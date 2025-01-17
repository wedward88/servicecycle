import { fieldType } from './types';

export const SubscriptionFormFields: fieldType[] = [
  {
    name: 'serviceName',
    title: 'Service Name',
    placeholder: 'Netflix',
    optional: false,
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    title: 'Description',
    placeholder: 'Streaming Service',
    optional: true,
    type: 'text',
    required: false,
  },
  {
    name: 'cost',
    title: 'Cost',
    placeholder: '0.00',
    optional: true,
    type: 'number',
    required: false,
  },
  {
    name: 'expirationDate',
    title: 'Expiration Date',
    placeholder: '',
    optional: true,
    type: 'date',
    required: false,
  },
];
