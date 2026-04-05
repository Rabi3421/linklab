import type { BillingUsageSnapshot } from '@/lib/billing/types';

export type LinkStatus = 'active' | 'expired';

export type QrDotsStyle =
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'square'
  | 'extra-rounded';

export type QrCornerStyle =
  | 'dot'
  | 'square'
  | 'extra-rounded'
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded';

export type QrFrameStyle = 'soft' | 'glass' | 'outline';

export interface QrStyleConfig {
  presetId: string;
  foregroundColor: string;
  backgroundColor: string;
  cornerColor: string;
  dotStyle: QrDotsStyle;
  cornerStyle: QrCornerStyle;
  frameStyle: QrFrameStyle;
  logoDataUrl?: string;
}

export interface ManagedLinkRecord {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  createdAt: string;
  clicks: number;
  status: LinkStatus;
  expirationDate: string;
  shortUrl: string;
  qrCodeDataUrl: string;
  qrStyle?: QrStyleConfig;
}

export interface LinkCreationResult {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  qrCodeDataUrl: string;
  customAlias: string;
  createdAt: string;
  expirationDate: string;
  clicks: number;
  status: LinkStatus;
  qrStyle?: QrStyleConfig;
}

export interface LinkCreationApiResponse {
  link: ManagedLinkRecord;
  quota: BillingUsageSnapshot;
}

export interface LinkAnalyticsView {
  selectedCode: string;
  metrics: Array<{
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }>;
  timeline: Array<{
    date: string;
    clicks: number;
    uniqueVisitors: number;
  }>;
  referrers: Array<{
    source: string;
    clicks: number;
    percentage: number;
    icon: string;
  }>;
  devices: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  countries: Array<{
    country: string;
    clicks: number;
    percentage: number;
    flag: string;
  }>;
  browsers: Array<{
    browser: string;
    clicks: number;
    percentage: number;
    icon: string;
  }>;
  peakHours: Array<{
    hour: string;
    clicks: number;
  }>;
  linkDetails: {
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
    createdDate: string;
    expiryDate?: string;
    status: LinkStatus;
    qrCodeDataUrl: string;
    qrStyle?: QrStyleConfig;
  };
  additionalInsights: Array<{
    label: string;
    value: string;
    note: string;
    positive: boolean;
  }>;
}
