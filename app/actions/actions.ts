'use server';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import schema from './schema';
import { revalidatePath } from 'next/cache';
import { Subscription } from '../subscriptions/types';

const validateSessionUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('User is not authenticated.');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

export async function searchStreamingProvider(query: string) {
  if (!query) return [];

  const providers = await prisma.streamingProvider.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: 10,
  });

  return providers;
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

  const { streamingProviderId, description, cost } = validation.data;

  try {
    // Create the subscription in the database
    await prisma.subscription.create({
      data: {
        userId: user.id,
        description,
        cost,
        streamingProviderId: streamingProviderId,
      },
    });

    // Revalidate the cache if needed
    revalidatePath('/');
  } catch (error: any) {
    throw new Error(
      `Failed to create subscription: ${error.message}`
    );
  }
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
    revalidatePath('/');
  } catch (error: any) {
    throw new Error(`Failed to edit subscription: ${error.message}`);
  }
}

export async function deleteSubscription(id: number) {
  await validateSessionUser();

  try {
    await prisma.subscription.delete({
      where: {
        id,
      },
    });

    revalidatePath('/');
  } catch (error: any) {
    throw new Error(
      `Failed to delete subscription: ${error.message}`
    );
  }
}
