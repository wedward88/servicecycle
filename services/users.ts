import prisma from '@/prisma/client';

import { AppError } from './errors';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserByEmailOrThrow(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }
  return user;
}
