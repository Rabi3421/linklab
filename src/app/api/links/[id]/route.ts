import { NextResponse } from 'next/server';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import { deleteLinkForUser, updateLinkForUser } from '@/lib/links/service';
import type { QrStyleConfig } from '@/lib/links/types';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      originalUrl?: string;
      customAlias?: string;
      expirationDate?: string;
      qrStyle?: QrStyleConfig;
    };

    const updatedLink = await updateLinkForUser(authenticatedUser.id, params.id, {
      originalUrl: body.originalUrl,
      customAlias: body.customAlias,
      expirationDate: body.expirationDate,
      qrStyle: body.qrStyle,
      baseUrl: new URL(request.url).origin,
    });

    if (!updatedLink) {
      return NextResponse.json({ message: 'Link not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedLink);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to update this link right now.' },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteLinkForUser(authenticatedUser.id, params.id);

  if (!deleted) {
    return NextResponse.json({ message: 'Link not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}