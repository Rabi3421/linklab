'use client';

import { useMemo, useState } from 'react';
import FilterControls from '@/app/dashboard/components/FilterControls';
import LinksTable from '@/app/dashboard/components/LinksTable';
import DashboardStats from '@/app/dashboard/components/DashboardStats';

type LinkStatus = 'active' | 'expired' | 'inactive';

interface LinkRecord {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  createdAt: string;
  clicks: number;
  status: LinkStatus;
  expirationDate: string;
}

const initialLinks: LinkRecord[] = [
  {
    id: '1',
    originalUrl: 'https://linklab.so/blog/whatsapp-click-tracking',
    shortCode: 'wa-ga4',
    customAlias: 'whatsapp-ga4',
    createdAt: '04/04/2026',
    clicks: 1482,
    status: 'active',
    expirationDate: '',
  },
  {
    id: '2',
    originalUrl: 'https://linklab.so/pricing?plan=growth',
    shortCode: 'growth-in',
    customAlias: 'growth-india',
    createdAt: '04/02/2026',
    clicks: 935,
    status: 'active',
    expirationDate: '',
  },
  {
    id: '3',
    originalUrl: 'https://linklab.so/developers#webhooks',
    shortCode: 'webhooks',
    customAlias: '',
    createdAt: '03/28/2026',
    clicks: 410,
    status: 'inactive',
    expirationDate: '',
  },
  {
    id: '4',
    originalUrl: 'https://linklab.so/offers/festive-launch',
    shortCode: 'festive24',
    customAlias: 'festive-launch',
    createdAt: '03/20/2026',
    clicks: 2155,
    status: 'expired',
    expirationDate: '03/31/2026',
  },
  {
    id: '5',
    originalUrl: 'https://linklab.so/resources/link-governance-checklist',
    shortCode: 'gov-check',
    customAlias: 'governance-check',
    createdAt: '03/18/2026',
    clicks: 661,
    status: 'active',
    expirationDate: '',
  },
];

export default function MyLinksWorkspace() {
  const [links, setLinks] = useState<LinkRecord[]>(initialLinks);
  const [filteredLinks, setFilteredLinks] = useState<LinkRecord[]>(initialLinks);

  const stats = useMemo(
    () => ({
      totalLinks: filteredLinks.length,
      totalClicks: filteredLinks.reduce((sum, link) => sum + link.clicks, 0),
      topPerforming: filteredLinks.filter((link) => link.clicks >= 900).length,
      activeLinks: filteredLinks.filter((link) => link.status === 'active').length,
    }),
    [filteredLinks],
  );

  const handleFilterChange = (filters: {
    status: string;
    dateRange: { start: string; end: string };
    search: string;
  }) => {
    let nextLinks = [...links];

    if (filters.status !== 'all') {
      nextLinks = nextLinks.filter((link) => link.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      nextLinks = nextLinks.filter(
        (link) =>
          link.originalUrl.toLowerCase().includes(searchTerm) ||
          link.shortCode.toLowerCase().includes(searchTerm) ||
          link.customAlias.toLowerCase().includes(searchTerm),
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);

      nextLinks = nextLinks.filter((link) => {
        const createdAt = new Date(link.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }

    setFilteredLinks(nextLinks);
  };

  const handleCopy = async (shortUrl: string) => {
    if (!navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(shortUrl);
  };

  const handleDelete = (id: string) => {
    setLinks((previousLinks) => previousLinks.filter((link) => link.id !== id));
    setFilteredLinks((previousLinks) => previousLinks.filter((link) => link.id !== id));
  };

  const handleStatusChange = (id: string, status: string) => {
    const nextStatus = status as LinkStatus;

    setLinks((previousLinks) =>
      previousLinks.map((link) => (link.id === id ? { ...link, status: nextStatus } : link)),
    );
    setFilteredLinks((previousLinks) =>
      previousLinks.map((link) => (link.id === id ? { ...link, status: nextStatus } : link)),
    );
  };

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <FilterControls onFilterChange={handleFilterChange} />
      <LinksTable links={filteredLinks} onCopy={handleCopy} onDelete={handleDelete} onStatusChange={handleStatusChange} />
    </div>
  );
}