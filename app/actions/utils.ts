'use server';

import { requireUser } from '@/services/auth';

/**
 * @deprecated Prefer `requireUser` from `@/services/auth`.
 * Kept for existing call sites.
 */
export const validateSessionUser = async () => {
  return requireUser();
};
