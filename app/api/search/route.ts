import { handleRouteError, jsonOk } from '@/lib/api/http';
import { AppError } from '@/services/errors';
import {
  discoverByProvider,
  searchTitles,
} from '@/services/tmdb';
import { MediaTypeFilter } from '@/app/watch/search/types';

function parseMediaType(value: string | null): MediaTypeFilter {
  if (value === 'movie' || value === 'tv' || value === 'all') {
    return value;
  }
  return 'all';
}

/** Public — TMDB proxy for search/discover (no user data). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const providerIdParam = searchParams.get('providerId');
    const mediaType = parseMediaType(searchParams.get('mediaType'));

    if (providerIdParam) {
      const providerId = Number(providerIdParam);
      if (!Number.isFinite(providerId)) {
        throw new AppError(400, 'Invalid providerId.');
      }
      const results = await discoverByProvider(providerId, mediaType);
      return jsonOk({ results });
    }

    if (!q) {
      throw new AppError(400, 'Query parameter q or providerId is required.');
    }

    const results = await searchTitles(q, mediaType);
    return jsonOk({ results });
  } catch (error) {
    return handleRouteError(error);
  }
}
