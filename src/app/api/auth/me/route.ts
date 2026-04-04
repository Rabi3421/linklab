import { NextResponse } from 'next/server';
import { readAuthCookies } from '@/lib/auth/cookies';
import { getUserFromAccessToken } from '@/lib/auth/server';

export const runtime = 'nodejs';

export async function GET() {
  const { accessToken } = readAuthCookies();
  const user = await getUserFromAccessToken(accessToken);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user });
}