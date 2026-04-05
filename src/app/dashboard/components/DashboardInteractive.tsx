'use client';

import { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import QuickCreateForm from './QuickCreateForm';
import FilterControls from './FilterControls';
import LinksTable from './LinksTable';
import type { ManagedLinkRecord } from '@/lib/links/types';
import type { LinkCreationApiResponse } from '@/lib/links/types';
import RecentQrCodesPanel from '@/components/common/RecentQrCodesPanel';
import type { QrStyleConfig } from '@/lib/links/types';
import type { BillingUsageSnapshot } from '@/lib/billing/types';
import SubscriptionUsagePanel from '@/components/common/SubscriptionUsagePanel';

export default function DashboardInteractive({
  initialLinks,
  initialQuota,
}: {
  initialLinks: ManagedLinkRecord[];
  initialQuota: BillingUsageSnapshot;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [links, setLinks] = useState<ManagedLinkRecord[]>(initialLinks);
  const [filteredLinks, setFilteredLinks] = useState<ManagedLinkRecord[]>(initialLinks);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [quota, setQuota] = useState<BillingUsageSnapshot>(initialQuota);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setLinks(initialLinks);
    setFilteredLinks(initialLinks);
    setQuota(initialQuota);
  }, [initialLinks, initialQuota]);

  const handleCreateLink = async (data: {
    url: string;
    customAlias: string;
    expirationDate: string;
    qrStyle: QrStyleConfig;
  }) => {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        originalUrl: data.url,
        customAlias: data.customAlias,
        expirationDate: data.expirationDate,
        qrStyle: data.qrStyle,
      }),
    });

    if (!response.ok) {
      const payload = (await response
        .json()
        .catch(() => ({ message: 'Unable to create the short link right now.' }))) as {
        message?: string;
        quota?: BillingUsageSnapshot;
      };
      if (payload.quota) {
        setQuota(payload.quota);
      }
      return {
        success: false,
        message: payload.message || 'Unable to create the short link right now.',
      };
    }

    const payload = (await response.json()) as LinkCreationApiResponse;
    setLinks((previousLinks) => [payload.link, ...previousLinks]);
    setFilteredLinks((previousLinks) => [payload.link, ...previousLinks]);
    setQuota(payload.quota);
    return { success: true };
  };

  const handleFilterChange = (filters: {
    status: string;
    dateRange: { start: string; end: string };
    search: string;
  }) => {
    let filtered = [...links];

    if (filters.status !== 'all') {
      filtered = filtered.filter((link) => link.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.originalUrl.toLowerCase().includes(searchLower) ||
          link.shortCode.toLowerCase().includes(searchLower) ||
          link.customAlias.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);

      filtered = filtered.filter((link) => {
        const linkDate = new Date(link.createdAt);
        return linkDate >= startDate && linkDate <= endDate;
      });
    }

    setFilteredLinks(filtered);
  };

  const handleCopyLink = (shortUrl: string) => {
    if (isHydrated && navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 3000);
    }
  };

  const handleDeleteLink = (id: string) => {
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

      const expirationDate = status === 'expired' ? new Date().toISOString().split('T')[0] : '';
      const response = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          originalUrl: targetLink.originalUrl,
          customAlias: targetLink.customAlias,
          expirationDate,
        }),
      });

      if (!response.ok) {
        return;
      }

      const updatedLink = (await response.json()) as ManagedLinkRecord;
      setLinks((previousLinks) =>
        previousLinks.map((link) => (link.id === id ? updatedLink : link))
      );
      setFilteredLinks((previousLinks) =>
        previousLinks.map((link) => (link.id === id ? updatedLink : link))
      );
    })();
  };

  const handleEditLink = async (
    id: string,
    data: {
      originalUrl: string;
      customAlias: string;
      expirationDate: string;
      qrStyle: QrStyleConfig;
    }
  ) => {
    const response = await fetch(`/api/links/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const payload = (await response
        .json()
        .catch(() => ({ message: 'Unable to update this link right now.' }))) as {
        message?: string;
      };
      return {
        success: false,
        message: payload.message || 'Unable to update this link right now.',
      };
    }

    const updatedLink = (await response.json()) as ManagedLinkRecord;
    setLinks((previousLinks) => previousLinks.map((link) => (link.id === id ? updatedLink : link)));
    setFilteredLinks((previousLinks) =>
      previousLinks.map((link) => (link.id === id ? updatedLink : link))
    );
    return { success: true };
  };

  const stats = {
    totalLinks: links.length,
    totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
    topPerforming: links.filter((link) => link.clicks > 1000).length,
    activeLinks: links.filter((link) => link.status === 'active').length,
  };

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <SubscriptionUsagePanel usage={quota} />
        <DashboardStats stats={stats} />
        <QuickCreateForm onSubmit={handleCreateLink} />
        <RecentQrCodesPanel
          links={links}
          title="Recent QR Codes"
          description="Download or share QR codes for the short links you created most recently."
        />
        <FilterControls onFilterChange={handleFilterChange} />
        <LinksTable
          links={filteredLinks}
          onCopy={handleCopyLink}
          onDelete={handleDeleteLink}
          onStatusChange={handleStatusChange}
          onEdit={handleEditLink}
        />
      </div>

      {showCopyNotification && (
        <div className="fixed bottom-6 right-6 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Link copied to clipboard!</span>
        </div>
      )}
    </>
  );
}
