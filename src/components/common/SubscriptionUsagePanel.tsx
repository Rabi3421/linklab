import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import type { BillingUsageSnapshot } from '@/lib/billing/types';

interface SubscriptionUsagePanelProps {
  usage: BillingUsageSnapshot;
  title?: string;
  description?: string;
}

const formatResetDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function SubscriptionUsagePanel({
  usage,
  title = 'Monthly link quota',
  description = 'Track how many short links you can still create before the monthly reset.',
}: SubscriptionUsagePanelProps) {
  const usagePercent = Math.min(
    100,
    Math.round((usage.linksUsedThisMonth / usage.monthlyLinkLimit) * 100)
  );

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[720px]">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Icon name="CreditCardIcon" size={22} variant="outline" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Plan</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{usage.planName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {usage.isPaid ? 'Paid monthly subscription' : 'Free monthly allowance'}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Remaining</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {usage.linksRemainingThisMonth} / {usage.monthlyLinkLimit}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Resets on {formatResetDate(usage.resetAt)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Used this month
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {usage.linksUsedThisMonth}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {usage.quotaSubject === 'account'
                  ? 'Tracked against your account quota'
                  : 'Tracked against your visitor IP quota'}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-[220px] rounded-lg border border-border bg-background/70 p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quota usage</span>
            <span className="font-medium text-foreground">{usagePercent}%</span>
          </div>
          <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                usage.upgradeRequired ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {usage.upgradeRequired
              ? 'You have reached this month’s link quota.'
              : `${usage.linksRemainingThisMonth} links left before your monthly reset.`}
          </p>
          <Link
            href="/pricing"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-250 hover:-translate-y-[1px] hover:shadow-md"
          >
            <Icon name="RocketLaunchIcon" size={18} variant="outline" />
            {usage.isPaid ? 'Manage plan' : 'Upgrade plan'}
          </Link>
        </div>
      </div>
    </section>
  );
}
