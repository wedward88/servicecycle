'use server';

import {
  ProviderDictionary,
  WatchProvidersResponse,
} from '@/app/watch/components/types';
import { SearchResultItemType } from '@/app/watch/search/types';

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

type TMDBListItem = {
  id: number;
  media_type?: string;
  original_name?: string;
  original_title?: string;
  name?: string;
  title?: string;
  overview?: string;
  poster_path: string | null;
  vote_average?: number;
  original_language?: string;
};

function isSearchableResult(item: TMDBListItem) {
  return (
    item.media_type !== 'person' &&
    item.poster_path !== null &&
    item.vote_average !== 0 &&
    item.original_language === 'en'
  );
}

function normalizeSearchItem(
  item: TMDBListItem,
  mediaType?: 'movie' | 'tv'
): SearchResultItemType {
  const resolvedType =
    mediaType ||
    (item.media_type === 'tv' || item.media_type === 'movie'
      ? item.media_type
      : 'movie');

  return {
    id: item.id,
    media_type: resolvedType,
    original_name: item.original_name || item.name || '',
    original_title: item.original_title || item.title || '',
    overview: item.overview || '',
    poster_path: item.poster_path || '',
    watchListId: 0,
  };
}

export async function fetchTMDBResults(
  query: string
): Promise<SearchResultItemType[]> {
  const TMDB_ENDPOINT = 'search/multi?query=';
  const URL = `${process.env.TMDB_URL}${TMDB_ENDPOINT}${encodeURIComponent(query)}&api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const results = await response.json();
  const final = results.results as TMDBListItem[];

  return final
    .filter(isSearchableResult)
    .map((item) => normalizeSearchItem(item));
}

export async function fetchTMDBByProvider(
  providerId: number
): Promise<SearchResultItemType[]> {
  const common = `api_key=${process.env.TMDB_API_KEY}&watch_region=US&with_watch_providers=${providerId}&with_watch_monetization_types=flatrate&sort_by=popularity.desc&language=en-US`;

  const [moviesRes, tvRes] = await Promise.all([
    fetch(
      `${process.env.TMDB_URL}discover/movie?${common}&with_original_language=en`
    ),
    fetch(
      `${process.env.TMDB_URL}discover/tv?${common}&with_original_language=en`
    ),
  ]);

  if (!moviesRes.ok || !tvRes.ok) {
    throw new Error('Error fetching provider catalog from TMDB.');
  }

  const [movies, tv] = await Promise.all([
    moviesRes.json(),
    tvRes.json(),
  ]);

  const movieResults = ((movies.results || []) as TMDBListItem[])
    .filter((item) => item.poster_path && item.vote_average !== 0)
    .map((item) => normalizeSearchItem(item, 'movie'));

  const tvResults = ((tv.results || []) as TMDBListItem[])
    .filter((item) => item.poster_path && item.vote_average !== 0)
    .map((item) => normalizeSearchItem(item, 'tv'));

  return [...tvResults, ...movieResults].slice(0, 24);
}
