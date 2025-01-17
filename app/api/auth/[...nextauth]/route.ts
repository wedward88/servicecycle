import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/prisma/client';
import { NextAuthOptions } from 'next-auth';

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
        return `${baseUrl}/subscriptions`; // This will redirect to /subscriptions
      }
      return url; // Default redirection
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
