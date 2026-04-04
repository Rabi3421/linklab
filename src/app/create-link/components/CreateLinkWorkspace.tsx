'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import QuickCreateForm from '@/app/dashboard/components/QuickCreateForm';

interface CreatedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  customAlias: string;
  createdAt: string;
  expirationDate: string;
}

export default function CreateLinkWorkspace() {
  const [createdLinks, setCreatedLinks] = useState<CreatedLink[]>([
    {
      id: '1',
      originalUrl: 'https://linklab.so/resources/launch-playbook',
      shortUrl: 'https://lnk.lab/launch-playbook',
      customAlias: 'launch-playbook',
      createdAt: '04/04/2026',
      expirationDate: '',
    },
    {
      id: '2',
      originalUrl: 'https://linklab.so/pricing?source=campaign',
      shortUrl: 'https://lnk.lab/pricing-india',
      customAlias: 'pricing-india',
      createdAt: '04/03/2026',
      expirationDate: '05/03/2026',
    },
  ]);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const handleCreateLink = (data: { url: string; customAlias: string; expirationDate: string }) => {
    const slug = data.customAlias || Math.random().toString(36).slice(2, 8);
    const createdAt = new Date().toLocaleDateString('en-US');

    const nextLink: CreatedLink = {
      id: Date.now().toString(),
      originalUrl: data.url,
      shortUrl: `https://lnk.lab/${slug}`,
      customAlias: data.customAlias,
      createdAt,
      expirationDate: data.expirationDate
        ? new Date(data.expirationDate).toLocaleDateString('en-US')
        : '',
    };

    setCreatedLinks((previousLinks) => [nextLink, ...previousLinks]);
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
        value: createdLinks.length > 2 ? '3' : '2',
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
    [createdLinks],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <QuickCreateForm onSubmit={handleCreateLink} />

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name="SparklesIcon" size={22} variant="solid" className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Creation tips</h2>
              <p className="text-sm text-muted-foreground">A few defaults that usually improve performance</p>
            </div>
          </div>

          <div className="space-y-4">
            {creationInsights.map((insight) => (
              <div key={insight.label} className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">{insight.label}</p>
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
            <p className="text-sm text-muted-foreground">Review, copy, and reuse your newest short links</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="BoltIcon" size={18} variant="outline" />
            Fast-launch workflow
          </div>
        </div>

        <div className="divide-y divide-border">
          {createdLinks.map((link) => (
            <div key={link.id} className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate" title={link.originalUrl}>{link.originalUrl}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary font-medium">{link.shortUrl}</span>
                  <span>Created {link.createdAt}</span>
                  {link.expirationDate && <span>Expires {link.expirationDate}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopy(link.id, link.shortUrl)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium transition-all duration-250 hover:bg-muted/80 flex items-center gap-2"
                >
                  <Icon name={copiedLinkId === link.id ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={18} variant="outline" />
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