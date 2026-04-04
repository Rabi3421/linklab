import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import FAQItem from '@/app/homepage/components/FAQItem';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Pricing - LinkLab Plans for Indian and Global Teams',
  description:
    'Explore LinkLab pricing plans designed from public 2026 market benchmarks across India and global link management platforms.',
};

const noiseOverlayStyle = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
  opacity: 0.022,
} as const;

const glassCardStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(200,205,220,0.14)',
  backdropFilter: 'blur(18px)',
} as const;

const glassCardSoftStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
  border: '1px solid rgba(200,205,220,0.12)',
  backdropFilter: 'blur(14px)',
} as const;

const labelChipStyle = {
  background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
  border: '1px solid rgba(245,158,11,0.24)',
} as const;

const sectionDividerStyle = {
  borderTop: '1px solid rgba(200,205,220,0.10)',
} as const;

const plans = [
  {
    name: 'Free',
    badge: 'Explore the product',
    usd: '$0',
    inr: '₹0',
    cadence: '/month',
    seats: '1 user',
    cta: 'Start free',
    accent: 'rgba(255,255,255,0.08)',
    description: 'Best for trying branded links and basic reporting before you launch real campaigns.',
    features: ['25 new links / month', '1 shared short domain', '30-day analytics', 'Basic QR exports', 'Community support'],
    featured: false,
  },
  {
    name: 'Launch',
    badge: 'India-friendly starter',
    usd: '$6',
    inr: '₹499',
    cadence: '/month',
    seats: '2 users',
    cta: 'Choose Launch',
    accent: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    description: 'Benchmarked for small Indian teams that expect value near ₹500–₹600 while still needing branded links and analytics.',
    features: ['500 new links / month', '20K tracked clicks', '1 custom domain', '90-day retention', 'UTM builder + exports'],
    featured: true,
  },
  {
    name: 'Growth',
    badge: 'Global SMB sweet spot',
    usd: '$24',
    inr: '₹1,999',
    cadence: '/month',
    seats: '5 users',
    cta: 'Choose Growth',
    accent: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    description: 'Positioned against public global mid-market plans in the $22–$29 range with more generous collaboration and analytics.',
    features: ['5K new links / month', '250K tracked clicks', '1-year analytics retention', '3 custom domains', 'API + webhook access'],
    featured: false,
  },
  {
    name: 'Scale',
    badge: 'For high-volume teams',
    usd: '$79',
    inr: '₹6,499',
    cadence: '/month',
    seats: '20 users',
    cta: 'Talk to sales',
    accent: 'linear-gradient(135deg, #10b981, #059669)',
    description: 'Aligned below many $69–$75+ global growth tiers while covering larger teams, richer analytics, and faster support.',
    features: ['25K new links / month', '1.5M tracked clicks', '3-year retention', '10 custom domains', 'A/B testing + priority support'],
    featured: false,
  },
] as const;

const benchmarkNotes = [
  {
    label: 'Global link tools',
    detail: 'Public 2026 benchmarks show entry plans around $8–$10, mid tiers around $22–$29, and growth tiers around $69–$75.',
  },
  {
    label: 'India SaaS expectations',
    detail: 'India-friendly annual pricing benchmarks like Zoho Social often land near ₹600, ₹1,725, and ₹2,595 for SMB-friendly plans.',
  },
  {
    label: 'LinkLab approach',
    detail: 'We keep the starter plan accessible for Indian teams while pricing growth tiers against global alternatives like Bitly, Dub, and Rebrandly.',
  },
] as const;

const compareRows = [
  { feature: 'New links / month', free: '25', launch: '500', growth: '5K', scale: '25K' },
  { feature: 'Tracked clicks / month', free: '1K', launch: '20K', growth: '250K', scale: '1.5M' },
  { feature: 'Analytics retention', free: '30 days', launch: '90 days', growth: '1 year', scale: '3 years' },
  { feature: 'Custom domains', free: '—', launch: '1', growth: '3', scale: '10' },
  { feature: 'Team members', free: '1', launch: '2', growth: '5', scale: '20' },
  { feature: 'API & webhooks', free: '—', launch: 'Basic API', growth: 'Included', scale: 'Priority limits' },
] as const;

const pricingFaqs = [
  {
    question: 'How did you choose these prices?',
    answer:
      'The tiers are based on public 2026 benchmarks from Bitly, Dub, Rebrandly, and India-friendly SaaS pricing patterns. We kept the starter tier more accessible for Indian SMBs and matched the growth tiers against global link platforms.',
  },
  {
    question: 'Why show both USD and INR?',
    answer:
      'Many Indian teams prefer predictable INR budgeting, while global buyers compare monthly software in USD. Showing both helps LinkLab feel local without losing global clarity.',
  },
  {
    question: 'Are these monthly prices billed annually?',
    answer:
      'Yes. The page presents the monthly effective price on annual billing, which matches how many SaaS pricing pages communicate their best-value plans.',
  },
  {
    question: 'Can enterprises get custom volumes and support?',
    answer:
      'Yes. Enterprise pricing is designed for larger usage caps, SSO, audit controls, custom SLAs, onboarding support, and commercial terms tailored to the organization.',
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0" style={noiseOverlayStyle} />
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 18% 20%, rgba(245,158,11,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 45% 50% at 82% 16%, rgba(99,102,241,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 38% 42% at 50% 82%, rgba(239,68,68,0.05) 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-28">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8" style={labelChipStyle}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                    Pricing shaped by market research
                  </span>
                </div>

                <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.04em] mb-6">
                  Plans that make sense
                  <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    in India and across the world.
                  </span>
                </h1>

                <p className="max-w-[650px] font-body text-lg lg:text-xl leading-relaxed text-white/58 mb-10">
                  We benchmarked public 2026 pricing from Bitly, Dub, Rebrandly, and India-friendly SaaS plans to build tiers that feel competitive globally while staying accessible for Indian founders and growing teams.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {benchmarkNotes.map((note) => (
                    <div key={note.label} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                      <div className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-amber-300/75 mb-2">{note.label}</div>
                      <p className="font-body text-sm leading-relaxed text-white/50">{note.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] p-6 lg:p-8" style={glassCardStyle}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-2">Market snapshot</div>
                    <h2 className="font-heading text-2xl lg:text-3xl font-bold">How LinkLab is positioned</h2>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300/80" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                    Annual billing view
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ['Entry plans', 'Bitly Core $10 · Rebrandly Essentials $8 · Zoho Social Standard ₹600'],
                    ['Mid-market', 'Dub Pro $25 · Rebrandly Professional $22 · Zoho Social Professional ₹1725'],
                    ['Growth tiers', 'Dub Business $75 · Rebrandly Growth $69 · Zoho Social Premium ₹2595'],
                    ['LinkLab recommendation', 'Launch at ₹499 / $6 and Growth at ₹1,999 / $24 to stay attractive in both markets'],
                  ].map(([label, detail]) => (
                    <div key={label} className="rounded-2xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.12)' }}>
                      <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-1">{label}</div>
                      <div className="font-body text-sm leading-relaxed text-white/58">{detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[640px] mb-14">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">Plans</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">Simple pricing with room to scale</h2>
              <p className="font-body text-lg text-white/52 leading-relaxed">
                Use the free plan to explore, start affordably in INR, or scale with globally competitive analytics and team controls.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-[28px] p-6 lg:p-7 h-full ${plan.featured ? 'xl:-translate-y-3' : ''}`}
                  style={
                    plan.featured
                      ? {
                          background: 'linear-gradient(160deg, rgba(245,158,11,0.14) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.04) 100%)',
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
                      <div className="font-body text-xs uppercase tracking-[0.14em] text-white/38">{plan.badge}</div>
                    </div>
                    {plan.featured && (
                      <div className="px-3 py-1.5 rounded-full text-xs font-semibold text-amber-200" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.22)' }}>
                        Most practical
                      </div>
                    )}
                  </div>

                  <p className="font-body text-sm leading-relaxed text-white/52 min-h-[72px] mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-end gap-2 mb-1">
                      <span className="font-heading text-5xl font-bold leading-none">{plan.inr}</span>
                      <span className="font-body text-base text-white/45 mb-1">{plan.cadence}</span>
                    </div>
                    <div className="font-body text-sm text-white/40">or {plan.usd}{plan.cadence} · billed annually · {plan.seats}</div>
                  </div>

                  <button
                    type="button"
                    className={`w-full rounded-xl px-4 py-3 font-body text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${plan.featured ? 'text-white' : 'text-white/90'}`}
                    style={{
                      background: plan.featured ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' : (plan.accent as string),
                      border: plan.featured ? 'none' : '1px solid rgba(200,205,220,0.12)',
                    }}
                  >
                    {plan.cta}
                  </button>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-0.5" />
                        <span className="font-body text-sm text-white/56">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] items-start">
              <div>
                <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">Compare</p>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-5">The features that change as your team grows</h2>
                <p className="font-body text-lg leading-relaxed text-white/52 max-w-[540px]">
                  The plan structure stays intentionally clear: more links, deeper analytics, stronger collaboration, and better automation as usage increases.
                </p>
              </div>

              <div className="rounded-[28px] overflow-hidden" style={glassCardStyle}>
                <div className="grid grid-cols-5 gap-0 px-5 py-4 text-xs uppercase tracking-[0.14em] text-white/38" style={{ borderBottom: '1px solid rgba(200,205,220,0.10)' }}>
                  <div className="col-span-2">Feature</div>
                  <div>Free</div>
                  <div>Launch</div>
                  <div>Growth</div>
                </div>
                {compareRows.map((row, index) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-5 gap-0 px-5 py-4 text-sm"
                    style={{ borderBottom: index === compareRows.length - 1 ? 'none' : '1px solid rgba(200,205,220,0.08)' }}
                  >
                    <div className="col-span-2 font-body text-white/58">{row.feature}</div>
                    <div className="font-body text-white/42">{row.free}</div>
                    <div className="font-body text-amber-300/88">{row.launch}</div>
                    <div className="font-body text-white/68">{row.growth}</div>
                  </div>
                ))}
                <div className="px-5 py-4 text-sm text-white/48" style={{ borderTop: '1px solid rgba(200,205,220,0.10)', background: 'rgba(255,255,255,0.03)' }}>
                  Need SSO, audit trails, custom SLAs, or far higher limits? The `Scale` and enterprise path are designed for that.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">FAQ</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">Pricing questions, answered</h2>
              <p className="font-body text-lg text-white/52 leading-relaxed">
                A few quick answers about how the plan structure was researched and how the billing is positioned.
              </p>
            </div>
            <div className="space-y-3">
              {pricingFaqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </>
  );
}
