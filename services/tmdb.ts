import { filterStandaloneProviders } from '@/app/lib/streamingProviders';
import {
  ProviderDictionary,
  WatchProvidersResponse,
} from '@/app/watch/components/types';
import {
  MediaTypeFilter,
  SearchResultItemType,
} from '@/app/watch/search/types';

import { AppError } from './errors';

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

function requireTmdbConfig() {
  const apiKey = process.env.TMDB_API_KEY;
  const baseUrl = process.env.TMDB_URL;
  if (!apiKey || !baseUrl) {
    throw new AppError(
      500,
      'TMDB is not configured. Set TMDB_API_KEY and TMDB_URL in .env, then restart the dev server.'
    );
  }
  return { apiKey, baseUrl };
}

async function readTmdbError(response: Response) {
  try {
    const body = await response.text();
    return body.slice(0, 200);
  } catch {
    return '';
  }
}

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

export async function fetchWatchProviders(type: string, id: number) {
  const { apiKey, baseUrl } = requireTmdbConfig();
  const endpoint = `${type}/${id}/watch/providers`;
  const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const details = await readTmdbError(response);
    throw new AppError(
      response.status,
      `Error fetching TMDB ${endpoint} (${response.status} ${response.statusText})${details ? `: ${details}` : ''}`
    );
  }

  const media = await response.json();
  const providerDictionary: ProviderDictionary = {};

  for (const key in media.results?.US ?? {}) {
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

  const filtered = filterStandaloneProviders(
    Object.values(providerDictionary).map((provider) => ({
      name: provider.provider_name,
      providerId: provider.id,
      provider,
    }))
  );

  return Object.fromEntries(
    filtered.map(({ provider }) => [provider.id, provider])
  ) as ProviderDictionary;
}

export async function searchTitles(
  query: string,
  mediaType: MediaTypeFilter = 'all'
): Promise<SearchResultItemType[]> {
  const { apiKey, baseUrl } = requireTmdbConfig();
  const endpoint =
    mediaType === 'movie'
      ? 'search/movie'
      : mediaType === 'tv'
        ? 'search/tv'
        : 'search/multi';

  const url = `${baseUrl}${endpoint}?query=${encodeURIComponent(query)}&api_key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const details = await readTmdbError(response);
    throw new AppError(
      response.status,
      `Error fetching TMDB ${endpoint} (${response.status} ${response.statusText})${details ? `: ${details}` : ''}`
    );
  }

  const results = await response.json();
  const final = results.results as TMDBListItem[];

  return final
    .filter(isSearchableResult)
    .map((item) =>
      normalizeSearchItem(
        item,
        mediaType === 'all' ? undefined : mediaType
      )
    );
}

export async function discoverByProvider(
  providerId: number,
  mediaType: MediaTypeFilter = 'all'
): Promise<SearchResultItemType[]> {
  const { apiKey, baseUrl } = requireTmdbConfig();
  const common = `api_key=${apiKey}&watch_region=US&with_watch_providers=${providerId}&with_watch_monetization_types=flatrate&sort_by=popularity.desc&language=en-US`;
  const includeMovies = mediaType !== 'tv';
  const includeTv = mediaType !== 'movie';

  const [moviesRes, tvRes] = await Promise.all([
    includeMovies
      ? fetch(
          `${baseUrl}discover/movie?${common}&with_original_language=en`
        )
      : Promise.resolve(null),
    includeTv
      ? fetch(
          `${baseUrl}discover/tv?${common}&with_original_language=en`
        )
      : Promise.resolve(null),
  ]);

  if (moviesRes && !moviesRes.ok) {
    const details = await readTmdbError(moviesRes);
    throw new AppError(
      moviesRes.status,
      `Error fetching TMDB discover/movie (${moviesRes.status} ${moviesRes.statusText})${details ? `: ${details}` : ''}`
    );
  }

  if (tvRes && !tvRes.ok) {
    const details = await readTmdbError(tvRes);
    throw new AppError(
      tvRes.status,
      `Error fetching TMDB discover/tv (${tvRes.status} ${tvRes.statusText})${details ? `: ${details}` : ''}`
    );
  }

  const [movies, tv] = await Promise.all([
    moviesRes ? moviesRes.json() : Promise.resolve({ results: [] }),
    tvRes ? tvRes.json() : Promise.resolve({ results: [] }),
  ]);

  const movieResults = ((movies.results || []) as TMDBListItem[])
    .filter((item) => item.poster_path && item.vote_average !== 0)
    .map((item) => normalizeSearchItem(item, 'movie'));

  const tvResults = ((tv.results || []) as TMDBListItem[])
    .filter((item) => item.poster_path && item.vote_average !== 0)
    .map((item) => normalizeSearchItem(item, 'tv'));

  return [...tvResults, ...movieResults].slice(0, 24);
}
