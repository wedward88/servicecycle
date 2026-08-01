import { handleRouteError, jsonOk, requireApiUser } from '@/lib/api/http';
import { AppError } from '@/services/errors';
import { fetchWatchProviders } from '@/services/tmdb';

type RouteContext = {
  params: Promise<{ type: string; id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireApiUser();
    const { type, id } = await context.params;

    if (type !== 'movie' && type !== 'tv') {
      throw new AppError(400, 'type must be movie or tv.');
    }

    const mediaId = Number(id);
    if (!Number.isFinite(mediaId)) {
      throw new AppError(400, 'Invalid media id.');
    }

    const providers = await fetchWatchProviders(type, mediaId);
    return jsonOk({ providers });
  } catch (error) {
    return handleRouteError(error);
  }
}
