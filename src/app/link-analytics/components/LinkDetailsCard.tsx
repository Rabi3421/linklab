'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface LinkDetailsCardProps {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdDate: string;
  expiryDate?: string;
  status: 'active' | 'expired';
}

export default function LinkDetailsCard({
  originalUrl,
  shortUrl,
  shortCode,
  createdDate,
  expiryDate,
  status
}: LinkDetailsCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

        <div className="flex gap-3 pt-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95">
            <Icon name="QrCodeIcon" size={18} variant="outline" />
            Generate QR Code
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-body font-medium text-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-95">
            <Icon name="PencilIcon" size={18} variant="outline" />
            Edit Link
          </button>
        </div>
      </div>
    </div>
  );
}