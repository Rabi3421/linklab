'use client';

import { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import QuickCreateForm from './QuickCreateForm';
import FilterControls from './FilterControls';
import LinksTable from './LinksTable';

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  createdAt: string;
  clicks: number;
  status: 'active' | 'expired' | 'inactive';
  expirationDate: string;
}

export default function DashboardInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkData[]>([]);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const mockLinks: LinkData[] = [
        {
          id: '1',
          originalUrl: 'https://www.example.com/blog/how-to-create-effective-marketing-campaigns-2024',
          shortCode: 'mkt2024',
          customAlias: 'marketing-guide',
          createdAt: '12/15/2024',
          clicks: 1247,
          status: 'active',
          expirationDate: '06/15/2025'
        },
        {
          id: '2',
          originalUrl: 'https://shop.example.com/products/winter-collection-sale?utm_source=email',
          shortCode: 'wtr-sale',
          customAlias: 'winter-deals',
          createdAt: '12/10/2024',
          clicks: 3892,
          status: 'active',
          expirationDate: '01/31/2025'
        },
        {
          id: '3',
          originalUrl: 'https://docs.example.com/api/v2/authentication-guide',
          shortCode: 'api-auth',
          customAlias: '',
          createdAt: '12/05/2024',
          clicks: 567,
          status: 'active',
          expirationDate: ''
        },
        {
          id: '4',
          originalUrl: 'https://events.example.com/webinar/digital-transformation-2024',
          shortCode: 'webinar24',
          customAlias: 'dt-webinar',
          createdAt: '11/28/2024',
          clicks: 2134,
          status: 'expired',
          expirationDate: '12/01/2024'
        },
        {
          id: '5',
          originalUrl: 'https://support.example.com/help/getting-started-guide',
          shortCode: 'help-start',
          customAlias: '',
          createdAt: '11/20/2024',
          clicks: 892,
          status: 'active',
          expirationDate: ''
        },
        {
          id: '6',
          originalUrl: 'https://newsletter.example.com/subscribe?campaign=holiday2024',
          shortCode: 'nl-holiday',
          customAlias: 'holiday-news',
          createdAt: '11/15/2024',
          clicks: 1567,
          status: 'active',
          expirationDate: '12/31/2024'
        },
        {
          id: '7',
          originalUrl: 'https://careers.example.com/jobs/senior-developer-remote',
          shortCode: 'job-dev',
          customAlias: '',
          createdAt: '11/10/2024',
          clicks: 423,
          status: 'inactive',
          expirationDate: ''
        },
        {
          id: '8',
          originalUrl: 'https://blog.example.com/2024/trends-in-artificial-intelligence',
          shortCode: 'ai-trends',
          customAlias: 'ai-2024',
          createdAt: '11/05/2024',
          clicks: 2891,
          status: 'active',
          expirationDate: ''
        }
      ];

      setLinks(mockLinks);
      setFilteredLinks(mockLinks);
    }
  }, [isHydrated]);

  const handleCreateLink = (data: { url: string; customAlias: string; expirationDate: string }) => {
    const newLink: LinkData = {
      id: Date.now().toString(),
      originalUrl: data.url,
      shortCode: data.customAlias || Math.random().toString(36).substring(2, 8),
      customAlias: data.customAlias,
      createdAt: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      clicks: 0,
      status: 'active',
      expirationDate: data.expirationDate ? new Date(data.expirationDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''
    };

    setLinks([newLink, ...links]);
    setFilteredLinks([newLink, ...filteredLinks]);
  };

  const handleFilterChange = (filters: {
    status: string;
    dateRange: { start: string; end: string };
    search: string;
  }) => {
    let filtered = [...links];

    if (filters.status !== 'all') {
      filtered = filtered.filter(link => link.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(link => 
        link.originalUrl.toLowerCase().includes(searchLower) ||
        link.shortCode.toLowerCase().includes(searchLower) ||
        link.customAlias.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered = filtered.filter(link => {
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
    if (window.confirm('Are you sure you want to delete this link?')) {
      setLinks(links.filter(link => link.id !== id));
      setFilteredLinks(filteredLinks.filter(link => link.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, status: status as 'active' | 'expired' | 'inactive' } : link
    ));
    setFilteredLinks(filteredLinks.map(link => 
      link.id === id ? { ...link, status: status as 'active' | 'expired' | 'inactive' } : link
    ));
  };

  const stats = {
    totalLinks: links.length,
    totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
    topPerforming: links.filter(link => link.clicks > 1000).length,
    activeLinks: links.filter(link => link.status === 'active').length
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
        <DashboardStats stats={stats} />
        <QuickCreateForm onSubmit={handleCreateLink} />
        <FilterControls onFilterChange={handleFilterChange} />
        <LinksTable 
          links={filteredLinks}
          onCopy={handleCopyLink}
          onDelete={handleDeleteLink}
          onStatusChange={handleStatusChange}
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