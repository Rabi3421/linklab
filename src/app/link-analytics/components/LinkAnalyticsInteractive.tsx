'use client';

import { useState } from 'react';
import MetricsCard from './MetricsCard';
import LinkDetailsCard from './LinkDetailsCard';
import TimelineChart from './TimelineChart';
import ReferrerTable from './ReferrerTable';
import DeviceBreakdown from './DeviceBreakdown';
import GeographicDistribution from './GeographicDistribution';
import BrowserStats from './BrowserStats';
import PeakActivityTimes from './PeakActivityTimes';
import Icon from '@/components/ui/AppIcon';
import type { LinkAnalyticsView } from '@/lib/links/types';

interface LinkAnalyticsInteractiveProps {
  analytics: LinkAnalyticsView | null;
}

export default function LinkAnalyticsInteractive({ analytics }: LinkAnalyticsInteractiveProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  if (!analytics) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="ChartBarIcon" size={24} variant="outline" />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">No analytics yet</h2>
        <p className="font-body text-muted-foreground max-w-[520px] mx-auto">
          Create a short link and start sharing it. Once visitors click it, LinkLab will show click timeline, referrers, devices, countries, browsers, QR code, and peak activity data here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Link Analytics</h1>
          <p className="font-body text-base text-muted-foreground">Detailed performance insights for <span className="text-primary font-medium">/{analytics.selectedCode}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name={isExporting ? 'ArrowPathIcon' : 'ArrowDownTrayIcon'} size={18} variant="outline" className={isExporting ? 'animate-spin' : ''} />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(analytics.linkDetails.shortUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95"
          >
            <Icon name="ShareIcon" size={18} variant="outline" />
            Share Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.metrics.map((metric) => (
          <MetricsCard key={metric.title} {...metric} icon="layers" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimelineChart data={analytics.timeline} />
        </div>
        <div>
          <LinkDetailsCard {...analytics.linkDetails} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferrerTable data={analytics.referrers} />
        <DeviceBreakdown data={analytics.devices} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeographicDistribution data={analytics.countries} />
        <BrowserStats data={analytics.browsers} />
      </div>

      <PeakActivityTimes data={analytics.peakHours} />

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Additional Insights</h2>
          <Icon name="InformationCircleIcon" size={20} variant="outline" className="text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.additionalInsights.map((insight) => (
            <div key={insight.label} className="p-4 bg-muted rounded-md">
              <p className="font-caption text-xs text-muted-foreground mb-1">{insight.label}</p>
              <p className="font-heading text-2xl font-semibold text-foreground">{insight.value}</p>
              <p className={`font-caption text-xs mt-1 ${insight.positive ? 'text-success' : 'text-error'}`}>{insight.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}