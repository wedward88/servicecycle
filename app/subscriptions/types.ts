export type Subscription = {
  id: number | undefined; //can be null for new subscriptions
  userId: string;
  serviceName: string;
  description?: string | null;
  logo?: string | null;
  cost?: string | null;
  expirationDate?: Date | string | null;
};
