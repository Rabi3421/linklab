'use client';

import { useState, useEffect } from 'react';
import MetricsCard from './MetricsCard';
import LinkDetailsCard from './LinkDetailsCard';
import TimelineChart from './TimelineChart';
import ReferrerTable from './ReferrerTable';
import DeviceBreakdown from './DeviceBreakdown';
import GeographicDistribution from './GeographicDistribution';
import BrowserStats from './BrowserStats';
import PeakActivityTimes from './PeakActivityTimes';
import Icon from '@/components/ui/AppIcon';

interface LinkAnalyticsInteractiveProps {
  linkCode: string;
}

export default function LinkAnalyticsInteractive({ linkCode }: LinkAnalyticsInteractiveProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [dateRange, setDateRange] = useState('7days');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const metricsData = [
    {
      title: 'Total Clicks',
      value: '12,847',
      icon: 'cursor',
      trend: { value: 23.5, isPositive: true },
      subtitle: '+3,021 this week'
    },
    {
      title: 'Unique Visitors',
      value: '8,234',
      icon: 'users',
      trend: { value: 18.2, isPositive: true },
      subtitle: '+1,498 this week'
    },
    {
      title: 'Click-Through Rate',
      value: '64.1%',
      icon: 'chart',
      trend: { value: 5.3, isPositive: true },
      subtitle: 'Above average'
    },
    {
      title: 'Avg. Daily Clicks',
      value: '1,835',
      icon: 'calendar',
      trend: { value: 12.8, isPositive: true },
      subtitle: 'Last 7 days'
    }
  ];

  const timelineData = [
    { date: '12/13', clicks: 1245, uniqueVisitors: 892 },
    { date: '12/14', clicks: 1567, uniqueVisitors: 1034 },
    { date: '12/15', clicks: 1823, uniqueVisitors: 1256 },
    { date: '12/16', clicks: 2134, uniqueVisitors: 1489 },
    { date: '12/17', clicks: 1956, uniqueVisitors: 1367 },
    { date: '12/18', clicks: 2245, uniqueVisitors: 1598 },
    { date: '12/19', clicks: 1877, uniqueVisitors: 1298 }
  ];

  const referrerData = [
    { source: 'Direct Traffic', clicks: 4523, percentage: 35.2, icon: '🔗' },
    { source: 'Twitter', clicks: 3214, percentage: 25.0, icon: '🐦' },
    { source: 'Facebook', clicks: 2156, percentage: 16.8, icon: '📘' },
    { source: 'LinkedIn', clicks: 1678, percentage: 13.1, icon: '💼' },
    { source: 'Instagram', clicks: 1276, percentage: 9.9, icon: '📷' }
  ];

  const deviceData = [
    { name: 'Desktop', value: 6234, color: '#2563EB' },
    { name: 'Mobile', value: 4823, color: '#F59E0B' },
    { name: 'Tablet', value: 1790, color: '#10B981' }
  ];

  const countryData = [
    { country: 'United States', clicks: 5234, percentage: 40.7, flag: '🇺🇸' },
    { country: 'United Kingdom', clicks: 2156, percentage: 16.8, flag: '🇬🇧' },
    { country: 'Canada', clicks: 1678, percentage: 13.1, flag: '🇨🇦' },
    { country: 'Germany', clicks: 1234, percentage: 9.6, flag: '🇩🇪' },
    { country: 'Australia', clicks: 987, percentage: 7.7, flag: '🇦🇺' }
  ];

  const browserData = [
    { browser: 'Chrome', clicks: 6234, percentage: 48.5, icon: '🌐' },
    { browser: 'Safari', clicks: 3456, percentage: 26.9, icon: '🧭' },
    { browser: 'Firefox', clicks: 1789, percentage: 13.9, icon: '🦊' },
    { browser: 'Edge', clicks: 1368, percentage: 10.7, icon: '🔷' }
  ];

  const hourlyData = [
    { hour: '12AM', clicks: 234 },
    { hour: '3AM', clicks: 156 },
    { hour: '6AM', clicks: 345 },
    { hour: '9AM', clicks: 678 },
    { hour: '12PM', clicks: 1234 },
    { hour: '3PM', clicks: 1567 },
    { hour: '6PM', clicks: 1345 },
    { hour: '9PM', clicks: 987 }
  ];

  const linkDetails = {
    originalUrl: 'https://example.com/very-long-url-path/with-multiple-parameters?utm_source=campaign&utm_medium=social',
    shortUrl: 'https://lnk.lab/abc123',
    shortCode: 'abc123',
    createdDate: '12/10/2024',
    expiryDate: '12/10/2025',
    status: 'active' as const
  };

  const handleExport = () => {
    if (!isHydrated) return;
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-[60px]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Link Analytics</h1>
          <p className="font-body text-base text-muted-foreground">Comprehensive performance insights for your shortened link</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name={isExporting ? 'ArrowPathIcon' : 'ArrowDownTrayIcon'} size={18} variant="outline" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95">
            <Icon name="ShareIcon" size={18} variant="outline" />
            Share Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimelineChart data={timelineData} />
        </div>
        <div>
          <LinkDetailsCard {...linkDetails} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferrerTable data={referrerData} />
        <DeviceBreakdown data={deviceData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeographicDistribution data={countryData} />
        <BrowserStats data={browserData} />
      </div>

      <PeakActivityTimes data={hourlyData} />

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Additional Insights</h2>
          <Icon name="InformationCircleIcon" size={20} variant="outline" className="text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-md">
            <p className="font-caption text-xs text-muted-foreground mb-1">Conversion Rate</p>
            <p className="font-heading text-2xl font-semibold text-foreground">12.4%</p>
            <p className="font-caption text-xs text-success mt-1">↑ 3.2% vs last period</p>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p className="font-caption text-xs text-muted-foreground mb-1">Avg. Session Duration</p>
            <p className="font-heading text-2xl font-semibold text-foreground">2m 34s</p>
            <p className="font-caption text-xs text-success mt-1">↑ 18s vs last period</p>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p className="font-caption text-xs text-muted-foreground mb-1">Bounce Rate</p>
            <p className="font-heading text-2xl font-semibold text-foreground">23.7%</p>
            <p className="font-caption text-xs text-error mt-1">↑ 2.1% vs last period</p>
          </div>
        </div>
      </div>
    </div>
  );
}