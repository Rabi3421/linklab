import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import { billingPlans, linkPacks } from '@/lib/billing/plans';

export const runtime = 'nodejs';

// ── Pack prices in INR paise (one-time orders) ───────────────────────────
// Razorpay only supports INR for Indian accounts
const PACK_PRICE_PAISE: Record<string, number> = {
  'pack-100':   12900,   // ₹129
  'pack-500':   49900,   // ₹499
  'pack-2000':  149900,  // ₹1,499
  'pack-10000': 499900,  // ₹4,999
};

// ── Plan prices in INR paise for Razorpay Plan creation ──────────────────
const PLAN_PRICE_PAISE: Record<string, number> = {
  starter: 9900,    // ₹99/month
  launch:  39900,   // ₹399/month
  growth:  79900,   // ₹799/month
  scale:   239900,  // ₹2,399/month
  pro:     649900,  // ₹6,499/month
};

const CURRENCY = 'INR';

function getRazorpayInstance() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ── Create or reuse a Razorpay Plan for a given subscription plan ─────────
// Razorpay Plans are reusable — we create one per plan tier and cache the ID
// in memory (sufficient for a single server; extend to DB if needed).
const razorpayPlanIdCache: Record<string, string> = {};

async function getOrCreateRazorpayPlan(
  razorpay: Razorpay,
  planId: string,
  amountCents: number,
  planName: string
): Promise<string> {
  if (razorpayPlanIdCache[planId]) {
    return razorpayPlanIdCache[planId];
  }

  const plan = await razorpay.plans.create({
    period:   'monthly',
    interval: 1,
    item: {
      name:     `LinkLab ${planName} plan`,
      amount:   amountCents,
      currency: CURRENCY,
    },
    notes: { linklab_plan_id: planId },
  });

  razorpayPlanIdCache[planId] = plan.id;
  return plan.id;
}

export async function POST(request: Request) {
  const authenticatedUser = await getServerAuthenticatedUser();
  if (!authenticatedUser) {
    return NextResponse.json({ message: 'Please sign in to continue.' }, { status: 401 });
  }

  let body: { planId?: string; packId?: string };
  try {
    body = (await request.json()) as { planId?: string; packId?: string };
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { planId, packId } = body;
  if (!planId && !packId) {
    return NextResponse.json({ message: 'A planId or packId is required.' }, { status: 400 });
  }

  try {
    const razorpay = getRazorpayInstance();

    // ── Subscription plan → Razorpay recurring subscription ──────────────
    if (planId) {
      const plan = billingPlans.find((p) => p.id === planId);
      if (!plan) return NextResponse.json({ message: 'Unknown plan.' }, { status: 400 });
      if (plan.id === 'free') return NextResponse.json({ message: 'Free plan does not require payment.' }, { status: 400 });
      if (plan.isCustomPricing) return NextResponse.json({ message: 'Enterprise pricing requires a custom quote.' }, { status: 400 });

      const amountCents = PLAN_PRICE_PAISE[planId];
      if (!amountCents) return NextResponse.json({ message: 'Unable to determine price for this plan.' }, { status: 400 });

      // Step 1: Get or create a Razorpay Plan
      const razorpayPlanId = await getOrCreateRazorpayPlan(razorpay, planId, amountCents, plan.name);

      // Step 2: Create a Razorpay Subscription
      // total_count: 120 = 10 years of monthly billing (effectively "until cancelled")
      const subscription = await razorpay.subscriptions.create({
        plan_id:         razorpayPlanId,
        total_count:     120,
        customer_notify: 1,
        notes: {
          ownerId:    authenticatedUser.id,
          ownerEmail: authenticatedUser.email ?? '',
          planId,
        },
      });

      return NextResponse.json(
        {
          type:           'subscription',
          subscriptionId: subscription.id,
          itemName:       `LinkLab ${plan.name} plan — billed monthly`,
          keyId:          process.env.RAZORPAY_KEY_ID,
        },
        { status: 201 }
      );
    }

    // ── Link credit pack → one-time Razorpay order ────────────────────────
    if (packId) {
      const pack = linkPacks.find((p) => p.id === packId);
      if (!pack) return NextResponse.json({ message: 'Unknown link pack.' }, { status: 400 });

      const amountCents = PACK_PRICE_PAISE[packId];
      if (!amountCents) return NextResponse.json({ message: 'Unable to determine price for this pack.' }, { status: 400 });

      const order = await razorpay.orders.create({
        amount:   amountCents,
        currency: CURRENCY,
        receipt:  `pack_${packId}_${Date.now()}`,
        notes: {
          ownerId:    authenticatedUser.id,
          ownerEmail: authenticatedUser.email ?? '',
          packId,
        },
      });

      return NextResponse.json(
        {
          type:     'order',
          orderId:  order.id,
          amount:   order.amount,
          currency: order.currency,
          itemName: `LinkLab ${pack.name} — ${pack.links} link credits`,
          keyId:    process.env.RAZORPAY_KEY_ID,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[razorpay/order] Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to create payment.' },
      { status: 500 }
    );
  }
}
