'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import QuickCreateForm from '@/app/dashboard/components/QuickCreateForm';
import type { LinkCreationApiResponse, ManagedLinkRecord, QrStyleConfig } from '@/lib/links/types';
import type { BillingUsageSnapshot } from '@/lib/billing/types';
import SubscriptionUsagePanel from '@/components/common/SubscriptionUsagePanel';

export default function CreateLinkWorkspace({
  initialLinks,
  initialQuota,
}: {
  initialLinks: ManagedLinkRecord[];
  initialQuota: BillingUsageSnapshot;
}) {
  const [createdLinks, setCreatedLinks] = useState<ManagedLinkRecord[]>(initialLinks);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [quota, setQuota] = useState<BillingUsageSnapshot>(initialQuota);

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
    setCreatedLinks((previousLinks) => [payload.link, ...previousLinks]);
    setQuota(payload.quota);
    return { success: true };
  };

  const handleCopy = async (linkId: string, shortUrl: string) => {
    if (!navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(shortUrl);
    setCopiedLinkId(linkId);
    window.setTimeout(() => setCopiedLinkId(null), 1800);
  };

  const creationInsights = useMemo(
    () => [
      {
        label: 'Links created today',
        value: createdLinks.length.toString(),
        note: 'Keep campaign names consistent for cleaner reporting.',
      },
      {
        label: 'Custom aliases used',
        value: createdLinks.filter((link) => link.customAlias).length.toString(),
        note: 'Branded aliases improve trust inside WhatsApp and email.',
      },
      {
        label: 'Expiring links',
        value: createdLinks.filter((link) => link.expirationDate).length.toString(),
        note: 'Use expiration for time-bound launches and flash campaigns.',
      },
    ],
    [createdLinks]
  );

  return (
    <div className="space-y-6">
      <SubscriptionUsagePanel
        usage={quota}
        title="Monthly creation allowance"
        description="See your remaining monthly link allowance before you launch the next campaign."
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <QuickCreateForm onSubmit={handleCreateLink} />

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name="SparklesIcon" size={22} variant="solid" className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Creation tips</h2>
              <p className="text-sm text-muted-foreground">
                A few defaults that usually improve performance
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {creationInsights.map((insight) => (
              <div key={insight.label} className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  {insight.label}
                </p>
                <p className="text-2xl font-semibold text-foreground mb-1">{insight.value}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{insight.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recently created links</h2>
            <p className="text-sm text-muted-foreground">
              Review, copy, and reuse your newest short links
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="BoltIcon" size={18} variant="outline" />
            Fast-launch workflow
          </div>
        </div>

        <div className="divide-y divide-border">
          {createdLinks.map((link) => (
            <div
              key={link.id}
              className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate" title={link.originalUrl}>
                  {link.originalUrl}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary font-medium">
                    {link.shortUrl}
                  </span>
                  <span>Created {link.createdAt}</span>
                  {link.expirationDate && <span>Expires {link.expirationDate}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopy(link.id, link.shortUrl)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium transition-all duration-250 hover:bg-muted/80 flex items-center gap-2"
                >
                  <Icon
                    name={copiedLinkId === link.id ? 'CheckIcon' : 'ClipboardDocumentIcon'}
                    size={18}
                    variant="outline"
                  />
                  {copiedLinkId === link.id ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
