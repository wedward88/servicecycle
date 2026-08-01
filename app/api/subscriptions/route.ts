import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
  requireApiUser,
} from '@/lib/api/http';
import { AppError } from '@/services/errors';
import {
  createSubscriptionForUser,
  getSubscriptionsForUser,
  subscriptionInputSchema,
} from '@/services/subscriptions';

export async function GET() {
  try {
    const user = await requireApiUser();
    const subscriptions = await getSubscriptionsForUser(user.id);
    return jsonOk({ subscriptions });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await parseJsonBody<unknown>(request);
    const parsed = subscriptionInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(
        400,
        parsed.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')
      );
    }

    const subscription = await createSubscriptionForUser(
      user.id,
      parsed.data
    );
    return jsonOk({ subscription }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
