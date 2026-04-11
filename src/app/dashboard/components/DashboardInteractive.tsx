'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardStats from './DashboardStats';
import Icon from '@/components/ui/AppIcon';
import StyledQrCode from '@/components/common/StyledQrCode';
import { downloadStyledQrCode } from '@/lib/links/qr-style-client';
import type { ManagedLinkRecord } from '@/lib/links/types';
import type { BillingUsageSnapshot } from '@/lib/billing/types';

const quickActions = [
  {
    label: 'Create Link',
    description: 'Shorten a URL with a branded alias',
    icon: 'PlusCircleIcon',
    href: '/create-link',
    accent: 'bg-primary/10 text-primary',
  },
  {
    label: 'QR Generator',
    description: 'Build and download styled QR codes',
    icon: 'QrCodeIcon',
    href: '/qr-code-generator',
    accent: 'bg-amber-500/10 text-amber-400',
  },
  {
    label: 'My Links',
    description: 'Browse, filter, and manage all links',
    icon: 'LinkIcon',
    href: '/my-links',
    accent: 'bg-sky-500/10 text-sky-400',
  },
  {
    label: 'Link Analytics',
    description: 'Dive into click trends and performance',
    icon: 'ChartBarIcon',
    href: '/link-analytics',
    accent: 'bg-violet-500/10 text-violet-400',
  },
] as const;

export default function DashboardInteractive({
  initialLinks,
  initialQuota,
}: {
  initialLinks: ManagedLinkRecord[];
  initialQuota: BillingUsageSnapshot;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = {
    totalLinks: initialLinks.length,
    totalClicks: initialLinks.reduce((sum, link) => sum + link.clicks, 0),
    topPerforming: initialLinks.filter((link) => link.clicks > 1000).length,
    activeLinks: initialLinks.filter((link) => link.status === 'active').length,
  };

  const recentLinks = initialLinks.slice(0, 5);
  const recentQrLinks = initialLinks.slice(0, 3);

  const usagePercent = Math.min(
    100,
    Math.round(
      (initialQuota.linksUsedThisMonth / initialQuota.monthlyLinkLimit) * 100
    )
  );

  const handleCopy = async (link: ManagedLinkRecord) => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownloadQr = async (link: ManagedLinkRecord) => {
    if (link.qrStyle) {
      await downloadStyledQrCode({
        data: link.shortUrl,
        style: link.qrStyle,
        name: `${link.shortCode}-qr`,
        extension: 'png',
      });
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = link.qrCodeDataUrl;
    anchor.download = `${link.shortCode}-qr.png`;
    anchor.click();
  };

  return (
    <div className="space-y-6">

      {/* ── Compact quota banner ── */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name="CreditCardIcon" size={20} variant="outline" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {initialQuota.planName} plan
              <span className="ml-2 text-muted-foreground font-normal">
                · {initialQuota.linksRemainingThisMonth} / {initialQuota.monthlyLinkLimit} links remaining
              </span>
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${initialQuota.upgradeRequired ? 'bg-error' : 'bg-primary'}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{usagePercent}% used</span>
            </div>
          </div>
        </div>
        <Link
          href="/pricing"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted"
        >
          <Icon name="RocketLaunchIcon" size={16} variant="outline" />
          {initialQuota.isPaid ? 'Manage plan' : 'Upgrade'}
        </Link>
      </div>

      {/* ── Stats row ── */}
      <DashboardStats stats={stats} />

      {/* ── Quick actions launchpad ── */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-250 hover:-translate-y-[2px] hover:shadow-md hover:border-primary/30"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${action.accent}`}>
                <Icon name={action.icon} size={20} variant="solid" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom two-column section ── */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* Recent links list */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent links</h2>
              <p className="text-xs text-muted-foreground">Your 5 most recently created short links</p>
            </div>
            <Link
              href="/my-links"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline flex-shrink-0"
            >
              View all
              <Icon name="ArrowRightIcon" size={13} variant="outline" />
            </Link>
          </div>

          {recentLinks.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Icon name="LinkIcon" size={28} variant="outline" className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No links yet.</p>
              <Link href="/create-link" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Create your first link
                <Icon name="ArrowRightIcon" size={13} variant="outline" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {link.shortUrl}
                    </p>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {link.clicks} clicks
                    </span>
                    <button
                      onClick={() => handleCopy(link)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted"
                    >
                      <Icon
                        name={copiedId === link.id ? 'CheckIcon' : 'ClipboardDocumentIcon'}
                        size={13}
                        variant="outline"
                        className={copiedId === link.id ? 'text-success' : ''}
                      />
                      {copiedId === link.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent QR codes */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent QR codes</h2>
              <p className="text-xs text-muted-foreground">Download or share your latest QRs</p>
            </div>
            <Link
              href="/qr-code-generator"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline flex-shrink-0"
            >
              Generate
              <Icon name="ArrowRightIcon" size={13} variant="outline" />
            </Link>
          </div>

          {recentQrLinks.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Icon name="QrCodeIcon" size={28} variant="outline" className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No QR codes yet.</p>
              <Link href="/create-link" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Create a link to generate one
                <Icon name="ArrowRightIcon" size={13} variant="outline" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentQrLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-shrink-0 rounded-lg border border-border bg-background p-1.5">
                    <StyledQrCode
                      data={link.shortUrl}
                      qrCodeDataUrl={link.qrCodeDataUrl}
                      qrStyle={link.qrStyle}
                      size={52}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">/{link.shortCode}</p>
                    <p className="text-xs text-muted-foreground">{link.clicks} clicks</p>
                  </div>
                  <button
                    onClick={() => handleDownloadQr(link)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted"
                  >
                    <Icon name="ArrowDownTrayIcon" size={13} variant="outline" />
                    PNG
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
