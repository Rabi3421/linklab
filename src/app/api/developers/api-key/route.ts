import { NextResponse } from 'next/server';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import {
  getDeveloperApiKeySummaryForUser,
  issueDeveloperApiKeyForUser,
  revokeDeveloperApiKeyForUser,
} from '@/lib/developers/service';

export const runtime = 'nodejs';

export async function GET() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = await getDeveloperApiKeySummaryForUser(
    authenticatedUser.id,
    authenticatedUser.email
  );

  return NextResponse.json({ apiKey });
}

export async function POST() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const issued = await issueDeveloperApiKeyForUser({
    ownerId: authenticatedUser.id,
    ownerEmail: authenticatedUser.email,
  });

  return NextResponse.json(
    {
      apiKey: issued.summary,
      plainTextKey: issued.plainTextKey,
      message: 'API key generated successfully. Store it now because it will only be shown once.',
    },
    { status: 201 }
  );
}

export async function DELETE() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = await revokeDeveloperApiKeyForUser(authenticatedUser.id, authenticatedUser.email);

  return NextResponse.json({ apiKey, message: 'API key revoked successfully.' });
}
