export type SubscriptionPlanId = 'free' | 'launch' | 'growth' | 'scale';

export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'canceled';

export type QuotaSubjectType = 'account' | 'ip';

export interface BillingUsageSnapshot {
  planId: SubscriptionPlanId;
  planName: string;
  subscriptionStatus: SubscriptionStatus;
  isPaid: boolean;
  quotaSubject: QuotaSubjectType;
  monthlyLinkLimit: number;
  linksUsedThisMonth: number;
  linksRemainingThisMonth: number;
  upgradeRequired: boolean;
  currentPeriodKey: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  resetAt: string;
}

export interface BillingPlanDefinition {
  id: SubscriptionPlanId;
  name: string;
  badge: string;
  usd: string;
  inr: string;
  cadence: string;
  seats: string;
  cta: string;
  accent: string;
  description: string;
  features: string[];
  featured: boolean;
  monthlyLinkLimit: number;
  trackedClicksLabel: string;
  customDomainsLabel: string;
  analyticsRetentionLabel: string;
}

export interface SubscriptionActivationResult {
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  activatedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  paymentStatus: 'paid' | 'unpaid';
  paymentProvider: string;
  message: string;
}
