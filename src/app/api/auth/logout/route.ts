import { NextResponse } from 'next/server';
import { clearAuthCookies, readAuthCookies } from '@/lib/auth/cookies';
import { logoutUser } from '@/lib/auth/server';
import { verifyRefreshToken } from '@/lib/auth/tokens';

export const runtime = 'nodejs';

export async function POST() {
  const { refreshToken } = readAuthCookies();

  if (refreshToken) {
    const payload = await verifyRefreshToken(refreshToken);

    if (payload?.sub) {
      await logoutUser(payload.sub);
    }
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);

  return response;
}