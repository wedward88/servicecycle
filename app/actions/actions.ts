'use server';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import schema from './schema';
import { revalidatePath } from 'next/cache';

export async function createSubscription(formData: FormData) {
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

  const formObj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string' && value.length === 0) {
      return;
    }

    if (value === null || value === undefined) {
      return;
    }

    formObj[key] = value as string;
  });

  const { serviceName, description, cost, expirationDate } = formObj;

  const isoExpirationDate = expirationDate
    ? new Date(expirationDate).toISOString()
    : null;

  try {
    // Create the subscription in the database
    await prisma.subscription.create({
      data: {
        userId: user.id,
        provider: serviceName,
        description: description,
        cost: cost,
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
