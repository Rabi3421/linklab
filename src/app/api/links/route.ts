import { NextResponse } from 'next/server';
import { createShortLinkForCurrentRequest } from '@/lib/links/service';
import type { QrStyleConfig } from '@/lib/links/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      originalUrl?: string;
      customAlias?: string;
      expirationDate?: string;
      qrStyle?: QrStyleConfig;
    };

    if (!body.originalUrl?.trim()) {
      return NextResponse.json({ message: 'Original URL is required.' }, { status: 400 });
    }

    const createdLink = await createShortLinkForCurrentRequest(request, {
      originalUrl: body.originalUrl,
      customAlias: body.customAlias,
      expirationDate: body.expirationDate,
      qrStyle: body.qrStyle,
    });

    return NextResponse.json(createdLink, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to shorten the URL right now.' },
      { status: 400 },
    );
  }
}