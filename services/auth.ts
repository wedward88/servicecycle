import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/lib/utils/authOptions';

import { AppError } from './errors';
import { getUserByEmailOrThrow } from './users';

/**
 * Resolve the authenticated Prisma user from the current NextAuth session.
 * Shared by Server Actions and API route handlers.
 */
export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new AppError(401, 'User is not authenticated.');
  }

  return getUserByEmailOrThrow(session.user.email);
}
