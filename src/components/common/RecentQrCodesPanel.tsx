'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StyledQrCode from '@/components/common/StyledQrCode';
import { downloadStyledQrCode } from '@/lib/links/qr-style-client';
import type { ManagedLinkRecord } from '@/lib/links/types';

interface RecentQrCodesPanelProps {
  links: ManagedLinkRecord[];
  title?: string;
  description?: string;
}

export default function RecentQrCodesPanel({
  links,
  title = 'QR Code Library',
  description = 'Download or share QR codes for your latest short links.',
}: RecentQrCodesPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleLinks = links.slice(0, 3);

  const handleCopy = async (link: ManagedLinkRecord) => {
    if (!navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownload = async (link: ManagedLinkRecord) => {
    if (link.qrStyle) {
      await downloadStyledQrCode({
        data: link.shortUrl,
        style: link.qrStyle,
        name: `${link.shortCode}-styled-qr`,
        extension: 'png',
      });
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = link.qrCodeDataUrl;
    anchor.download = `${link.shortCode}-qr.png`;
    anchor.click();
  };

  if (visibleLinks.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon name="QrCodeIcon" size={22} variant="outline" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">Create your first short link to unlock QR downloads and sharing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon name="QrCodeIcon" size={22} variant="outline" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {visibleLinks.map((link) => (
          <div key={link.id} className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">/{link.shortCode}</p>
                <p className="text-xs text-muted-foreground truncate">{link.shortUrl}</p>
              </div>
              <span className="text-xs text-muted-foreground">{link.clicks} clicks</span>
            </div>

            <div className="rounded-xl bg-card border border-border p-3 flex items-center justify-center mb-4">
              <StyledQrCode data={link.shortUrl} qrCodeDataUrl={link.qrCodeDataUrl} qrStyle={link.qrStyle} size={128} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(link)}
                className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 hover:shadow-md"
              >
                <Icon name="ArrowDownTrayIcon" size={16} variant="outline" />
                Download PNG
              </button>
              <button
                onClick={() => handleCopy(link)}
                className="flex-1 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 hover:shadow-md"
              >
                <Icon name={copiedId === link.id ? 'CheckIcon' : 'ShareIcon'} size={16} variant="outline" />
                {copiedId === link.id ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}