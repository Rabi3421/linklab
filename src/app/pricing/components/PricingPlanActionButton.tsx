'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionPlanId } from '@/lib/billing/types';

interface PricingPlanActionButtonProps {
  planId: SubscriptionPlanId;
  cta: string;
  featured?: boolean;
  accent: string;
}

export default function PricingPlanActionButton({
  planId,
  cta,
  featured = false,
  accent,
}: PricingPlanActionButtonProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleClick = async () => {
    if (loading || isSubmitting) {
      return;
    }

    if (planId === 'free') {
      router.push(isAuthenticated ? '/dashboard' : '/register');
      return;
    }

    if (!isAuthenticated) {
      router.push('/register');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      });

      const payload = (await response
        .json()
        .catch(() => ({ message: 'Unable to activate this plan right now.' }))) as {
        message?: string;
        activation?: { message?: string };
      };

      if (!response.ok) {
        setFeedback(payload.message || 'Unable to activate this plan right now.');
        return;
      }

      setFeedback(payload.activation?.message || 'Plan activated successfully.');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setFeedback('Unable to activate this plan right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting || loading}
        className={`w-full rounded-xl px-4 py-3 font-body text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${featured ? 'text-white' : 'text-white/90'} disabled:cursor-not-allowed disabled:opacity-70`}
        style={{
          background: featured ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' : accent,
          border: featured ? 'none' : '1px solid rgba(200,205,220,0.12)',
        }}
      >
        {isSubmitting ? 'Activating…' : cta}
      </button>
      {feedback ? <p className="mt-2 text-xs text-white/55">{feedback}</p> : null}
      {!isAuthenticated && planId !== 'free' ? (
        <p className="mt-2 text-xs text-white/40">
          Create an account first to activate this plan and unlock a higher monthly quota.
        </p>
      ) : null}
    </div>
  );
}
