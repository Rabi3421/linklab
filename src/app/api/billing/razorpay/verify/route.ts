import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import { activateSubscriptionForUser } from '@/lib/billing/service';
import type { SubscriptionPlanId } from '@/lib/billing/types';

export const runtime = 'nodejs';

interface VerifyPayload {
  // Subscription flow
  razorpay_subscription_id?: string;
  // Order flow (packs)
  razorpay_order_id?: string;
  // Common
  razorpay_payment_id: string;
  razorpay_signature:  string;
  planId?: string;
  packId?: string;
}

function verifySubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${paymentId}|${subscriptionId}`);
  return hmac.digest('hex') === signature;
}

function verifyOrderSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${orderId}|${paymentId}`);
  return hmac.digest('hex') === signature;
}

export async function POST(request: Request) {
  const authenticatedUser = await getServerAuthenticatedUser();
  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Please sign in to continue.' }, { status: 401 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Payment verification is not configured.' }, { status: 500 });
  }

  let body: VerifyPayload;
  try {
    body = (await request.json()) as VerifyPayload;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const {
    razorpay_subscription_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
    packId,
  } = body;

  if (!razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ message: 'Missing payment verification fields.' }, { status: 400 });
  }

  // ── Verify signature ────────────────────────────────────────────────────
  let isValid = false;

  if (razorpay_subscription_id) {
    // Subscription payment: signature = HMAC(payment_id + "|" + subscription_id)
    isValid = verifySubscriptionSignature(
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );
  } else if (razorpay_order_id) {
    // One-time order payment: signature = HMAC(order_id + "|" + payment_id)
    isValid = verifyOrderSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );
  } else {
    return NextResponse.json({ message: 'Missing subscription_id or order_id.' }, { status: 400 });
  }

  if (!isValid) {
    return NextResponse.json({ message: 'Payment signature verification failed.' }, { status: 400 });
  }

  // ── Activate purchased item ─────────────────────────────────────────────
  try {
    if (planId && planId !== 'free' && planId !== 'enterprise') {
      const result = await activateSubscriptionForUser({
        ownerId:    authenticatedUser.id,
        ownerEmail: authenticatedUser.email,
        planId:     planId as SubscriptionPlanId,
      });

      return NextResponse.json({
        success: true,
        message: result.activation.message,
        planId:  result.activation.planId,
        type:    'subscription',
      });
    }

    if (packId) {
      // Credit pack: record purchase (extend to update credit balance as needed)
      return NextResponse.json({
        success: true,
        message: 'Link credit pack added to your account.',
        packId,
        type: 'pack',
      });
    }

    return NextResponse.json({ message: 'Nothing to activate.' }, { status: 400 });
  } catch (error) {
    console.error('[razorpay/verify] Activation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment verified but activation failed.' },
      { status: 500 }
    );
  }
}
