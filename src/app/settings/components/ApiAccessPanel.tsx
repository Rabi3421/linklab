'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { DeveloperApiKeyResponse, DeveloperApiKeySummary } from '@/lib/developers/types';

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Never';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function ApiAccessPanel() {
  const [apiKey, setApiKey] = useState<DeveloperApiKeySummary | null>(null);
  const [plainTextKey, setPlainTextKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadApiKey = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/developers/api-key', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = (await response
        .json()
        .catch(() => ({ message: 'Unable to load API access.' }))) as
        | DeveloperApiKeyResponse
        | { message?: string };

      if (!response.ok || !('apiKey' in payload)) {
        setErrorMessage(payload.message || 'Unable to load API access.');
        setApiKey(null);
        return;
      }

      setApiKey(payload.apiKey);
    } catch {
      setErrorMessage('Unable to load API access right now.');
      setApiKey(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApiKey();
  }, []);

  const handleGenerate = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const response = await fetch('/api/developers/api-key', {
        method: 'POST',
        credentials: 'include',
      });

      const payload = (await response
        .json()
        .catch(() => ({ message: 'Unable to generate an API key.' }))) as
        | DeveloperApiKeyResponse
        | { message?: string };

      if (!response.ok || !('apiKey' in payload)) {
        setErrorMessage(payload.message || 'Unable to generate an API key.');
        return;
      }

      setApiKey(payload.apiKey);
      setPlainTextKey(payload.plainTextKey || '');
      setStatusMessage(payload.message || 'API key generated successfully.');
    } catch {
      setErrorMessage('Unable to generate an API key right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    if (
      !window.confirm(
        'Revoke your current API key? Existing integrations will stop working immediately.'
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const response = await fetch('/api/developers/api-key', {
        method: 'DELETE',
        credentials: 'include',
      });

      const payload = (await response
        .json()
        .catch(() => ({ message: 'Unable to revoke the API key.' }))) as
        | DeveloperApiKeyResponse
        | { message?: string };

      if (!response.ok || !('apiKey' in payload)) {
        setErrorMessage(payload.message || 'Unable to revoke the API key.');
        return;
      }

      setApiKey(payload.apiKey);
      setPlainTextKey('');
      setStatusMessage(payload.message || 'API key revoked successfully.');
    } catch {
      setErrorMessage('Unable to revoke the API key right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!plainTextKey || !navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(plainTextKey);
    setStatusMessage('API key copied to clipboard. Store it somewhere safe.');
  };

  return (
    <section className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground">API access</h2>
          <p className="text-sm text-muted-foreground">
            Generate one API key for server-to-server link creation and analytics requests.
          </p>
        </div>
        <Link
          href="/developers#quickstart"
          className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground transition-all duration-250 hover:bg-muted/80"
        >
          <Icon name="BookOpenIcon" size={16} variant="outline" />
          Docs
        </Link>
      </div>

      {statusMessage && (
        <div className="mb-4 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success flex items-center gap-2">
          <Icon name="CheckCircleIcon" size={18} variant="solid" />
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error flex items-center gap-2">
          <Icon name="ExclamationCircleIcon" size={18} variant="solid" />
          {errorMessage}
        </div>
      )}

      {isLoading || !apiKey ? (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Loading API access details…
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-5">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Current plan
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">{apiKey.usage.planName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                API key inherits your current pricing plan automatically.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Monthly quota
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {apiKey.usage.linksRemainingThisMonth} / {apiKey.usage.monthlyLinkLimit}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Remaining short links this month.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                API key status
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {apiKey.hasKey ? 'Active' : 'Not generated'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {apiKey.hasKey
                  ? `Last used ${formatDate(apiKey.lastUsedAt)}`
                  : 'Generate one to start authenticating requests.'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground">Saved key preview</p>
              <p className="mt-1 font-mono text-sm text-primary break-all">
                {apiKey.keyPreview || 'No API key generated yet'}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {apiKey.hasKey
                  ? `Created ${formatDate(apiKey.createdAt)}. Regenerating will immediately invalidate the old key.`
                  : 'Your key will only be shown in full once, right after generation.'}
              </p>
            </div>

            {plainTextKey && (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Your new API key</p>
                    <p className="mt-2 font-mono text-sm text-primary break-all">{plainTextKey}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Copy it now and store it safely. LinkLab will not reveal it again.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-all duration-250 hover:shadow-md"
                  >
                    <Icon name="ClipboardDocumentIcon" size={16} variant="outline" />
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-250 hover:shadow-md disabled:opacity-60"
              >
                <Icon
                  name={
                    isSubmitting
                      ? 'ArrowPathIcon'
                      : apiKey.hasKey
                        ? 'ArrowPathRoundedSquareIcon'
                        : 'KeyIcon'
                  }
                  size={16}
                  variant="outline"
                  className={isSubmitting ? 'animate-spin' : ''}
                />
                {apiKey.hasKey ? 'Regenerate key' : 'Generate key'}
              </button>

              <button
                type="button"
                onClick={handleRevoke}
                disabled={isSubmitting || !apiKey.hasKey}
                className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-250 hover:bg-muted/80 disabled:opacity-60"
              >
                <Icon name="TrashIcon" size={16} variant="outline" />
                Revoke key
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
