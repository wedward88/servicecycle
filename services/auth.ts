import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/lib/utils/authOptions';

import { AppError } from './errors';
import { verifyMobileJwt } from './mobile-auth';
import { getUserByEmailOrThrow } from './users';

/**
 * Resolve the authenticated Prisma user from a Bearer mobile JWT
 * or the current NextAuth session cookie.
 * Shared by Server Actions and API route handlers.
 */
export async function requireUser() {
  const headerStore = await headers();
  const authorization = headerStore.get('authorization');

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new AppError(401, 'User is not authenticated.');
    }

    const payload = await verifyMobileJwt(token);
    return getUserByEmailOrThrow(payload.email);
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new AppError(401, 'User is not authenticated.');
  }

  return getUserByEmailOrThrow(session.user.email);
}
