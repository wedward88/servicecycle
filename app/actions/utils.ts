'use server';

import { getServerSession } from 'next-auth';

import prisma from '@/prisma/client';

import { authOptions } from '../lib/utils/authOptions';

export const validateSessionUser = async () => {
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
