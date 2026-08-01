'use server';

import { revalidatePath } from 'next/cache';

import { Subscription } from '@/app/subscriptions/types';
import { requireUser } from '@/services/auth';
import { AppError, isAppError } from '@/services/errors';
import {
  getCommonStreamingProviders as getCommonProvidersService,
  searchStreamingProviders,
} from '@/services/providers';
import {
  createSubscriptionForUser,
  deleteSubscriptionForUser,
  getUserWithSubscriptions,
  subscriptionInputSchema,
  updateSubscriptionForUser,
} from '@/services/subscriptions';

function toActionError(error: unknown): Error {
  if (isAppError(error)) {
    return new Error(error.message);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('Unknown error');
}

export async function searchStreamingProvider(query: string) {
  return searchStreamingProviders(query);
}

export async function getCommonStreamingProviders() {
  return getCommonProvidersService();
}

export async function getUserSubscriptions(email: string) {
  const user = await requireUser();

  if (user.email !== email) {
    throw new Error('Forbidden.');
  }

  return getUserWithSubscriptions(user.id);
}

export async function createSubscription(formData: Subscription) {
  try {
    const user = await requireUser();
    const validation = subscriptionInputSchema.safeParse(formData);

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new AppError(
        400,
        `Invalid form parameters. ${errorMessages}`
      );
    }

    return await createSubscriptionForUser(user.id, validation.data);
  } catch (error) {
    throw toActionError(error);
  }
}

export async function editSubscription(formData: Subscription) {
  try {
    const user = await requireUser();
    const validation = subscriptionInputSchema.safeParse(formData);

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new AppError(
        400,
        `Invalid form parameters. ${errorMessages}`
      );
    }

    await updateSubscriptionForUser(user.id, validation.data);
    revalidatePath('/subscriptions');
  } catch (error) {
    throw toActionError(error);
  }
}

export async function deleteSubscription(id: number) {
  try {
    const user = await requireUser();
    return await deleteSubscriptionForUser(user.id, id);
  } catch (error) {
    throw toActionError(error);
  }
}
