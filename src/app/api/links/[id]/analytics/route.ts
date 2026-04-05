import { NextResponse } from 'next/server';
import { getRequestAuthenticatedUser } from '@/lib/auth/request';
import { getLinkAnalyticsByIdForUser } from '@/lib/links/service';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { user } = await getRequestAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const analytics = await getLinkAnalyticsByIdForUser(user.id, params.id);

  if (!analytics) {
    return NextResponse.json({ message: 'Link not found.' }, { status: 404 });
  }

  return NextResponse.json({ analytics });
}
