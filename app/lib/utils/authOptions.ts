import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/prisma/client';

export const authOptions: NextAuthOptions = {
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
    async signIn({ user, account }) {
      if (!user.email || !account) {
        console.error('[auth] signIn missing email or account', {
          email: user.email,
          provider: account?.provider,
        });
        return false;
      }

      try {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              },
            },
          });
        } else if (
          !existing.accounts.some(
            (a) =>
              a.provider === account.provider &&
              a.providerAccountId === account.providerAccountId
          )
        ) {
          await prisma.account.create({
            data: {
              userId: existing.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }

        return true;
      } catch (error) {
        console.error('[auth] signIn upsert failed', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect the user to /subscriptions after successful login
      if (url === baseUrl || url.startsWith(baseUrl)) {
        return `${baseUrl}/subscriptions`;
      }
      return baseUrl;
    },
  },
};
