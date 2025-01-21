import { fieldType } from './types';

export const SubscriptionFormFields: fieldType[] = [
  {
    name: 'serviceName',
    title: 'Name',
    placeholder: 'Search',
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
];
