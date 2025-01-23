import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect the user to /subscriptions after successful login
      if (url === baseUrl || url.startsWith(baseUrl)) {
        return `${baseUrl}/subscriptions`;
      }
      return baseUrl;
    },
  },
};
