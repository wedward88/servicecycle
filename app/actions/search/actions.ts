'use server';

import {
  ProviderDictionary,
  WatchProvidersResponse,
} from '@/app/watch/components/types';

export async function fetchWatchProviders(type: string, id: number) {
  const TMDB_ENDPOINT = `${type}/${id}/watch/providers`;
  const URL = `${process.env.TMDB_URL}${TMDB_ENDPOINT}?api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const media = await response.json();

  const providerDictionary: ProviderDictionary = {};

  for (const key in media.results.US) {
    const providers =
      media.results.US[key as keyof WatchProvidersResponse];

    if (Array.isArray(providers)) {
      providers.forEach((provider) => {
        providerDictionary[provider.provider_id] = {
          provider_name: provider.provider_name,
          logo_path: provider.logo_path,
          id: provider.provider_id,
        };
      });
    }
  }

  return providerDictionary || {};
}

export async function fetchTMDBResults(query: string) {
  const TMDB_ENDPOINT = 'search/multi?query=';
  const URL = `${process.env.TMDB_URL}${TMDB_ENDPOINT}${query}&api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const results = await response.json();

  const final = results.results;

  return final.filter(
    (item: {
      media_type: string;
      poster_path: string | null;
      vote_average: number;
      original_language: string;
    }) =>
      item.media_type !== 'person' &&
      item.poster_path !== null &&
      item.vote_average !== 0 &&
      item.original_language === 'en'
  );
}
