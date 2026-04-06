import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import FAQItem from '@/app/homepage/components/FAQItem';
import PricingTabSwitcher from './components/PricingTabSwitcher';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const pricingPageUrl = new URL('/pricing', appUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'URL Shortener Pricing & Link Credit Packs | LinkLab',
  description:
    'Compare LinkLab URL shortener pricing for branded links, custom QR codes, short link analytics, API access, and custom domains. Choose monthly plans or no-expiry link credit packs.',
  keywords: [
    'url shortener pricing',
    'link shortener pricing',
    'branded links pricing',
    'qr code pricing',
    'custom qr codes',
    'short link analytics',
    'custom short links',
    'url shortener plans',
    'link management pricing',
    'custom domains for short links',
    'bulk link shortening',
    'link credit packs',
    'no expiry link credits',
    'enterprise url shortener',
  ],
  alternates: {
    canonical: pricingPageUrl,
  },
  openGraph: {
    title: 'URL Shortener Pricing & Link Credit Packs | LinkLab',
    description:
      'Monthly URL shortener plans for regular usage, plus no-expiry link credit packs for seasonal campaigns, branded links, QR codes, analytics, and API workflows.',
    url: pricingPageUrl,
    siteName: 'LinkLab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Shortener Pricing & Link Credit Packs | LinkLab',
    description:
      'Choose monthly URL shortener plans or one-time link credit packs for branded links, QR codes, analytics, and API access.',
  },
};

const noiseOverlayStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
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

const benchmarkNotes = [
  {
    label: 'URL shortener plans',
    detail:
      'Monthly plans work best for teams that create short links every week and need branded domains, analytics, API access, and collaboration.',
  },
  {
    label: 'Branded links & QR codes',
    detail:
      'Use LinkLab for branded links, custom short URLs, QR codes, campaign tracking, and link analytics without paying for features you do not need yet.',
  },
  {
    label: 'No-expiry link credits',
    detail:
      'Our hybrid model adds one-time link credit packs that never expire, so seasonal campaigns and occasional usage never waste quota.',
  },
] as const;

const compareRows = [
  { feature: 'New links / month', free: '10', starter: '100', launch: '500', growth: '2K', scale: '10K', pro: '100K', enterprise: 'Unlimited' },
  { feature: 'Tracked clicks / month', free: '500', starter: '5K', launch: '25K', growth: '100K', scale: '500K', pro: '1.5M', enterprise: 'Unlimited' },
  {
    feature: 'Link analytics',
    free: 'Basic',
    starter: 'Basic',
    launch: 'Advanced',
    growth: 'Advanced',
    scale: 'Priority',
    pro: 'Advanced',
    enterprise: 'Custom',
  },
  {
    feature: 'Analytics retention',
    free: '30 days',
    starter: '60 days',
    launch: '90 days',
    growth: '1 year',
    scale: '2 years',
    pro: '3 years',
    enterprise: 'Custom',
  },
  { feature: 'Custom / branded domains', free: '—', starter: '—', launch: '1', growth: '3', scale: '10', pro: 'Unlimited', enterprise: 'Custom' },
  { feature: 'Team members', free: '1', starter: '1', launch: '2', growth: '5', scale: '10', pro: '20', enterprise: 'Unlimited' },
  {
    feature: 'API & webhooks',
    free: '—',
    starter: '—',
    launch: 'Basic API',
    growth: 'Included',
    scale: 'Priority limits',
    pro: 'Full access',
    enterprise: 'Custom limits',
  },
] as const;

const pricingFaqs = [
  {
    question: 'What is the difference between a URL shortener subscription and a link credit pack?',
    answer:
      'A subscription gives you a monthly URL shortener quota that resets every month, plus access to team seats, branded domains, QR code tools, analytics, and API features. A link credit pack is a one-time purchase of short-link credits that never expire, so you can use them at your own pace with no recurring charge.',
  },
  {
    question: 'How much does a URL shortener cost?',
    answer:
      'LinkLab starts free, monthly plans start at $1, and enterprise pricing is custom. If you do not want a recurring plan, you can also buy one-time link credit packs and use them whenever you want.',
  },
  {
    question: 'Do unused subscription links roll over?',
    answer:
      'No. Subscription links reset at the start of each billing month. If you often have leftover quota, a no-expiry link credit pack may be a better fit because those credits stay in your account until you use them.',
  },
  {
    question: 'Can I use both a subscription and a link credit pack at the same time?',
    answer:
      'Yes. Link credit packs stack on top of your subscription. If you hit your monthly quota during a product launch, campaign, or QR code rollout, your extra credits can cover the overflow.',
  },
  {
    question: 'What currency are the prices in?',
    answer:
      'All prices are in USD. This keeps pricing simple and predictable for global teams buying branded links, QR codes, and short link analytics.',
  },
  {
    question: 'Can enterprises get custom volumes, security, and support?',
    answer:
      'Yes. The Enterprise plan is built for teams needing 100K+ links, dedicated infrastructure, custom SLAs, SSO, audit controls, white-labelling, and higher API throughput. Reach out and we will build a plan around your exact requirements.',
  },
] as const;

const pricingFaqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pricingFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const pricingPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LinkLab',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: pricingPageUrl,
  description:
    'LinkLab is a URL shortener and link management platform for branded links, QR codes, custom domains, short link analytics, and API-driven link creation with monthly plans and no-expiry link credit packs.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '79',
    priceCurrency: 'USD',
    offerCount: '11',
  },
  featureList: [
    'URL shortener plans',
    'Branded links',
    'Custom QR codes',
    'Short link analytics',
    'Custom domains',
    'API and webhooks',
    'No-expiry link credit packs',
    'Enterprise SSO and SLA options',
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqStructuredData) }}
      />
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
              backgroundImage:
                'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-28">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8"
                  style={labelChipStyle}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                    URL shortener pricing
                  </span>
                </div>

                <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.04em] mb-6">
                  URL shortener pricing
                  <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    for branded links, QR codes, and growing teams.
                  </span>
                </h1>

                <p className="max-w-[650px] font-body text-lg lg:text-xl leading-relaxed text-white/58 mb-10">
                  Compare LinkLab pricing for branded links, custom short URLs, QR code creation,
                  short link analytics, custom domains, and API access. Choose a monthly
                  subscription for recurring usage or a no-expiry link credit pack for seasonal
                  campaigns and one-off launches.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {benchmarkNotes.map((note) => (
                    <div key={note.label} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                      <div className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-amber-300/75 mb-2">
                        {note.label}
                      </div>
                      <p className="font-body text-sm leading-relaxed text-white/50">
                        {note.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] p-6 lg:p-8" style={glassCardStyle}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-2">
                      Hybrid pricing model
                    </div>
                    <h2 className="font-heading text-2xl lg:text-3xl font-bold">
                      One URL shortener, two payment options
                    </h2>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300/80"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.18)',
                    }}
                  >
                    No lock-in
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    [
                      '🔄  Monthly subscription',
                      'Best for teams that create branded links, custom short URLs, and QR codes every month. Includes analytics, custom domains, collaboration, and API access.',
                      'amber',
                    ],
                    [
                      '⚡  Link credit packs',
                      'Best for occasional usage. Buy short-link credits once and use them whenever you want. No monthly reset, no wasted spend, and no recurring deduction.',
                      'indigo',
                    ],
                    [
                      '➕  They work together',
                      'Use subscriptions for predictable URL shortener usage and top up with credits when campaigns spike. That keeps your link management costs flexible.',
                      'emerald',
                    ],
                    [
                      '🏢  Enterprise on your terms',
                      'Need enterprise URL shortener pricing, SSO, SLA-backed uptime, white-labelling, or high-volume API throughput? We will tailor it around your workflow.',
                      'violet',
                    ],
                  ].map(([label, detail, color]) => (
                    <div
                      key={label}
                      className="rounded-2xl px-4 py-4"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(200,205,220,0.12)',
                      }}
                    >
                      <div className="font-body text-xs font-semibold text-white/55 mb-1">
                        {label}
                      </div>
                      <div className="font-body text-sm leading-relaxed text-white/48">
                        {detail}
                      </div>
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
              <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">
                Plans
              </p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Choose the right URL shortener pricing model
              </h2>
              <p className="font-body text-lg text-white/52 leading-relaxed">
                A <span className="text-amber-300/80 font-medium">monthly subscription</span>
                works best for ongoing branded links, QR codes, analytics, and team workflows. A{' '}
                <span className="text-indigo-300/80 font-medium">link credit pack</span> is ideal
                for occasional campaigns because credits never expire.
              </p>
            </div>

            <PricingTabSwitcher />
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] items-start">
              <div>
                <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">
                  Compare
                </p>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-5">
                    Compare branded links, analytics, API access, and growth features
                </h2>
                <p className="font-body text-lg leading-relaxed text-white/52 max-w-[540px]">
                    LinkLab keeps URL shortener pricing easy to scan: more short links, stronger
                    analytics, better collaboration, branded domains, and developer access as your
                    usage grows.
                </p>
              </div>

              <div className="rounded-[28px] overflow-hidden" style={glassCardStyle}>
                <div
                  className="grid grid-cols-7 gap-0 px-5 py-4 text-xs uppercase tracking-[0.14em] text-white/38"
                  style={{ borderBottom: '1px solid rgba(200,205,220,0.10)' }}
                >
                  <div className="col-span-2">Feature</div>
                  <div>Free</div>
                  <div>Starter</div>
                  <div>Launch</div>
                  <div>Growth</div>
                  <div>Scale+</div>
                </div>
                {compareRows.map((row, index) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-7 gap-0 px-5 py-4 text-sm"
                    style={{
                      borderBottom:
                        index === compareRows.length - 1
                          ? 'none'
                          : '1px solid rgba(200,205,220,0.08)',
                    }}
                  >
                    <div className="col-span-2 font-body text-white/58">{row.feature}</div>
                    <div className="font-body text-white/42">{row.free}</div>
                    <div className="font-body text-white/42">{row.starter}</div>
                    <div className="font-body text-amber-300/88">{row.launch}</div>
                    <div className="font-body text-white/68">{row.growth}</div>
                    <div className="font-body text-cyan-300/68">{row.scale}</div>
                  </div>
                ))}
                <div
                  className="px-5 py-4 text-sm text-white/48"
                  style={{
                    borderTop: '1px solid rgba(200,205,220,0.10)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  Pro ($79) gives 100K links/mo · Enterprise is fully custom — unlimited links,
                  custom SLA, dedicated support, and white-labelling.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
              <div>
                <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">
                  Why teams choose LinkLab
                </p>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-5">
                  More than a URL shortener: branded links, QR codes, analytics, and flexible billing
                </h2>
                <p className="font-body text-lg leading-relaxed text-white/52 max-w-[560px]">
                  Search demand around URL shorteners is not just about shortening links. Buyers are
                  usually comparing branded links, custom domains, QR code generators, short link
                  analytics, API access, and enterprise controls. LinkLab is designed to cover those
                  needs with a pricing model that also works for irregular usage.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'Branded links & custom domains',
                    detail:
                      'Create short URLs that match your brand, manage custom domains, and keep every campaign link consistent across channels.',
                  },
                  {
                    title: 'QR codes & campaign analytics',
                    detail:
                      'Support offline and online campaigns with QR codes, click tracking, retention windows, and richer short link analytics.',
                  },
                  {
                    title: 'API, webhooks, and bulk workflows',
                    detail:
                      'Use LinkLab as link management software for marketing ops, product teams, agencies, and developer-driven automation.',
                  },
                  {
                    title: 'Hybrid billing for real usage',
                    detail:
                      'Choose recurring plans for steady volume or buy no-expiry link credits for launches, seasonal traffic, and one-off campaigns.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                    <div className="font-body text-sm font-semibold text-white/82 mb-2">
                      {item.title}
                    </div>
                    <p className="font-body text-sm leading-relaxed text-white/50">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">
                FAQ
              </p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                Pricing questions, answered
              </h2>
              <p className="font-body text-lg text-white/52 leading-relaxed">
                Quick answers about URL shortener pricing, branded links, custom domains, link
                credit packs, and enterprise options.
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
