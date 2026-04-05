'use client';

import { useState } from 'react';
import StyledQrCode from '@/components/common/StyledQrCode';
import Icon from '@/components/ui/AppIcon';
import { downloadStyledQrCode } from '@/lib/links/qr-style-client';
import type { QrStyleConfig } from '@/lib/links/types';

interface LinkDetailsCardProps {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdDate: string;
  expiryDate?: string;
  status: 'active' | 'expired';
  qrCodeDataUrl: string;
  qrStyle?: QrStyleConfig;
}

export default function LinkDetailsCard({
  originalUrl,
  shortUrl,
  shortCode,
  createdDate,
  expiryDate,
  status,
  qrCodeDataUrl,
  qrStyle,
}: LinkDetailsCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = async () => {
    if (qrStyle) {
      await downloadStyledQrCode({
        data: shortUrl,
        style: qrStyle,
        name: `${shortCode}-styled-qr`,
        extension: 'png',
      });
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = qrCodeDataUrl;
    anchor.download = `${shortCode}-qr.png`;
    anchor.click();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Link Details</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error'
        }`}>
          {status === 'active' ? 'Active' : 'Expired'}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-body text-sm text-muted-foreground mb-2 block">Original URL</label>
          <div className="flex items-center gap-2 bg-muted rounded-md p-3">
            <p className="font-mono text-sm text-foreground flex-1 truncate">{originalUrl}</p>
            <button
              onClick={() => handleCopy(originalUrl, 'original')}
              className="p-2 rounded-md transition-all duration-250 ease-smooth hover:bg-background active:scale-95"
              aria-label="Copy original URL"
            >
              <Icon 
                name={copiedField === 'original' ? 'CheckIcon' : 'ClipboardDocumentIcon'} 
                size={18} 
                variant="outline"
                className={copiedField === 'original' ? 'text-success' : 'text-foreground'}
              />
            </button>
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-muted-foreground mb-2 block">Short URL</label>
          <div className="flex items-center gap-2 bg-muted rounded-md p-3">
            <p className="font-mono text-sm text-primary flex-1 truncate">{shortUrl}</p>
            <button
              onClick={() => handleCopy(shortUrl, 'short')}
              className="p-2 rounded-md transition-all duration-250 ease-smooth hover:bg-background active:scale-95"
              aria-label="Copy short URL"
            >
              <Icon 
                name={copiedField === 'short' ? 'CheckIcon' : 'ClipboardDocumentIcon'} 
                size={18} 
                variant="outline"
                className={copiedField === 'short' ? 'text-success' : 'text-foreground'}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label className="font-body text-sm text-muted-foreground mb-1 block">Short Code</label>
            <p className="font-mono text-sm text-foreground">{shortCode}</p>
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground mb-1 block">Created Date</label>
            <p className="font-body text-sm text-foreground">{createdDate}</p>
          </div>
          {expiryDate && (
            <div className="sm:col-span-2">
              <label className="font-body text-sm text-muted-foreground mb-1 block">Expiry Date</label>
              <p className="font-body text-sm text-foreground">{expiryDate}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <label className="font-body text-sm text-muted-foreground mb-3 block">QR Code</label>
          <div className="rounded-lg bg-muted border border-border p-4 flex flex-col items-center gap-4">
            <StyledQrCode data={shortUrl} qrCodeDataUrl={qrCodeDataUrl} qrStyle={qrStyle} size={160} imageClassName="border border-border bg-background p-2" />
            <div className="flex w-full gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95"
              >
                <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
                Download PNG
              </button>
              <button
                onClick={() => handleCopy(shortUrl, 'share')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95"
              >
                <Icon name={copiedField === 'share' ? 'CheckIcon' : 'ShareIcon'} size={18} variant="outline" />
                {copiedField === 'share' ? 'Copied' : 'Share Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}