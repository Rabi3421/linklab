'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionPlanId } from '@/lib/billing/types';

// ── Razorpay types ────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string;
  name: string;
  description: string;
  subscription_id?: string;
  recurring?: 1;
  order_id?: string;
  amount?: number;
  currency?: string;
  prefill?: { email?: string };
  theme?: { color?: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_subscription_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

// ── Component ─────────────────────────────────────────────────────────────
interface PricingPlanActionButtonProps {
  planId: SubscriptionPlanId;
  planName: string;
  cta: string;
  featured?: boolean;
  accent: string;
}

export default function PricingPlanActionButton({
  planId,
  planName,
  cta,
  featured = false,
  accent,
}: PricingPlanActionButtonProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleClick = useCallback(async () => {
    if (loading || state === 'loading') return;

    // Free plan
    if (planId === 'free') {
      router.push(isAuthenticated ? '/dashboard' : '/register');
      return;
    }

    // Enterprise
    if (planId === 'enterprise') {
      window.open('mailto:hello@linklab.in?subject=Enterprise%20Plan%20Enquiry', '_blank');
      return;
    }

    // Auth gate — redirect to login, come back to /pricing after
    if (!isAuthenticated) {
      router.push('/login?next=/pricing');
      return;
    }

    setState('loading');
    setMsg('');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setMsg('Could not load payment gateway. Check your connection.');
      setState('error');
      return;
    }

    try {
      // Create Razorpay subscription on the server
      const orderRes = await fetch('/api/billing/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      });
      const orderData = (await orderRes.json()) as {
        type?: string;
        subscriptionId?: string;
        keyId?: string;
        itemName?: string;
        message?: string;
      };

      if (!orderRes.ok || !orderData.subscriptionId) {
        setMsg(orderData.message ?? 'Could not initiate payment.');
        setState('error');
        return;
      }

      const options: RazorpayOptions = {
        key:             orderData.keyId ?? (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string),
        name:            'LinkLab',
        description:     orderData.itemName ?? `${planName} plan — billed monthly`,
        subscription_id: orderData.subscriptionId,
        recurring:       1,
        prefill:         { email: user?.email ?? '' },
        theme:           { color: '#F97316' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/billing/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ ...response, planId }),
            });
            const verifyData = (await verifyRes.json()) as { success?: boolean; message?: string };

            if (!verifyRes.ok || !verifyData.success) {
              setMsg(verifyData.message ?? 'Payment verification failed.');
              setState('error');
              return;
            }

            setMsg(verifyData.message ?? 'Plan activated!');
            setState('success');
            setTimeout(() => router.push('/dashboard'), 1400);
          } catch {
            setMsg('Payment verified but activation failed. Contact support.');
            setState('error');
          }
        },
        modal: { ondismiss: () => setState('idle') },
      };

      new window.Razorpay(options).open();
    } catch {
      setMsg('Something went wrong starting the payment.');
      setState('error');
    }
  }, [planId, planName, isAuthenticated, loading, state, router, user]);

  const label =
    state === 'loading' ? 'Please wait…' :
    state === 'success' ? '✓ ' + (msg || 'Activated!') :
    cta;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'loading' || loading}
        className={`w-full rounded-xl px-4 py-3 font-body text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 text-white disabled:cursor-not-allowed disabled:opacity-70`}
        style={{
          background:
            state === 'success'
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : featured
              ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
              : accent,
          border: featured ? 'none' : '1px solid rgba(200,205,220,0.12)',
        }}
      >
        {label}
      </button>
      {state === 'error' && msg ? (
        <p className="mt-2 text-xs text-red-400">{msg}</p>
      ) : null}
      {!isAuthenticated && planId !== 'free' && planId !== 'enterprise' && state === 'idle' ? (
        <p className="mt-2 text-xs text-white/40">Sign in to purchase this plan.</p>
      ) : null}
    </div>
  );
}
