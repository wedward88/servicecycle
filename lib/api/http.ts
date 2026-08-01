import { NextResponse } from 'next/server';

import { AppError, isAppError } from '@/services/errors';
import { requireUser } from '@/services/auth';

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(status: number, message: string, code?: string) {
  return NextResponse.json(
    { error: message, ...(code ? { code } : {}) },
    { status }
  );
}

export function handleRouteError(error: unknown) {
  if (isAppError(error)) {
    return jsonError(error.status, error.message, error.code);
  }

  console.error('[api]', error);
  const message =
    error instanceof Error ? error.message : 'Internal server error';
  return jsonError(500, message);
}

export async function requireApiUser() {
  return requireUser();
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new AppError(400, 'Invalid JSON body.');
  }
}
