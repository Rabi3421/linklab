import type { BillingPlanDefinition, SubscriptionPlanId } from './types';

export const billingPlans: BillingPlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    badge: 'Explore the product',
    usd: '$0',
    inr: '₹0',
    cadence: '/month',
    seats: '1 user',
    cta: 'Start free',
    accent: 'rgba(255,255,255,0.08)',
    description:
      'Best for trying branded links and basic reporting before you launch real campaigns.',
    features: [
      '5 new links / month',
      '1 shared short domain',
      '30-day analytics',
      'Basic QR exports',
      'Community support',
    ],
    featured: false,
    monthlyLinkLimit: 5,
    trackedClicksLabel: '1K',
    customDomainsLabel: '—',
    analyticsRetentionLabel: '30 days',
  },
  {
    id: 'launch',
    name: 'Launch',
    badge: 'India-friendly starter',
    usd: '$6',
    inr: '₹499',
    cadence: '/month',
    seats: '2 users',
    cta: 'Choose Launch',
    accent: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    description:
      'Benchmarked for small Indian teams that expect value near ₹500–₹600 while still needing branded links and analytics.',
    features: [
      '500 new links / month',
      '20K tracked clicks',
      '1 custom domain',
      '90-day retention',
      'UTM builder + exports',
    ],
    featured: true,
    monthlyLinkLimit: 500,
    trackedClicksLabel: '20K',
    customDomainsLabel: '1',
    analyticsRetentionLabel: '90 days',
  },
  {
    id: 'growth',
    name: 'Growth',
    badge: 'Global SMB sweet spot',
    usd: '$24',
    inr: '₹1,999',
    cadence: '/month',
    seats: '5 users',
    cta: 'Choose Growth',
    accent: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    description:
      'Positioned against public global mid-market plans in the $22–$29 range with more generous collaboration and analytics.',
    features: [
      '5K new links / month',
      '250K tracked clicks',
      '1-year analytics retention',
      '3 custom domains',
      'API + webhook access',
    ],
    featured: false,
    monthlyLinkLimit: 5000,
    trackedClicksLabel: '250K',
    customDomainsLabel: '3',
    analyticsRetentionLabel: '1 year',
  },
  {
    id: 'scale',
    name: 'Scale',
    badge: 'For high-volume teams',
    usd: '$79',
    inr: '₹6,499',
    cadence: '/month',
    seats: '20 users',
    cta: 'Talk to sales',
    accent: 'linear-gradient(135deg, #10b981, #059669)',
    description:
      'Aligned below many $69–$75+ global growth tiers while covering larger teams, richer analytics, and faster support.',
    features: [
      '25K new links / month',
      '1.5M tracked clicks',
      '3-year retention',
      '10 custom domains',
      'A/B testing + priority support',
    ],
    featured: false,
    monthlyLinkLimit: 25000,
    trackedClicksLabel: '1.5M',
    customDomainsLabel: '10',
    analyticsRetentionLabel: '3 years',
  },
];

export const billingPlanMap = new Map<SubscriptionPlanId, BillingPlanDefinition>(
  billingPlans.map((plan) => [plan.id, plan])
);

export const getBillingPlan = (planId: SubscriptionPlanId) =>
  billingPlanMap.get(planId) ?? billingPlanMap.get('free')!;
