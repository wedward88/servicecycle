import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
  requireApiUser,
} from '@/lib/api/http';
import { AppError } from '@/services/errors';
import { reorderWatchListForUser } from '@/services/watch-list';

export async function PUT(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await parseJsonBody<{ orderedItemIds?: number[] }>(
      request
    );

    if (
      !body.orderedItemIds ||
      !Array.isArray(body.orderedItemIds) ||
      body.orderedItemIds.some((id) => typeof id !== 'number')
    ) {
      throw new AppError(400, 'orderedItemIds must be an array of numbers.');
    }

    await reorderWatchListForUser(user.id, body.orderedItemIds);
    return jsonOk({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
