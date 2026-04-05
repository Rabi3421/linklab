import { NextResponse } from 'next/server';
import { activateSubscriptionForUser } from '@/lib/billing/service';
import type { SubscriptionPlanId } from '@/lib/billing/types';
import { getServerAuthenticatedUser } from '@/lib/auth/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json(
      { message: 'Please sign in before selecting a paid plan.' },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as { planId?: SubscriptionPlanId };

    if (!body.planId) {
      return NextResponse.json({ message: 'A plan selection is required.' }, { status: 400 });
    }

    const result = await activateSubscriptionForUser({
      ownerId: authenticatedUser.id,
      ownerEmail: authenticatedUser.email,
      planId: body.planId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to activate your subscription right now.',
      },
      { status: 400 }
    );
  }
}
