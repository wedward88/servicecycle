export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export type WatchProvidersResponse = {
  link: string;
  buy: WatchProvider[];
  flatrate: WatchProvider[];
  rent: WatchProvider[];
};

export type ProviderDictionary = {
  [providerId: number]: {
    provider_name: string;
    logo_path: string;
  };
};
