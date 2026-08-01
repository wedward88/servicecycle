import { createHmac, timingSafeEqual } from 'crypto';

import prisma from '@/prisma/client';

import { AppError } from './errors';

export type GoogleIdTokenPayload = {
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
  sub: string;
};

export type MobileJwtPayload = {
  email: string;
  sub: string;
};

type GoogleTokenInfo = {
  aud?: string;
  azp?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
  sub?: string;
  iss?: string;
  exp?: string;
};

function mobileJwtSecret() {
  const secret = process.env.MOBILE_JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new AppError(500, 'Mobile JWT secret is not configured.');
  }
  return secret;
}

function googleClientAudiences() {
  const audiences = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
  ].filter((value): value is string => Boolean(value));

  if (audiences.length === 0) {
    throw new AppError(500, 'Google client ID is not configured.');
  }

  return audiences;
}

function base64UrlEncode(input: Buffer | string) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLength), 'base64');
}

/**
 * Verify a Google ID token from the iOS Google Sign-In SDK via Google tokeninfo.
 * Audience may be the web client ID (serverClientId) or the iOS client ID.
 */
export async function verifyGoogleIdToken(
  idToken: string
): Promise<GoogleIdTokenPayload> {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  if (!response.ok) {
    throw new AppError(401, 'Invalid Google ID token.');
  }

  const payload = (await response.json()) as GoogleTokenInfo;
  const audiences = googleClientAudiences();
  const audience = payload.aud;
  const authorizedParty = payload.azp;

  if (
    !audience ||
    (!audiences.includes(audience) &&
      !(authorizedParty && audiences.includes(authorizedParty)))
  ) {
    throw new AppError(401, 'Google ID token audience mismatch.');
  }

  if (
    payload.iss !== 'accounts.google.com' &&
    payload.iss !== 'https://accounts.google.com'
  ) {
    throw new AppError(401, 'Google ID token issuer mismatch.');
  }

  if (payload.exp && Number(payload.exp) * 1000 < Date.now()) {
    throw new AppError(401, 'Google ID token has expired.');
  }

  const email = payload.email;
  if (!email) {
    throw new AppError(401, 'Google ID token is missing an email.');
  }

  const emailVerified =
    payload.email_verified === true || payload.email_verified === 'true';
  if (!emailVerified) {
    throw new AppError(401, 'Google email is not verified.');
  }

  if (!payload.sub) {
    throw new AppError(401, 'Google ID token is missing subject.');
  }

  return {
    email,
    emailVerified: true,
    name: payload.name,
    picture: payload.picture,
    sub: payload.sub,
  };
}

/**
 * Upsert a Prisma user + Google Account from a verified Google ID token.
 * Mirrors the NextAuth signIn callback in authOptions.ts.
 */
export async function upsertGoogleUser(payload: GoogleIdTokenPayload) {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
    include: { accounts: true },
  });

  if (!existing) {
    return prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        image: payload.picture,
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: payload.sub,
          },
        },
      },
    });
  }

  const hasGoogleAccount = existing.accounts.some(
    (account) =>
      account.provider === 'google' &&
      account.providerAccountId === payload.sub
  );

  if (!hasGoogleAccount) {
    await prisma.account.create({
      data: {
        userId: existing.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: payload.sub,
      },
    });
  }

  if (
    (payload.name && payload.name !== existing.name) ||
    (payload.picture && payload.picture !== existing.image)
  ) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: payload.name ?? existing.name,
        image: payload.picture ?? existing.image,
      },
    });
  }

  return existing;
}

export async function signMobileJwt(user: {
  id: string;
  email: string | null;
}) {
  if (!user.email) {
    throw new AppError(500, 'User is missing an email.');
  }

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      email: user.email,
      sub: user.id,
      iat: now,
      exp: now + 60 * 60 * 24 * 30,
    })
  );
  const data = `${header}.${payload}`;
  const signature = createHmac('sha256', mobileJwtSecret())
    .update(data)
    .digest();

  return `${data}.${base64UrlEncode(signature)}`;
}

export async function verifyMobileJwt(token: string): Promise<MobileJwtPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new AppError(401, 'Invalid or expired mobile token.');
  }

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  const expected = createHmac('sha256', mobileJwtSecret()).update(data).digest();
  const actual = base64UrlDecode(signature);

  if (
    expected.length !== actual.length ||
    !timingSafeEqual(expected, actual)
  ) {
    throw new AppError(401, 'Invalid or expired mobile token.');
  }

  let parsed: { email?: string; sub?: string; exp?: number };
  try {
    parsed = JSON.parse(base64UrlDecode(payload).toString('utf8')) as {
      email?: string;
      sub?: string;
      exp?: number;
    };
  } catch {
    throw new AppError(401, 'Invalid or expired mobile token.');
  }

  if (typeof parsed.exp === 'number' && parsed.exp * 1000 < Date.now()) {
    throw new AppError(401, 'Invalid or expired mobile token.');
  }

  if (typeof parsed.email !== 'string' || !parsed.email) {
    throw new AppError(401, 'Mobile token is missing an email.');
  }
  if (typeof parsed.sub !== 'string' || !parsed.sub) {
    throw new AppError(401, 'Mobile token is missing subject.');
  }

  return { email: parsed.email, sub: parsed.sub };
}
