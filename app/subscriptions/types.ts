export type Subscription = {
  id: number | undefined; //can be null for new subscriptions
  userId: string;
  cost?: string | null;
  streamingProviderId: number | undefined;
  streamingProvider:
    | {
        id: number;
        name: string;
        logoUrl: string;
        providerId: number;
      }
    | undefined;
};

export type DBSubscription = {
  id: number;
  userId: string;
  cost?: string | null;
  streamingProviderId: number | undefined;
  streamingProvider:
    | {
        id: number;
        name: string;
        logoUrl: string;
        providerId: number;
      }
    | undefined;
};
