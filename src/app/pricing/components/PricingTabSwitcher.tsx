'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { billingPlans, linkPacks } from '@/lib/billing/plans';
import PricingPlanActionButton from './PricingPlanActionButton';
import PricingPackButton from './PricingPackButton';

const glassCardStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(200,205,220,0.14)',
  backdropFilter: 'blur(18px)',
} as const;

export default function PricingTabSwitcher() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'packs'>('subscriptions');

  return (
    <div>
      {/* ── Tab toggle ── */}
      <div className="flex justify-center mb-14">
        <div
          className="inline-flex rounded-2xl p-1 gap-1"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(200,205,220,0.12)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('subscriptions')}
            className={`relative px-6 py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 ${
              activeTab === 'subscriptions'
                ? 'text-white'
                : 'text-white/45 hover:text-white/70'
            }`}
            style={
              activeTab === 'subscriptions'
                ? {
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(239,68,68,0.14) 100%)',
                    border: '1px solid rgba(245,158,11,0.28)',
                  }
                : {}
            }
          >
            <span className="flex items-center gap-2">
              <Icon name="ArrowPathIcon" size={15} variant="outline" />
              Monthly subscription
            </span>
            {activeTab === 'subscriptions' && (
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
            onClick={() => setActiveTab('packs')}
            className={`relative px-6 py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 ${
              activeTab === 'packs'
                ? 'text-white'
                : 'text-white/45 hover:text-white/70'
            }`}
            style={
              activeTab === 'packs'
                ? {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.14) 100%)',
                    border: '1px solid rgba(99,102,241,0.28)',
                  }
                : {}
            }
          >
            <span className="flex items-center gap-2">
              <Icon name="BoltIcon" size={15} variant="solid" />
              Link credit packs
            </span>
            {activeTab === 'packs' && (
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

      {/* ── Context banner ── */}
      <div
        className="max-w-[780px] mx-auto rounded-2xl px-5 py-4 mb-10 flex gap-4 items-start"
        style={{
          background:
            activeTab === 'subscriptions'
              ? 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(239,68,68,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)',
          border:
            activeTab === 'subscriptions'
              ? '1px solid rgba(245,158,11,0.16)'
              : '1px solid rgba(99,102,241,0.16)',
        }}
      >
        <Icon
          name={activeTab === 'subscriptions' ? 'ArrowPathIcon' : 'BoltIcon'}
          size={18}
          variant={activeTab === 'subscriptions' ? 'outline' : 'solid'}
          className={activeTab === 'subscriptions' ? 'text-amber-400 mt-0.5 shrink-0' : 'text-indigo-400 mt-0.5 shrink-0'}
        />
        <p className="font-body text-sm leading-relaxed text-white/60">
          {activeTab === 'subscriptions' ? (
            <>
              <span className="font-semibold text-white/80">Monthly URL shortener subscriptions</span>{' '}
              reset your link quota every month and include branded domains, analytics, team seats,
              QR code workflows, and API access. Best if you create links regularly.
            </>
          ) : (
            <>
              <span className="font-semibold text-white/80">No-expiry link credit packs</span>{' '}
              never expire — buy once, use whenever. No monthly charge, no wasted quota. Perfect if
              your branded links, short URLs, or campaign QR codes are occasional or seasonal.
              Credits stack on top of any subscription you have.
            </>
          )}
        </p>
      </div>

      {/* ── Subscriptions grid ── */}
      {activeTab === 'subscriptions' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {billingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[28px] p-6 lg:p-7 h-full ${plan.featured ? 'xl:-translate-y-3' : ''}`}
              style={
                plan.featured
                  ? {
                      background:
                        'linear-gradient(160deg, rgba(245,158,11,0.14) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.04) 100%)',
                      border: '1px solid rgba(245,158,11,0.28)',
                      backdropFilter: 'blur(18px)',
                      boxShadow: '0 20px 50px rgba(245,158,11,0.10)',
                    }
                  : glassCardStyle
              }
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="font-heading text-2xl font-bold mb-1">{plan.name}</div>
                  <div className="font-body text-xs uppercase tracking-[0.14em] text-white/38">
                    {plan.badge}
                  </div>
                </div>
                {plan.featured && (
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-amber-200 shrink-0"
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.22)',
                    }}
                  >
                    Most popular
                  </div>
                )}
              </div>

              <p className="font-body text-sm leading-relaxed text-white/52 min-h-[72px] mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-heading text-5xl font-bold leading-none">{plan.usd}</span>
                  {!plan.isCustomPricing && (
                    <span className="font-body text-base text-white/45 mb-1">{plan.cadence}</span>
                  )}
                </div>
                <div className="font-body text-sm text-white/40">
                  {plan.isCustomPricing
                    ? 'Discuss pricing with our team'
                    : `billed monthly · ${plan.seats}`}
                </div>
              </div>

              <PricingPlanActionButton
                planId={plan.id}
                planName={plan.name}
                cta={plan.cta}
                featured={plan.featured}
                accent={plan.accent}
              />

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Icon
                      name="CheckCircleIcon"
                      size={18}
                      variant="solid"
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <span className="font-body text-sm text-white/56">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Link packs grid ── */}
      {activeTab === 'packs' && (
        <div>
          {/* How it works strip */}
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            {[
              { icon: 'ShoppingCartIcon', title: 'Buy a pack', body: 'Pick the size you need. One-time payment, no subscription.' },
              { icon: 'BoltIcon', title: 'Credits never expire', body: 'Use them for short links and QR code campaigns today, next month, or next year. They\'re yours until you use them.' },
              { icon: 'PlusCircleIcon', title: 'Top up anytime', body: 'Running low? Buy another pack. Credits stack for future branded links and never replace what\'s left.' },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.14)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(99,102,241,0.14)' }}
                >
                  <Icon name={step.icon as Parameters<typeof Icon>[0]['name']} size={18} variant="solid" className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-body text-sm font-semibold text-white/80 mb-1">{step.title}</div>
                  <p className="font-body text-xs leading-relaxed text-white/48">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pack cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {linkPacks.map((pack) => (
              <div
                key={pack.id}
                className="rounded-[28px] p-6 lg:p-7 h-full flex flex-col"
                style={
                  pack.highlighted
                    ? {
                        background:
                          'linear-gradient(160deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 50%, rgba(255,255,255,0.04) 100%)',
                        border: '1px solid rgba(99,102,241,0.32)',
                        backdropFilter: 'blur(18px)',
                        boxShadow: '0 20px 50px rgba(99,102,241,0.12)',
                      }
                    : glassCardStyle
                }
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-heading text-2xl font-bold mb-1">{pack.name}</div>
                    <div className="font-body text-xs uppercase tracking-[0.14em] text-white/38">
                      {pack.badge}
                    </div>
                  </div>
                  {pack.highlighted && (
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-200 shrink-0"
                      style={{
                        background: 'rgba(99,102,241,0.14)',
                        border: '1px solid rgba(99,102,241,0.28)',
                      }}
                    >
                      Best value
                    </div>
                  )}
                </div>

                <p className="font-body text-sm leading-relaxed text-white/52 mb-6 flex-1">
                  {pack.description}
                </p>

                <div className="mb-2">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="font-heading text-5xl font-bold leading-none">{pack.price}</span>
                    <span className="font-body text-sm text-white/45 mb-1.5">one-time</span>
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{
                      background: 'rgba(16,185,129,0.10)',
                      border: '1px solid rgba(16,185,129,0.20)',
                      color: 'rgba(110,231,183,0.9)',
                    }}
                  >
                    <Icon name="BoltIcon" size={11} variant="solid" />
                    {pack.links} links · never expire
                  </div>
                </div>

                <PricingPackButton pack={pack} />

                <div className="mt-5 pt-5 space-y-2.5" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
                  {pack.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5">
                      <Icon name="CheckCircleIcon" size={15} variant="solid" className="text-indigo-400 shrink-0" />
                      <span className="font-body text-xs text-white/52">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Subscription nudge */}
          <div
            className="mt-10 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.14)',
            }}
          >
            <div>
              <div className="font-body text-sm font-semibold text-white/75 mb-1">
                Creating links regularly?
              </div>
              <p className="font-body text-xs text-white/45 leading-relaxed">
                A monthly subscription gives you more short links per rupee plus branded domains,
                analytics, team seats, QR code workflows, and API access — starting at just ₹99/mo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('subscriptions')}
              className="shrink-0 px-5 py-2.5 rounded-xl font-body text-sm font-semibold text-amber-200 transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.22)',
              }}
            >
              View subscription plans →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
