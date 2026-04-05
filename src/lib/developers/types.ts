import type { BillingUsageSnapshot } from '@/lib/billing/types';

export interface DeveloperApiKeySummary {
  hasKey: boolean;
  keyPreview: string | null;
  createdAt: string | null;
  lastUsedAt: string | null;
  usage: BillingUsageSnapshot;
}

export interface DeveloperApiKeyIssueResult {
  plainTextKey: string;
  summary: DeveloperApiKeySummary;
}

export interface DeveloperApiKeyResponse {
  apiKey: DeveloperApiKeySummary;
  plainTextKey?: string;
  message?: string;
}
