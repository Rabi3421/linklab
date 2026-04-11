import { NextResponse } from 'next/server';
import { getAdminUsers, getServerSuperAdmin } from '@/lib/admin/service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const admin = await getServerSuperAdmin();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const search = searchParams.get('search') ?? '';

  const data = await getAdminUsers(page, limit, search);
  return NextResponse.json(data);
}
