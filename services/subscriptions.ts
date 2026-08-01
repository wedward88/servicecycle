import { z } from 'zod';

import prisma from '@/prisma/client';

import { AppError } from './errors';

export const subscriptionInputSchema = z.object({
  streamingProviderId: z.number(),
  id: z.number().optional(),
  cost: z.string().optional(),
});

export type SubscriptionInput = z.infer<typeof subscriptionInputSchema>;

const subscriptionWithProvider = {
  streamingProvider: true,
} as const;

export async function getSubscriptionsForUser(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    include: subscriptionWithProvider,
  });
}

/**
 * Legacy-compatible shape used by the subscriptions page
 * (`user` record with nested `subscriptions`).
 */
export async function getUserWithSubscriptions(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        include: subscriptionWithProvider,
      },
    },
  });
}

export async function createSubscriptionForUser(
  userId: string,
  input: SubscriptionInput
) {
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      streamingProviderId: input.streamingProviderId,
    },
  });

  if (existingSubscription) {
    throw new AppError(409, 'Subscription already exists');
  }

  try {
    const newSubscription = await prisma.subscription.create({
      data: {
        userId,
        cost: input.cost,
        streamingProviderId: input.streamingProviderId,
      },
      include: subscriptionWithProvider,
    });

    return newSubscription;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(
        500,
        `Failed to create subscription: ${error.message}`
      );
    }
    throw new AppError(500, 'Failed to create subscription: Unknown error');
  }
}

export async function updateSubscriptionForUser(
  userId: string,
  input: SubscriptionInput
) {
  if (input.id == null) {
    throw new AppError(400, 'Subscription id is required.');
  }

  const existing = await prisma.subscription.findUnique({
    where: { id: input.id },
  });

  if (!existing) {
    throw new AppError(404, 'Subscription not found.');
  }

  if (existing.userId !== userId) {
    throw new AppError(403, 'Forbidden.');
  }

  try {
    return await prisma.subscription.update({
      where: { id: input.id },
      data: {
        streamingProviderId: input.streamingProviderId,
        cost: input.cost,
      },
      include: subscriptionWithProvider,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(
        500,
        `Failed to edit subscription: ${error.message}`
      );
    }
    throw new AppError(500, 'Failed to edit subscription: Unknown error');
  }
}

export async function deleteSubscriptionForUser(
  userId: string,
  subscriptionId: number
) {
  const existing = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!existing) {
    throw new AppError(404, 'Subscription not found.');
  }

  if (existing.userId !== userId) {
    throw new AppError(403, 'Forbidden.');
  }

  try {
    return await prisma.subscription.delete({
      where: { id: subscriptionId },
      include: subscriptionWithProvider,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(
        500,
        `Failed to delete subscription: ${error.message}`
      );
    }
    throw new AppError(500, 'Failed to delete subscription: Unknown error');
  }
}
