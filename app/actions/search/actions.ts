'use server';

import {
  MediaTypeFilter,
  SearchResultItemType,
} from '@/app/watch/search/types';
import { isAppError } from '@/services/errors';
import {
  discoverByProvider,
  fetchWatchProviders as fetchWatchProvidersService,
  searchTitles,
} from '@/services/tmdb';

function toActionError(error: unknown): Error {
  if (isAppError(error)) {
    return new Error(error.message);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('Unknown error');
}

export async function fetchWatchProviders(type: string, id: number) {
  try {
    return await fetchWatchProvidersService(type, id);
  } catch (error) {
    throw toActionError(error);
  }
}

export async function fetchTMDBResults(
  query: string,
  mediaType: MediaTypeFilter = 'all'
): Promise<SearchResultItemType[]> {
  try {
    return await searchTitles(query, mediaType);
  } catch (error) {
    throw toActionError(error);
  }
}

export async function fetchTMDBByProvider(
  providerId: number,
  mediaType: MediaTypeFilter = 'all'
): Promise<SearchResultItemType[]> {
  try {
    return await discoverByProvider(providerId, mediaType);
  } catch (error) {
    throw toActionError(error);
  }
}
