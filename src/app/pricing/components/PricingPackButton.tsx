'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { LinkPackDefinition } from '@/lib/billing/types';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

export default function PricingPackButton({ pack }: { pack: LinkPackDefinition }) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleClick = useCallback(async () => {
    if (loading || state === 'loading') return;

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
      const orderRes = await fetch('/api/billing/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ packId: pack.id }),
      });
      const orderData = (await orderRes.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        itemName?: string;
        message?: string;
      };

      if (!orderRes.ok || !orderData.orderId) {
        setMsg(orderData.message ?? 'Could not initiate payment.');
        setState('error');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RzpCtor = (window as any).Razorpay as new (opts: Record<string, unknown>) => { open(): void };

      const rzp = new RzpCtor({
        key:         orderData.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name:        'LinkLab',
        description: orderData.itemName ?? `${pack.name} — ${pack.links} link credits`,
        order_id:    orderData.orderId,
        amount:      orderData.amount ?? 0,
        currency:    orderData.currency ?? 'INR',
        prefill:     { email: user?.email ?? '' },
        theme:       { color: '#6366f1' },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch('/api/billing/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ ...response, packId: pack.id }),
            });
            const verifyData = (await verifyRes.json()) as { success?: boolean; message?: string };

            if (!verifyRes.ok || !verifyData.success) {
              setMsg(verifyData.message ?? 'Verification failed.');
              setState('error');
              return;
            }

            setMsg(verifyData.message ?? 'Credits added!');
            setState('success');
            setTimeout(() => router.push('/dashboard'), 1400);
          } catch {
            setMsg('Payment verified but credit activation failed. Contact support.');
            setState('error');
          }
        },
        modal: { ondismiss: () => setState('idle') },
      });

      rzp.open();
    } catch {
      setMsg('Something went wrong starting the payment.');
      setState('error');
    }
  }, [pack, isAuthenticated, loading, state, router, user]);

  const label =
    state === 'loading' ? 'Please wait…' :
    state === 'success' ? '✓ ' + (msg || 'Credits added!') :
    pack.cta;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'loading' || loading}
        className="w-full rounded-xl px-4 py-3 font-body text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          background:
            state === 'success'
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : pack.highlighted
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              : 'rgba(99,102,241,0.18)',
          border: pack.highlighted ? 'none' : '1px solid rgba(99,102,241,0.28)',
        }}
      >
        {label}
      </button>
      {state === 'error' && msg ? (
        <p className="mt-2 text-xs text-red-400">{msg}</p>
      ) : null}
      {!isAuthenticated && state === 'idle' ? (
        <p className="mt-2 text-xs text-white/40">Sign in to purchase this pack.</p>
      ) : null}
    </div>
  );
}
