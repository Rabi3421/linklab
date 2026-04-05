import { NextResponse } from 'next/server';
import { getLinkForRedirect, recordLinkClick } from '@/lib/links/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const link = await getLinkForRedirect(params.code);

  if (!link) {
    return new NextResponse('Short link not found.', { status: 404 });
  }

  const clickResult = await recordLinkClick(link, request);

  if (clickResult.expired) {
    return new NextResponse('This short link has expired.', { status: 410 });
  }

  return NextResponse.redirect(link.normalizedUrl, { status: 307 });
}