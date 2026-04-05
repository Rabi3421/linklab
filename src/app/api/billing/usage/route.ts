import { NextResponse } from 'next/server';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import { getBillingUsageSnapshotForUser } from '@/lib/billing/service';

export const runtime = 'nodejs';

export async function GET() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const usage = await getBillingUsageSnapshotForUser(authenticatedUser.id, authenticatedUser.email);

  return NextResponse.json({ usage });
}
