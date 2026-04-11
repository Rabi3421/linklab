'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { billingPlans, linkPacks } from '@/lib/billing/plans';
import type { BillingPlanDefinition, LinkPackDefinition, SubscriptionPlanId } from '@/lib/billing/types';

// ── Razorpay window type ──────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  name: string;
  description: string;
  // For one-time orders
  amount?: number;
  currency?: string;
  order_id?: string;
  // For recurring subscriptions
  subscription_id?: string;
  recurring?: 1;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  // Subscription flow
  razorpay_subscription_id?: string;
  // Order flow
  razorpay_order_id?:        string;
  // Common
  razorpay_payment_id:  string;
  razorpay_signature:   string;
}

interface RazorpayInstance {
  open(): void;
}

// ── Styles (mirror pricing page) ──────────────────────────────────────────

const glassCard = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(200,205,220,0.14)',
  backdropFilter: 'blur(18px)',
} as const;

const glassCardSoft = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
  border: '1px solid rgba(200,205,220,0.12)',
  backdropFilter: 'blur(14px)',
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// ── PlanButton ────────────────────────────────────────────────────────────

function PlanButton({
  plan,
  currentPlanId,
  onSuccess,
}: {
  plan: BillingPlanDefinition;
  currentPlanId: SubscriptionPlanId;
  onSuccess: () => void;
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const isCurrentPlan = plan.id === currentPlanId;

  const handleClick = useCallback(async () => {
    if (state === 'loading') return;

    // Free plan — no payment needed
    if (plan.id === 'free') {
      setState('loading');
      setMsg('');
      try {
        const res = await fetch('/api/billing/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ planId: 'free' }),
        });
        const data = (await res.json()) as { message?: string; activation?: { message?: string } };
        if (!res.ok) {
          setMsg(data.message ?? 'Could not downgrade.');
          setState('error');
          return;
        }
        setMsg(data.activation?.message ?? 'Free plan restored.');
        setState('success');
        setTimeout(onSuccess, 1200);
      } catch {
        setMsg('Something went wrong.');
        setState('error');
      }
      return;
    }

    if (plan.isCustomPricing) {
      window.open('mailto:hello@linklab.in?subject=Enterprise%20Plan%20Enquiry', '_blank');
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
      // Create Razorpay subscription
      const orderRes = await fetch('/api/billing/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId: plan.id }),
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
        description:     orderData.itemName ?? `${plan.name} plan — billed monthly`,
        subscription_id: orderData.subscriptionId,
        recurring:       1,
        theme:           { color: '#F97316' },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch('/api/billing/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ ...response, planId: plan.id }),
            });
            const verifyData = (await verifyRes.json()) as { success?: boolean; message?: string };

            if (!verifyRes.ok || !verifyData.success) {
              setMsg(verifyData.message ?? 'Payment verification failed.');
              setState('error');
              return;
            }

            setMsg(verifyData.message ?? 'Plan activated!');
            setState('success');
            setTimeout(onSuccess, 1400);
          } catch {
            setMsg('Payment verified but activation failed. Contact support.');
            setState('error');
          }
        },
        modal: {
          ondismiss: () => setState('idle'),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setMsg('Something went wrong starting the payment.');
      setState('error');
    }
  }, [plan, state, onSuccess]);

  const label =
    state === 'loading' ? 'Please wait…' :
    state === 'success' ? '✓ ' + (msg || 'Activated!') :
    isCurrentPlan       ? 'Current plan' :
    plan.cta;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'loading' || isCurrentPlan}
        className={`w-full rounded-xl px-4 py-3 font-body text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 text-white disabled:cursor-not-allowed disabled:opacity-70 ${plan.featured ? '' : ''}`}
        style={{
          background: isCurrentPlan
            ? 'rgba(255,255,255,0.08)'
            : state === 'success'
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : plan.featured
            ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
            : plan.accent,
          border: plan.featured || isCurrentPlan ? 'none' : '1px solid rgba(200,205,220,0.12)',
        }}
      >
        {label}
      </button>
      {state === 'error' && msg ? (
        <p className="mt-1.5 text-xs text-red-400">{msg}</p>
      ) : null}
    </div>
  );
}

// ── PackButton ────────────────────────────────────────────────────────────

function PackButton({
  pack,
  onSuccess,
}: {
  pack: LinkPackDefinition;
  onSuccess: () => void;
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleClick = useCallback(async () => {
    if (state === 'loading') return;
    setState('loading');
    setMsg('');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setMsg('Could not load payment gateway.');
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
        orderId?: string; amount?: number; currency?: string;
        keyId?: string; itemName?: string; message?: string;
      };

      if (!orderRes.ok || !orderData.orderId) {
        setMsg(orderData.message ?? 'Could not initiate payment.');
        setState('error');
        return;
      }

      const options: RazorpayOptions = {
        key:         orderData.keyId ?? (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string),
        amount:      orderData.amount ?? 0,
        currency:    orderData.currency ?? 'INR',
        name:        'LinkLab',
        description: orderData.itemName ?? `${pack.name}`,
        order_id:    orderData.orderId,
        theme:       { color: '#6366f1' },
        handler: async (response: RazorpaySuccessResponse) => {
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
            setTimeout(onSuccess, 1400);
          } catch {
            setMsg('Payment verified but credit activation failed.');
            setState('error');
          }
        },
        modal: { ondismiss: () => setState('idle') },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setMsg('Something went wrong starting the payment.');
      setState('error');
    }
  }, [pack, state, onSuccess]);

  const label =
    state === 'loading' ? 'Please wait…' :
    state === 'success' ? '✓ ' + (msg || 'Credits added!') :
    pack.cta;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'loading'}
        className="w-full rounded-xl px-4 py-3 font-body text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          background: state === 'success'
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
        <p className="mt-1.5 text-xs text-red-400">{msg}</p>
      ) : null}
    </div>
  );
}

// ── Main PricingModal ─────────────────────────────────────────────────────

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: SubscriptionPlanId;
  userEmail?: string;
}

export default function PricingModal({
  isOpen,
  onClose,
  currentPlanId = 'free',
  userEmail,
}: PricingModalProps) {
  const [tab, setTab] = useState<'subscriptions' | 'packs'>('subscriptions');
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleSuccess = () => {
    onClose();
    window.location.reload();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full max-w-[1100px] rounded-[28px] my-6 overflow-hidden"
        style={{
          background: '#1a1f2e',
          border: '1px solid rgba(200,205,220,0.12)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        }}
      >
        {/* ── Modal header ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-5"
          style={{
            background: 'linear-gradient(180deg, #1a1f2e 80%, transparent 100%)',
            borderBottom: '1px solid rgba(200,205,220,0.10)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.20)' }}
            >
              <Icon name="RocketLaunchIcon" size={18} variant="solid" className="text-amber-400" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-white leading-tight">Manage your plan</h2>
              <p className="text-xs text-white/45 font-body">
                Currently on <span className="text-amber-300/80 font-semibold capitalize">{currentPlanId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="XMarkIcon" size={20} variant="outline" />
          </button>
        </div>

        {/* ── Tab toggle ── */}
        <div className="flex justify-center px-6 pt-8 pb-6">
          <div
            className="inline-flex rounded-2xl p-1 gap-1"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,205,220,0.12)' }}
          >
            <button
              type="button"
              onClick={() => setTab('subscriptions')}
              className={`relative px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 ${tab === 'subscriptions' ? 'text-white' : 'text-white/45 hover:text-white/70'}`}
              style={tab === 'subscriptions' ? {
                background: 'linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(239,68,68,0.14) 100%)',
                border: '1px solid rgba(245,158,11,0.28)',
              } : {}}
            >
              <span className="flex items-center gap-2">
                <Icon name="ArrowPathIcon" size={14} variant="outline" />
                Monthly plans
              </span>
              {tab === 'subscriptions' && (
                <span
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-amber-900"
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                >
                  Popular
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setTab('packs')}
              className={`relative px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 ${tab === 'packs' ? 'text-white' : 'text-white/45 hover:text-white/70'}`}
              style={tab === 'packs' ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.14) 100%)',
                border: '1px solid rgba(99,102,241,0.28)',
              } : {}}
            >
              <span className="flex items-center gap-2">
                <Icon name="BoltIcon" size={14} variant="solid" />
                Link credit packs
              </span>
              {tab === 'packs' && (
                <span
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-indigo-900"
                  style={{ background: 'linear-gradient(135deg, #a5b4fc, #818cf8)' }}
                >
                  New
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-6 sm:px-8 pb-10">

          {/* context banner */}
          <div
            className="max-w-[760px] mx-auto rounded-2xl px-5 py-4 mb-8 flex gap-3 items-start"
            style={{
              background: tab === 'subscriptions'
                ? 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(239,68,68,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)',
              border: tab === 'subscriptions'
                ? '1px solid rgba(245,158,11,0.16)'
                : '1px solid rgba(99,102,241,0.16)',
            }}
          >
            <Icon
              name={tab === 'subscriptions' ? 'ArrowPathIcon' : 'BoltIcon'}
              size={16}
              variant={tab === 'subscriptions' ? 'outline' : 'solid'}
              className={`mt-0.5 shrink-0 ${tab === 'subscriptions' ? 'text-amber-400' : 'text-indigo-400'}`}
            />
            <p className="font-body text-sm leading-relaxed text-white/58">
              {tab === 'subscriptions' ? (
                <>
                  <span className="font-semibold text-white/80">Monthly plans</span> reset your quota every month and include branded domains, analytics, team seats, QR code tools, and API access.
                </>
              ) : (
                <>
                  <span className="font-semibold text-white/80">Link credit packs</span> never expire — buy once, use whenever. Credits stack on top of any subscription.
                </>
              )}
            </p>
          </div>

          {/* ── Subscription plan cards ── */}
          {tab === 'subscriptions' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {billingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-[24px] p-6 flex flex-col ${plan.featured ? 'xl:-translate-y-2' : ''}`}
                  style={
                    plan.featured
                      ? {
                          background: 'linear-gradient(160deg, rgba(245,158,11,0.14) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.04) 100%)',
                          border: '1px solid rgba(245,158,11,0.28)',
                          backdropFilter: 'blur(18px)',
                          boxShadow: '0 20px 50px rgba(245,158,11,0.10)',
                        }
                      : plan.id === currentPlanId
                      ? {
                          background: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(200,205,220,0.22)',
                          backdropFilter: 'blur(14px)',
                        }
                      : glassCard
                  }
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="font-heading text-xl font-bold text-white mb-0.5">{plan.name}</div>
                      <div className="font-body text-[11px] uppercase tracking-[0.14em] text-white/38">{plan.badge}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {plan.featured && (
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-200"
                          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.22)' }}
                        >
                          Most popular
                        </span>
                      )}
                      {plan.id === currentPlanId && (
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-200"
                          style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}
                        >
                          ✓ Active
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="font-body text-xs leading-relaxed text-white/48 min-h-[56px] mb-5">{plan.description}</p>

                  <div className="mb-5">
                    <div className="flex items-end gap-1.5 mb-0.5">
                      <span className="font-heading text-4xl font-bold leading-none text-white">{plan.usd}</span>
                      {!plan.isCustomPricing && (
                        <span className="font-body text-sm text-white/40 mb-0.5">{plan.cadence}</span>
                      )}
                    </div>
                    <p className="font-body text-xs text-white/35">
                      {plan.isCustomPricing ? 'Custom pricing' : `billed monthly · ${plan.seats}`}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <PlanButton plan={plan} currentPlanId={currentPlanId} onSuccess={handleSuccess} />
                  </div>

                  <div className="mt-5 space-y-2.5 pt-5" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Icon name="CheckCircleIcon" size={15} variant="solid" className="text-emerald-400 mt-0.5 shrink-0" />
                        <span className="font-body text-xs text-white/52">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Link pack cards ── */}
          {tab === 'packs' && (
            <div>
              {/* How it works */}
              <div className="grid gap-3 sm:grid-cols-3 mb-8">
                {[
                  { icon: 'ShoppingCartIcon', title: 'Buy a pack', body: 'One-time payment. No subscription required.' },
                  { icon: 'BoltIcon',         title: 'Credits never expire', body: 'Use them today, next month, or next year.' },
                  { icon: 'PlusCircleIcon',   title: 'Top up anytime', body: 'Credits stack and never replace what you have left.' },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl p-4 flex gap-3 items-start"
                    style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(99,102,241,0.14)' }}
                    >
                      <Icon name={step.icon as Parameters<typeof Icon>[0]['name']} size={16} variant="solid" className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-body text-xs font-semibold text-white/78 mb-0.5">{step.title}</div>
                      <p className="font-body text-xs leading-relaxed text-white/45">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {linkPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="rounded-[24px] p-6 flex flex-col"
                    style={
                      pack.highlighted
                        ? {
                            background: 'linear-gradient(160deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 50%, rgba(255,255,255,0.04) 100%)',
                            border: '1px solid rgba(99,102,241,0.32)',
                            backdropFilter: 'blur(18px)',
                            boxShadow: '0 20px 50px rgba(99,102,241,0.12)',
                          }
                        : glassCardSoft
                    }
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-heading text-xl font-bold text-white mb-0.5">{pack.name}</div>
                        <div className="font-body text-[11px] uppercase tracking-[0.14em] text-white/35">{pack.badge}</div>
                      </div>
                      {pack.highlighted && (
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-indigo-200 shrink-0"
                          style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.28)' }}
                        >
                          Best value
                        </span>
                      )}
                    </div>

                    <p className="font-body text-xs leading-relaxed text-white/48 mb-5 flex-1">{pack.description}</p>

                    <div className="mb-4">
                      <div className="flex items-end gap-1.5 mb-1">
                        <span className="font-heading text-4xl font-bold leading-none text-white">{pack.price}</span>
                        <span className="font-body text-xs text-white/42 mb-0.5">one-time</span>
                      </div>
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: 'rgba(16,185,129,0.10)',
                          border: '1px solid rgba(16,185,129,0.20)',
                          color: 'rgba(110,231,183,0.9)',
                        }}
                      >
                        <Icon name="BoltIcon" size={10} variant="solid" />
                        {pack.links} links · never expire
                      </div>
                    </div>

                    <PackButton pack={pack} onSuccess={handleSuccess} />

                    <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
                      {pack.perks.map((perk) => (
                        <div key={perk} className="flex items-center gap-2">
                          <Icon name="CheckCircleIcon" size={13} variant="solid" className="text-indigo-400 shrink-0" />
                          <span className="font-body text-xs text-white/48">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subscription nudge */}
              <div
                className="mt-8 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.14)' }}
              >
                <div>
                  <p className="font-body text-sm font-semibold text-white/72 mb-0.5">Creating links regularly?</p>
                  <p className="font-body text-xs text-white/42 leading-relaxed">
                    A monthly plan gives more value per rupee plus branded domains, analytics, and API access — from ₹99/mo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('subscriptions')}
                  className="shrink-0 px-4 py-2 rounded-xl font-body text-sm font-semibold text-amber-200 transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.22)' }}
                >
                  View subscription plans →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
