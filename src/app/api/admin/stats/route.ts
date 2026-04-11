import { NextResponse } from 'next/server';
import { getAdminOverviewStats, getServerSuperAdmin } from '@/lib/admin/service';

export const runtime = 'nodejs';

export async function GET() {
  const admin = await getServerSuperAdmin();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const stats = await getAdminOverviewStats();
  return NextResponse.json(stats);
}
