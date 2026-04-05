import { NextResponse } from 'next/server';
import { getRequestAuthenticatedUser } from '@/lib/auth/request';
import { BillingLimitExceededError } from '@/lib/billing/service';
import { createShortLinkForCurrentRequest } from '@/lib/links/service';
import type { QrStyleConfig } from '@/lib/links/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { user, invalidApiKey } = await getRequestAuthenticatedUser(request);

    if (invalidApiKey) {
      return NextResponse.json({ message: 'Invalid API key.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      originalUrl?: string;
      customAlias?: string;
      expirationDate?: string;
      qrStyle?: QrStyleConfig;
    };

    if (!body.originalUrl?.trim()) {
      return NextResponse.json({ message: 'Original URL is required.' }, { status: 400 });
    }

    const createdLink = await createShortLinkForCurrentRequest(
      request,
      {
        originalUrl: body.originalUrl,
        customAlias: body.customAlias,
        expirationDate: body.expirationDate,
        qrStyle: body.qrStyle,
      },
      user
    );

    return NextResponse.json(createdLink, { status: 201 });
  } catch (error) {
    if (error instanceof BillingLimitExceededError) {
      return NextResponse.json(
        {
          message: error.message,
          quota: error.snapshot,
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to shorten the URL right now.' },
      { status: 400 }
    );
  }
}
