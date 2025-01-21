export type fieldType = {
  name: string;
  title: string;
  placeholder?: string;
  optional?: boolean;
  type: 'text' | 'number' | 'date' | 'email';
  required: boolean;
};

export interface StreamingProvider {
  name: string;
  id: number;
  logoUrl: string;
  providerId: number;
}
