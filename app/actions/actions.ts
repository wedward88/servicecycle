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

export async function createSubscription(formData: Subscription) {
  const user = await validateSessionUser();

  const validation = schema.safeParse(formData);

  if (!validation.success) {
    const errorMessages = validation.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new Error(`Invalid form parameters. ${errorMessages}`);
  }

  const { serviceName, description, cost, expirationDate } = formData;

  const isoExpirationDate = expirationDate
    ? new Date(expirationDate).toISOString()
    : null;

  try {
    // Create the subscription in the database
    await prisma.subscription.create({
      data: {
        userId: user.id,
        serviceName,
        description,
        cost,
        expirationDate: isoExpirationDate,
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

  const { id, expirationDate } = formData;

  const isoExpirationDate = expirationDate
    ? new Date(expirationDate).toISOString()
    : null;

  try {
    // Create the subscription in the database
    await prisma.subscription.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
        expirationDate: isoExpirationDate,
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
