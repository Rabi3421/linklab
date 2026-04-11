'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { DeveloperApiKeySummary } from '@/lib/developers/types';
import ApiDocsPanel from './ApiDocsPanel';
import PricingModal from '@/components/common/PricingModal';
import type { SubscriptionPlanId } from '@/lib/billing/types';

type LoadState = 'loading' | 'idle' | 'generating' | 'revoking';

export default function ApiKeysWorkspace() {
  const [summary, setSummary] = useState<DeveloperApiKeySummary | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [plainTextKey, setPlainTextKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  useEffect(() => {
    void fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoadState('loading');
    setError('');
    try {
      const res = await fetch('/api/developers/api-key', { credentials: 'include' });
      if (!res.ok) throw new Error('Unable to load API key status.');
      const data = (await res.json()) as { apiKey: DeveloperApiKeySummary };
      setSummary(data.apiKey);
    } catch {
      setError('Unable to load API key status. Please refresh the page.');
    } finally {
      setLoadState('idle');
    }
  };

  const handleGenerate = async () => {
    setLoadState('generating');
    setError('');
    setPlainTextKey(null);
    try {
      const res = await fetch('/api/developers/api-key', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(payload.message || 'Unable to generate API key.');
      }
      const data = (await res.json()) as {
        apiKey: DeveloperApiKeySummary;
        plainTextKey: string;
      };
      setSummary(data.apiKey);
      setPlainTextKey(data.plainTextKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate API key.');
    } finally {
      setLoadState('idle');
    }
  };

  const handleRevoke = async () => {
    setLoadState('revoking');
    setError('');
    setShowRevokeConfirm(false);
    setPlainTextKey(null);
    try {
      const res = await fetch('/api/developers/api-key', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Unable to revoke API key.');
      const data = (await res.json()) as { apiKey: DeveloperApiKeySummary };
      setSummary(data.apiKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to revoke API key.');
    } finally {
      setLoadState('idle');
    }
  };

  const handleCopy = async () => {
    if (!plainTextKey) return;
    await navigator.clipboard.writeText(plainTextKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isBusy = loadState === 'loading' || loadState === 'generating' || loadState === 'revoking';

  return (
    <>
    <div className="space-y-6">

      {/* ── Quota / usage banner ── */}
      {loadState === 'loading' ? (
        <div className="animate-pulse rounded-xl border border-border bg-card px-6 py-5">
          <div className="h-4 w-32 rounded bg-muted mb-3" />
          <div className="flex gap-4">
            <div className="h-14 flex-1 rounded-lg bg-muted" />
            <div className="h-14 flex-1 rounded-lg bg-muted" />
            <div className="h-14 flex-1 rounded-lg bg-muted" />
            <div className="h-14 flex-1 rounded-lg bg-muted" />
          </div>
        </div>
      ) : summary ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* top strip */}
          <div className="flex flex-col gap-4 px-6 py-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="CreditCardIcon" size={20} variant="outline" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {summary.usage.planName} plan
                  <span className={`ml-2 text-xs font-normal ${
                    summary.usage.upgradeRequired ? 'text-error' : 'text-muted-foreground'
                  }`}>
                    {summary.usage.upgradeRequired
                      ? '· Quota reached'
                      : `· ${summary.usage.linksRemainingThisMonth} of ${summary.usage.monthlyLinkLimit} links remaining`}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Resets on {new Date(summary.usage.resetAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPricingModalOpen(true)}
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <Icon name="RocketLaunchIcon" size={15} variant="outline" />
              {summary.usage.isPaid ? 'Manage plan' : 'Upgrade plan'}
            </button>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
            {[
              {
                label: 'Used this month',
                value: summary.usage.linksUsedThisMonth,
                sub: `of ${summary.usage.monthlyLinkLimit} total`,
                icon: 'LinkIcon',
                accent: 'text-primary',
              },
              {
                label: 'Remaining',
                value: summary.usage.linksRemainingThisMonth,
                sub: summary.usage.upgradeRequired ? 'Limit reached' : 'links left',
                icon: 'BoltIcon',
                accent: summary.usage.upgradeRequired ? 'text-error' : 'text-success',
              },
              {
                label: 'Monthly limit',
                value: summary.usage.monthlyLinkLimit,
                sub: summary.usage.isPaid ? 'Paid plan' : 'Free plan',
                icon: 'ChartBarIcon',
                accent: 'text-amber-400',
              },
              {
                label: 'Quota used',
                value: `${Math.min(100, Math.round((summary.usage.linksUsedThisMonth / summary.usage.monthlyLinkLimit) * 100))}%`,
                sub: 'of monthly allowance',
                icon: 'ArrowTrendingUpIcon',
                accent: 'text-violet-400',
                isProgress: true,
                percent: Math.min(100, Math.round((summary.usage.linksUsedThisMonth / summary.usage.monthlyLinkLimit) * 100)),
                isOver: summary.usage.upgradeRequired,
              },
            ].map((tile) => (
              <div key={tile.label} className="flex flex-col gap-1 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{tile.label}</p>
                <p className={`text-2xl font-bold ${tile.accent}`}>{tile.value}</p>
                {'isProgress' in tile && tile.isProgress ? (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${'isOver' in tile && tile.isOver ? 'bg-error' : 'bg-primary'}`}
                      style={{ width: `${'percent' in tile ? tile.percent : 0}%` }}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{tile.sub}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Key status card ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Icon name="KeyIcon" size={20} variant="solid" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Your API key</h2>
            <p className="text-xs text-muted-foreground">
              One key per account. Rotate at any time — old key is immediately invalidated.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Loading skeleton */}
          {loadState === 'loading' && (
            <div className="space-y-3 animate-pulse">
              <div className="h-12 rounded-lg bg-muted w-full" />
              <div className="h-4 rounded bg-muted w-48" />
            </div>
          )}

          {/* Plain text key reveal — only shown once after generate */}
          {plainTextKey && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="ExclamationTriangleIcon" size={18} variant="solid" className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-amber-300">
                  Copy this key now — it will never be shown again.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-background/60 px-4 py-3">
                <code className="flex-1 font-mono text-sm text-foreground break-all select-all">
                  {plainTextKey}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-success/15 border border-success/40 text-success'
                    : 'bg-primary text-primary-foreground hover:-translate-y-[1px] hover:shadow-md'
                }`}
              >
                <Icon
                  name={copied ? 'CheckIcon' : 'ClipboardDocumentIcon'}
                  size={16}
                  variant="solid"
                />
                {copied ? 'Copied to clipboard!' : 'Copy API key'}
              </button>
            </div>
          )}

          {/* Key summary row */}
          {loadState !== 'loading' && summary && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${summary.hasKey ? 'bg-success' : 'bg-muted-foreground'}`} />
                  <p className="text-sm font-semibold text-foreground">
                    {summary.hasKey ? 'Active' : 'No key generated'}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">Key preview</p>
                <p className="text-sm font-mono font-semibold text-foreground">
                  {summary.keyPreview ?? '—'}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">Last used</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(summary.lastUsedAt)}</p>
              </div>
            </div>
          )}

          {/* Copy nudge — shown when key exists but was generated in a previous session */}
          {loadState !== 'loading' && summary?.hasKey && !plainTextKey && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
              <Icon name="InformationCircleIcon" size={16} variant="solid" className="flex-shrink-0 text-muted-foreground" />
              <p className="flex-1 text-xs text-muted-foreground">
                The full key is only visible once at generation time. To get a new copyable key, click <span className="font-semibold text-foreground">Rotate key</span> below.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="flex items-center gap-2 text-sm text-error">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
              {error}
            </p>
          )}

          {/* Actions */}
          {loadState !== 'loading' && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60"
              >
                <Icon
                  name={loadState === 'generating' ? 'ArrowPathIcon' : 'KeyIcon'}
                  size={16}
                  variant="solid"
                  className={loadState === 'generating' ? 'animate-spin' : ''}
                />
                {loadState === 'generating'
                  ? 'Generating…'
                  : summary?.hasKey
                    ? 'Rotate key'
                    : 'Generate key'}
              </button>

              {summary?.hasKey && !showRevokeConfirm && (
                <button
                  onClick={() => setShowRevokeConfirm(true)}
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 rounded-lg border border-error/40 bg-error/8 px-5 py-2.5 text-sm font-semibold text-error transition-all hover:bg-error/15 disabled:opacity-60"
                >
                  <Icon name="TrashIcon" size={16} variant="outline" />
                  Revoke key
                </button>
              )}

              {showRevokeConfirm && (
                <div className="flex items-center gap-2 rounded-lg border border-error/40 bg-error/8 px-4 py-2">
                  <p className="text-sm text-error font-medium">Are you sure?</p>
                  <button
                    onClick={handleRevoke}
                    disabled={isBusy}
                    className="rounded-md bg-error px-3 py-1 text-xs font-semibold text-white transition hover:bg-error/90 disabled:opacity-60"
                  >
                    {loadState === 'revoking' ? 'Revoking…' : 'Yes, revoke'}
                  </button>
                  <button
                    onClick={() => setShowRevokeConfirm(false)}
                    className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground transition hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>



      {/* ── API Reference ── */}
      <ApiDocsPanel />

      {/* ── Security tips ── */}
      <div className="rounded-xl border border-border bg-muted/20 px-6 py-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Security best practices</h3>
        <ul className="space-y-2">
          {[
            'Never expose your API key in client-side code or public repositories.',
            'Store keys in environment variables (e.g. .env) and never commit them.',
            'Rotate your key immediately if you suspect it has been compromised.',
            'Each account supports one active key — rotating invalidates the previous key instantly.',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Icon name="ShieldCheckIcon" size={15} variant="solid" className="flex-shrink-0 mt-0.5 text-success" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>

      {/* ── Pricing modal ── */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        currentPlanId={(summary?.usage.planId ?? 'free') as SubscriptionPlanId}
      />
    </>
  );
}
