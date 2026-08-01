import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
  requireApiUser,
} from '@/lib/api/http';
import { AppError } from '@/services/errors';
import {
  deleteSubscriptionForUser,
  subscriptionInputSchema,
  updateSubscriptionForUser,
} from '@/services/subscriptions';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const subscriptionId = Number(id);

    if (!Number.isFinite(subscriptionId)) {
      throw new AppError(400, 'Invalid subscription id.');
    }

    const body = await parseJsonBody<unknown>(request);
    const parsed = subscriptionInputSchema.safeParse({
      ...(typeof body === 'object' && body ? body : {}),
      id: subscriptionId,
    });

    if (!parsed.success) {
      throw new AppError(
        400,
        parsed.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')
      );
    }

    const subscription = await updateSubscriptionForUser(
      user.id,
      parsed.data
    );
    return jsonOk({ subscription });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const subscriptionId = Number(id);

    if (!Number.isFinite(subscriptionId)) {
      throw new AppError(400, 'Invalid subscription id.');
    }

    const subscription = await deleteSubscriptionForUser(
      user.id,
      subscriptionId
    );
    return jsonOk({ subscription });
  } catch (error) {
    return handleRouteError(error);
  }
}
