import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { registerUser } from '@/lib/auth/server';
import type { RegisterPayload } from '@/lib/auth/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    const session = await registerUser(body);
    const response = NextResponse.json({ user: session.user }, { status: 201 });

    setAuthCookies(response, {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      refreshTokenTtlSeconds: session.refreshTokenTtlSeconds,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to create your account right now.',
      },
      { status: 400 },
    );
  }
}