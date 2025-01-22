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

export async function fetchTMDBResults(query: string) {
  const TMDB_ENDPOINT = 'search/multi?query=';
  const URL = `${process.env.TMDB_URL}${TMDB_ENDPOINT}${query}&api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const results = await response.json();

  const final = results.results;

  return final.filter(
    (item: {
      media_type: string;
      poster_path: string | null;
      vote_average: number;
      original_language: string;
    }) =>
      item.media_type !== 'person' &&
      item.poster_path !== null &&
      item.vote_average !== 0 &&
      item.original_language === 'en'
  );
}

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
    revalidatePath('/subscriptions');
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
    revalidatePath('/subscriptions');
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

    revalidatePath('/subscriptions');
  } catch (error: any) {
    throw new Error(
      `Failed to delete subscription: ${error.message}`
    );
  }
}
