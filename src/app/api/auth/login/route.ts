import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { loginUser } from '@/lib/auth/server';
import type { LoginPayload } from '@/lib/auth/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;
    const session = await loginUser(body);
    const response = NextResponse.json({ user: session.user });

    setAuthCookies(response, {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      refreshTokenTtlSeconds: session.refreshTokenTtlSeconds,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to sign you in right now.',
      },
      { status: 401 },
    );
  }
}