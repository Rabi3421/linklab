import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getBillingPlan } from './plans';
import type {
  BillingUsageSnapshot,
  QuotaSubjectType,
  SubscriptionActivationResult,
  SubscriptionPlanId,
  SubscriptionStatus,
} from './types';

interface SubscriptionDocument {
  _id: ObjectId;
  ownerId: string;
  ownerEmail?: string;
  planId: SubscriptionPlanId;
  status: Exclude<SubscriptionStatus, 'free'>;
  paymentStatus: 'paid' | 'unpaid';
  paymentProvider: string;
  activatedAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt?: Date;
  updatedAt: Date;
}

interface MonthlyQuotaUsageDocument {
  _id: ObjectId;
  subjectType: QuotaSubjectType;
  subjectKey: string;
  ownerId?: string;
  ipAddress?: string;
  periodKey: string;
  linksCreated: number;
  createdAt: Date;
  updatedAt: Date;
}

const SUBSCRIPTIONS_COLLECTION = 'workspace_subscriptions';
const MONTHLY_USAGE_COLLECTION = 'monthly_link_usage';

const getSubscriptionsCollection = async () => {
  const database = await getDatabase();
  const collection = database.collection<SubscriptionDocument>(SUBSCRIPTIONS_COLLECTION);
  await collection.createIndex({ ownerId: 1 }, { unique: true });
  await collection.createIndex({ currentPeriodEnd: 1 });
  return collection;
};

const getMonthlyUsageCollection = async () => {
  const database = await getDatabase();
  const collection = database.collection<MonthlyQuotaUsageDocument>(MONTHLY_USAGE_COLLECTION);
  await collection.createIndex({ subjectType: 1, subjectKey: 1, periodKey: 1 }, { unique: true });
  await collection.createIndex({ ownerId: 1, periodKey: 1 });
  return collection;
};

const getPeriodWindow = (date = new Date()) => {
  const periodStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  const periodKey = `${periodStart.getUTCFullYear()}-${String(periodStart.getUTCMonth() + 1).padStart(2, '0')}`;

  return {
    periodKey,
    periodStart,
    periodEnd,
  };
};

const getNextSubscriptionEnd = (date = new Date()) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()));
};

const getRequestIpAddress = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const candidate = forwardedFor?.split(',')[0]?.trim() || realIp?.trim() || 'local';
  return candidate || 'local';
};

const getQuotaSubject = (
  request: Request,
  authenticatedUser?: { id: string; email?: string } | null
) => {
  if (authenticatedUser?.id) {
    return {
      subjectType: 'account' as const,
      subjectKey: authenticatedUser.id,
      ownerId: authenticatedUser.id,
      ipAddress: getRequestIpAddress(request),
    };
  }

  const ipAddress = getRequestIpAddress(request);

  return {
    subjectType: 'ip' as const,
    subjectKey: ipAddress,
    ownerId: undefined,
    ipAddress,
  };
};

const normalizeSubscriptionStatus = (
  subscription: SubscriptionDocument | null,
  now = new Date()
): { planId: SubscriptionPlanId; status: SubscriptionStatus; isPaid: boolean } => {
  if (!subscription) {
    return {
      planId: 'free',
      status: 'free',
      isPaid: false,
    };
  }

  if (
    subscription.status === 'canceled' ||
    subscription.currentPeriodEnd.getTime() <= now.getTime()
  ) {
    return {
      planId: 'free',
      status: subscription.status === 'canceled' ? 'canceled' : 'expired',
      isPaid: false,
    };
  }

  return {
    planId: subscription.planId,
    status: subscription.status,
    isPaid: subscription.planId !== 'free',
  };
};

const buildUsageSnapshot = (params: {
  planId: SubscriptionPlanId;
  subscriptionStatus: SubscriptionStatus;
  isPaid: boolean;
  quotaSubject: QuotaSubjectType;
  linksUsedThisMonth: number;
  periodKey: string;
  periodStart: Date;
  periodEnd: Date;
}): BillingUsageSnapshot => {
  const plan = getBillingPlan(params.planId);
  const remaining = Math.max(plan.monthlyLinkLimit - params.linksUsedThisMonth, 0);

  return {
    planId: plan.id,
    planName: plan.name,
    subscriptionStatus: params.subscriptionStatus,
    isPaid: params.isPaid,
    quotaSubject: params.quotaSubject,
    monthlyLinkLimit: plan.monthlyLinkLimit,
    linksUsedThisMonth: params.linksUsedThisMonth,
    linksRemainingThisMonth: remaining,
    upgradeRequired: remaining <= 0,
    currentPeriodKey: params.periodKey,
    currentPeriodStart: params.periodStart.toISOString(),
    currentPeriodEnd: params.periodEnd.toISOString(),
    resetAt: params.periodEnd.toISOString(),
  };
};

export class BillingLimitExceededError extends Error {
  snapshot: BillingUsageSnapshot;

  constructor(message: string, snapshot: BillingUsageSnapshot) {
    super(message);
    this.name = 'BillingLimitExceededError';
    this.snapshot = snapshot;
  }
}

export const getCurrentSubscriptionForUser = async (ownerId: string) => {
  const subscriptionsCollection = await getSubscriptionsCollection();
  const subscription = await subscriptionsCollection.findOne({ ownerId });

  if (!subscription) {
    return {
      subscription: null,
      normalized: normalizeSubscriptionStatus(null),
    };
  }

  const normalized = normalizeSubscriptionStatus(subscription);

  if (normalized.status === 'expired' && subscription.status !== 'canceled') {
    await subscriptionsCollection.updateOne(
      { _id: subscription._id },
      {
        $set: {
          status: 'expired',
          updatedAt: new Date(),
        },
      }
    );
  }

  return { subscription, normalized };
};

export const getBillingUsageSnapshotForRequest = async (
  request: Request,
  authenticatedUser?: { id: string; email?: string } | null
) => {
  const usageCollection = await getMonthlyUsageCollection();
  const { periodEnd, periodKey, periodStart } = getPeriodWindow();
  const quotaSubject = getQuotaSubject(request, authenticatedUser);
  const usageDocument = await usageCollection.findOne({
    subjectType: quotaSubject.subjectType,
    subjectKey: quotaSubject.subjectKey,
    periodKey,
  });

  const subscriptionState = authenticatedUser?.id
    ? await getCurrentSubscriptionForUser(authenticatedUser.id)
    : { normalized: { planId: 'free' as const, status: 'free' as const, isPaid: false } };

  return buildUsageSnapshot({
    planId: subscriptionState.normalized.planId,
    subscriptionStatus: subscriptionState.normalized.status,
    isPaid: subscriptionState.normalized.isPaid,
    quotaSubject: quotaSubject.subjectType,
    linksUsedThisMonth: usageDocument?.linksCreated ?? 0,
    periodKey,
    periodStart,
    periodEnd,
  });
};

export const getBillingUsageSnapshotForUser = async (ownerId: string, ownerEmail?: string) => {
  const syntheticRequest = new Request('http://localhost/internal-usage', {
    headers: ownerEmail ? { 'x-owner-email': ownerEmail } : undefined,
  });

  return getBillingUsageSnapshotForRequest(syntheticRequest, { id: ownerId, email: ownerEmail });
};

export const consumeLinkQuotaForRequest = async (
  request: Request,
  authenticatedUser?: { id: string; email?: string } | null
) => {
  const usageCollection = await getMonthlyUsageCollection();
  const quotaSubject = getQuotaSubject(request, authenticatedUser);
  const { periodKey, periodStart, periodEnd } = getPeriodWindow();
  const now = new Date();

  await usageCollection.updateOne(
    {
      subjectType: quotaSubject.subjectType,
      subjectKey: quotaSubject.subjectKey,
      periodKey,
    },
    {
      $setOnInsert: {
        _id: new ObjectId(),
        ownerId: quotaSubject.ownerId,
        ipAddress: quotaSubject.ipAddress,
        createdAt: now,
      },
      $set: {
        updatedAt: now,
      },
      $inc: {
        linksCreated: 1,
      },
    },
    { upsert: true }
  );

  const usageDocument = await usageCollection.findOne({
    subjectType: quotaSubject.subjectType,
    subjectKey: quotaSubject.subjectKey,
    periodKey,
  });

  const subscriptionState = authenticatedUser?.id
    ? await getCurrentSubscriptionForUser(authenticatedUser.id)
    : { normalized: { planId: 'free' as const, status: 'free' as const, isPaid: false } };

  return buildUsageSnapshot({
    planId: subscriptionState.normalized.planId,
    subscriptionStatus: subscriptionState.normalized.status,
    isPaid: subscriptionState.normalized.isPaid,
    quotaSubject: quotaSubject.subjectType,
    linksUsedThisMonth: usageDocument?.linksCreated ?? 0,
    periodKey,
    periodStart,
    periodEnd,
  });
};

export const assertCanCreateLinkForRequest = async (
  request: Request,
  authenticatedUser?: { id: string; email?: string } | null
) => {
  const snapshot = await getBillingUsageSnapshotForRequest(request, authenticatedUser);

  if (!snapshot.upgradeRequired) {
    return snapshot;
  }

  const message = authenticatedUser?.id
    ? `You have used all ${snapshot.monthlyLinkLimit} links for this month on the ${snapshot.planName} plan. Upgrade your subscription to keep creating links.`
    : `This IP address has already used all ${snapshot.monthlyLinkLimit} free links for this month. Sign in and upgrade to keep shortening URLs.`;

  throw new BillingLimitExceededError(message, snapshot);
};

export const activateSubscriptionForUser = async (input: {
  ownerId: string;
  ownerEmail?: string;
  planId: SubscriptionPlanId;
}) => {
  const now = new Date();
  const subscriptionsCollection = await getSubscriptionsCollection();
  const nextEndDate = getNextSubscriptionEnd(now);
  const plan = getBillingPlan(input.planId);

  if (plan.id === 'free') {
    await subscriptionsCollection.deleteOne({ ownerId: input.ownerId });

    return {
      activation: {
        planId: 'free',
        status: 'free',
        activatedAt: now.toISOString(),
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: nextEndDate.toISOString(),
        paymentStatus: 'unpaid',
        paymentProvider: 'manual-demo',
        message: 'Free plan restored successfully.',
      } satisfies SubscriptionActivationResult,
      usage: await getBillingUsageSnapshotForUser(input.ownerId, input.ownerEmail),
    };
  }

  await subscriptionsCollection.updateOne(
    { ownerId: input.ownerId },
    {
      $set: {
        ownerEmail: input.ownerEmail,
        planId: input.planId,
        status: 'active',
        paymentStatus: 'paid',
        paymentProvider: 'manual-demo',
        activatedAt: now,
        currentPeriodStart: now,
        currentPeriodEnd: nextEndDate,
        updatedAt: now,
      },
      $unset: {
        canceledAt: '',
      },
    },
    { upsert: true }
  );

  return {
    activation: {
      planId: input.planId,
      status: 'active',
      activatedAt: now.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextEndDate.toISOString(),
      paymentStatus: 'paid',
      paymentProvider: 'manual-demo',
      message: `${plan.name} plan activated successfully.`,
    } satisfies SubscriptionActivationResult,
    usage: await getBillingUsageSnapshotForUser(input.ownerId, input.ownerEmail),
  };
};
