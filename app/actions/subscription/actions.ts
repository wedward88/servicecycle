'use server';

import { revalidatePath } from 'next/cache';

import { COMMON_STREAMING_PROVIDER_IDS } from '@/app/lib/commonProviders';
import { filterStandaloneProviders } from '@/app/lib/streamingProviders';
import prisma from '@/prisma/client';

import { Subscription } from '../../subscriptions/types';
import schema from '../schema';
import { validateSessionUser } from '../utils';

export async function searchStreamingProvider(query: string) {
  if (!query) return [];

  const providers = await prisma.streamingProvider.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    // Over-fetch so channel add-ons can be stripped without starving results.
    take: 40,
  });

  return filterStandaloneProviders(providers).slice(0, 10);
}

export async function getCommonStreamingProviders() {
  const providers = await prisma.streamingProvider.findMany({
    where: {
      providerId: {
        in: [...COMMON_STREAMING_PROVIDER_IDS],
      },
    },
  });

  const order = new Map<number, number>(
    COMMON_STREAMING_PROVIDER_IDS.map((id, index) => [id, index])
  );

  return providers.sort(
    (a, b) =>
      (order.get(a.providerId) ?? 99) - (order.get(b.providerId) ?? 99)
  );
}

export async function getUserSubscriptions(email: string) {
  const userSubs = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      subscriptions: {
        include: {
          streamingProvider: true,
        },
      },
    },
  });

  return userSubs;
}

export async function createSubscription(formData: Subscription) {
  const user = await validateSessionUser();

  const validation = schema.safeParse(formData);

  if (!validation.success) {
    const errorMessages = validation.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new Error(`Invalid form parameters. ${errorMessages}`);
  }

  const { streamingProviderId, cost } = validation.data;

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      streamingProviderId: streamingProviderId,
    },
  });

  if (existingSubscription) {
    throw new Error('Subscription already exists');
  }

  let newSubscription;
  try {
    // Create the subscription in the database
    newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        cost,
        streamingProviderId: streamingProviderId,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to create subscription: ${error.message}`
      );
    } else {
      throw new Error('Failed to create subscription: Unknown error');
    }
  }

  const newSubWithProvider = await prisma.subscription.findUnique({
    where: {
      id: newSubscription.id,
    },
    include: {
      streamingProvider: true,
    },
  });

  if (!newSubWithProvider)
    throw new Error('Failed to create subscription');

  return newSubWithProvider;
}

export async function editSubscription(formData: Subscription) {
  await validateSessionUser();

  const validation = schema.safeParse(formData);

  if (!validation.success) {
    const errorMessages = validation.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new Error(`Invalid form parameters. ${errorMessages}`);
  }

  const { id } = validation.data;

  try {
    // Create the subscription in the database
    await prisma.subscription.update({
      where: {
        id: id,
      },
      data: {
        ...validation.data,
      },
    });

    // Revalidate the cache if needed
    revalidatePath('/subscriptions');
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to edit subscription: ${error.message}`
      );
    } else {
      throw new Error('Failed to edit subscription: Unknown error');
    }
  }
}

export async function deleteSubscription(id: number) {
  await validateSessionUser();

  let deletedSubscription;
  try {
    deletedSubscription = await prisma.subscription.delete({
      where: {
        id,
      },
      include: {
        streamingProvider: true,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to delete subscription: ${error.message}`
      );
    } else {
      throw new Error('Failed to delete subscription: Unknown error');
    }
  }

  if (!deletedSubscription)
    throw new Error('Failed to delete subscription');

  return deletedSubscription;
}
