import { NextResponse } from 'next/server';
import { clearAuthCookies, readAuthCookies, setAuthCookies } from '@/lib/auth/cookies';
import { refreshUserSession } from '@/lib/auth/server';

export const runtime = 'nodejs';

export async function POST() {
  const { refreshToken } = readAuthCookies();
  const session = await refreshUserSession(refreshToken);

  if (!session) {
    const response = NextResponse.json({ message: 'Session expired' }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({ user: session.user });

  setAuthCookies(response, {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    refreshTokenTtlSeconds: session.refreshTokenTtlSeconds,
  });

  return response;
}