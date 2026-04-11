'use client';

import Link from 'next/link';

interface OverviewStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  totalSubscriptions: number;
  newUsersThisMonth: number;
  newLinksThisMonth: number;
  clicksThisMonth: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  sub: string;
  iconPath: string;
  accentClass: string;
}

function StatCard({ title, value, sub, iconPath, accentClass }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 transition-all duration-250 ease-smooth hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">{sub}</p>
        </div>
        <div className={`p-3 rounded-lg ${accentClass}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  iconPath: string;
}

function QuickLinkCard({ title, description, href, iconPath }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="bg-card rounded-lg border border-border p-5 flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all duration-250 group"
    >
      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function AdminOverviewInteractive({ stats }: { stats: OverviewStats }) {
  const cards: StatCardProps[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      sub: `+${stats.newUsersThisMonth} new this month`,
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      accentClass: 'bg-blue-500/10',
    },
    {
      title: 'Total Links',
      value: stats.totalLinks,
      sub: `+${stats.newLinksThisMonth} created this month`,
      iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      accentClass: 'bg-success/10',
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks,
      sub: `${stats.clicksThisMonth.toLocaleString()} clicks this month`,
      iconPath: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
      accentClass: 'bg-primary/10',
    },
    {
      title: 'Active Subscriptions',
      value: stats.totalSubscriptions,
      sub: 'Paid plans currently active',
      iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      accentClass: 'bg-warning/10',
    },
  ];

  const quickLinks: QuickLinkCardProps[] = [
    {
      title: 'Manage Users',
      description: 'View, search, and inspect all registered accounts',
      href: '/admin/users',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      title: 'All Links',
      description: 'Browse every short link created on the platform',
      href: '/admin/links',
      iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    },
    {
      title: 'QR Codes',
      description: 'Browse all generated QR codes across the platform',
      href: '/admin/qrcodes',
      iconPath: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
    },
    {
      title: 'Payments & Plans',
      description: 'Review subscriptions and billing records',
      href: '/admin/payments',
      iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      {/* Quick navigation */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((q) => (
            <QuickLinkCard key={q.href} {...q} />
          ))}
        </div>
      </div>
    </div>
  );
}
