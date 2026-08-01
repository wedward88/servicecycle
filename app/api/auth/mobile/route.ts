import { z } from 'zod';

import {
  handleRouteError,
  jsonOk,
  parseJsonBody,
} from '@/lib/api/http';
import { AppError } from '@/services/errors';
import {
  signMobileJwt,
  upsertGoogleUser,
  verifyGoogleIdToken,
} from '@/services/mobile-auth';

const mobileAuthSchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<unknown>(request);
    const parsed = mobileAuthSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(400, 'idToken is required.');
    }

    const googlePayload = await verifyGoogleIdToken(parsed.data.idToken);
    const user = await upsertGoogleUser(googlePayload);
    const token = await signMobileJwt(user);

    return jsonOk({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
