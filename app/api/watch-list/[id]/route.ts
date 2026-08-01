import { handleRouteError, jsonOk, requireApiUser } from '@/lib/api/http';
import { AppError } from '@/services/errors';
import { removeItemFromWatchList } from '@/services/watch-list';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const watchListItemId = Number(id);

    if (!Number.isFinite(watchListItemId)) {
      throw new AppError(400, 'Invalid watch list item id.');
    }

    const items = await removeItemFromWatchList(
      user.id,
      watchListItemId
    );
    return jsonOk({ items });
  } catch (error) {
    return handleRouteError(error);
  }
}
