import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
  requireApiUser,
} from '@/lib/api/http';
import { AppError } from '@/services/errors';
import {
  addItemToWatchList,
  getWatchListForUser,
} from '@/services/watch-list';
import { WatchListItemType } from '@/app/watch/watch-list/types';

export async function GET() {
  try {
    const user = await requireApiUser();
    const items = (await getWatchListForUser(user.id)) ?? [];
    return jsonOk({ items });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await parseJsonBody<WatchListItemType>(request);

    if (
      !body ||
      typeof body.id !== 'number' ||
      typeof body.mediaType !== 'string'
    ) {
      throw new AppError(400, 'Invalid watch list item payload.');
    }

    const item = await addItemToWatchList(user, body);
    return jsonOk({ item }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
