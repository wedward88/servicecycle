export type fieldType = {
  name: string;
  title: string;
  placeholder?: string;
  optional?: boolean;
  type: 'text' | 'number' | 'date' | 'email';
  required: boolean;
};
