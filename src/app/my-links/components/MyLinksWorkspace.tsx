'use client';

import { useMemo, useState } from 'react';
import FilterControls from '@/app/dashboard/components/FilterControls';
import LinksTable from '@/app/dashboard/components/LinksTable';
import DashboardStats from '@/app/dashboard/components/DashboardStats';
import type { ManagedLinkRecord, QrStyleConfig } from '@/lib/links/types';
import RecentQrCodesPanel from '@/components/common/RecentQrCodesPanel';

type LinkStatus = 'active' | 'expired';

export default function MyLinksWorkspace({ initialLinks }: { initialLinks: ManagedLinkRecord[] }) {
  const [links, setLinks] = useState<ManagedLinkRecord[]>(initialLinks);
  const [filteredLinks, setFilteredLinks] = useState<ManagedLinkRecord[]>(initialLinks);

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
    return (async () => {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        return;
      }

      setLinks((previousLinks) => previousLinks.filter((link) => link.id !== id));
      setFilteredLinks((previousLinks) => previousLinks.filter((link) => link.id !== id));
    })();
  };

  const handleStatusChange = (id: string, status: string) => {
    return (async () => {
      const targetLink = links.find((link) => link.id === id);

      if (!targetLink) {
        return;
      }

      const response = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          originalUrl: targetLink.originalUrl,
          customAlias: targetLink.customAlias,
          expirationDate: status === 'expired' ? new Date().toISOString().split('T')[0] : '',
        }),
      });

      if (!response.ok) {
        return;
      }

      const updatedLink = (await response.json()) as ManagedLinkRecord;
      setLinks((previousLinks) => previousLinks.map((link) => (link.id === id ? updatedLink : link)));
      setFilteredLinks((previousLinks) => previousLinks.map((link) => (link.id === id ? updatedLink : link)));
    })();
  };

  const handleEdit = async (id: string, data: { originalUrl: string; customAlias: string; expirationDate: string; qrStyle: QrStyleConfig }) => {
    const response = await fetch(`/api/links/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ message: 'Unable to update this link right now.' }))) as { message?: string };
      return { success: false, message: payload.message || 'Unable to update this link right now.' };
    }

    const updatedLink = (await response.json()) as ManagedLinkRecord;
    setLinks((previousLinks) => previousLinks.map((link) => (link.id === id ? updatedLink : link)));
    setFilteredLinks((previousLinks) => previousLinks.map((link) => (link.id === id ? updatedLink : link)));
    return { success: true };
  };

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <RecentQrCodesPanel links={links} title="My QR Codes" description="Quickly download and share QR codes for your highest-priority links." />
      <FilterControls onFilterChange={handleFilterChange} />
      <LinksTable links={filteredLinks} onCopy={handleCopy} onDelete={handleDelete} onStatusChange={handleStatusChange} onEdit={handleEdit} />
    </div>
  );
}