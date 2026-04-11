export type SubscriptionPlanId = 'free' | 'starter' | 'launch' | 'growth' | 'scale' | 'pro' | 'enterprise';

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
  usd: string; // kept for compatibility — value is now in INR (e.g. "₹0", "₹99")
  cadence: string;
  isCustomPricing?: boolean;
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

export interface LinkPackDefinition {
  id: string;
  name: string;
  badge: string;
  price: string;
  links: string;
  cta: string;
  description: string;
  perks: string[];
  highlighted: boolean;
}
