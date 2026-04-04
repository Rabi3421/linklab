'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ShortenedResultProps {
  originalUrl: string;
  shortCode: string;
  onClose: () => void;
}

const ShortenedResult = ({ originalUrl, shortCode, onClose }: ShortenedResultProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const shortUrl = `linklab.io/${shortCode}`;

  const handleCopy = async () => {
    if (!isHydrated) return;
    try {
      await navigator.clipboard.writeText(`https://${shortUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isHydrated) {
    return (
      <div className="rounded-2xl p-6 mb-8 animate-pulse" style={{ background: '#252830', border: '1px solid rgba(200,205,220,0.14)' }}>
        <div className="h-6 bg-white/10 rounded mb-4 w-48" />
        <div className="h-12 bg-white/5 rounded" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 mb-8"
      style={{ background: '#252830', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 30px rgba(16,185,129,0.08)' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <Icon name="CheckCircleIcon" size={22} variant="solid" />
          <h3 className="font-heading font-semibold text-lg text-white">Link shortened!</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/30 transition-all duration-200 hover:text-white/70 hover:bg-white/8"
          aria-label="Close result"
        >
          <Icon name="XMarkIcon" size={18} variant="outline" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="font-body text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Original URL</label>
          <p className="font-mono text-sm text-white/50 bg-white/4 border border-white/8 px-4 py-2.5 rounded-lg truncate">
            {originalUrl}
          </p>
        </div>
        <div>
          <label className="font-body text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Short URL</label>
          <div className="flex gap-2">
            <div className="flex-1 font-mono text-base text-amber-400 bg-white/5 border border-amber-500/25 px-4 py-3 rounded-lg">
              {shortUrl}
            </div>
            <button
              onClick={handleCopy}
              className="px-5 font-body font-semibold text-sm text-white rounded-lg transition-all duration-250 hover:-translate-y-0.5 flex items-center gap-2"
              style={{ background: copied ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
            >
              <Icon name={copied ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={16} variant="outline" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-white/8 flex flex-col sm:flex-row gap-3">
        <a
          href="/register"
          className="flex-1 text-center px-5 py-3 font-body font-semibold text-sm text-white rounded-xl transition-all duration-250 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
        >
          Track analytics — create account
        </a>
        <button
          onClick={onClose}
          className="flex-1 px-5 py-3 font-body font-semibold text-sm text-white/60 rounded-xl border border-white/10 bg-white/4 transition-all duration-250 hover:bg-white/8 hover:text-white"
        >
          Shorten another link
        </button>
      </div>
    </div>
  );
};

export default ShortenedResult;