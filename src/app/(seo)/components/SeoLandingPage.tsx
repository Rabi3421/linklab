import Link from 'next/link';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import Footer from '@/app/homepage/components/Footer';
import CTASection from '@/app/homepage/components/CTASection';
import Icon from '@/components/ui/AppIcon';
import type { SeoLandingPage } from '@/lib/seo/landing-pages';
import { absoluteUrl, siteName, siteUrl } from '@/lib/seo/site';

interface SeoLandingPageProps {
  page: SeoLandingPage;
}

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

const labelChipStyle = {
  background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
  border: '1px solid rgba(245,158,11,0.24)',
} as const;

export default function SeoLandingPage({ page }: SeoLandingPageProps) {
  const pageUrl = absoluteUrl(`/${page.slug}`);

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.targetKeyword,
        item: pageUrl,
      },
    ],
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: pageUrl,
    isAccessibleForFree: page.slug.includes('free') || page.slug.includes('qr-code'),
    description: page.description,
    featureList: page.differentiators,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '79',
      priceCurrency: 'USD',
      url: absoluteUrl('/pricing'),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }}
      />

      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">
        <section className="relative overflow-hidden border-b border-white/5">
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

          <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:py-28">
            <div>
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5" style={labelChipStyle}>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                  {page.eyebrow}
                </span>
              </div>

              <h1 className="font-heading text-4xl font-bold leading-[1.04] tracking-[-0.02em] text-white md:text-5xl lg:text-6xl">
                {page.h1}
              </h1>

              <p className="mt-6 max-w-[720px] font-body text-lg leading-8 text-white/58">
                {page.lede}
              </p>

              <p className="mt-4 max-w-[680px] font-body text-base leading-7 text-white/44">
                {page.promise}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={page.ctaHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-400"
                >
                  <Icon name="BoltIcon" size={16} variant="solid" />
                  {page.ctaLabel}
                </Link>
                <Link
                  href={page.secondaryCtaHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/70 transition hover:text-white"
                >
                  {page.secondaryCtaLabel}
                  <Icon name="ArrowRightIcon" size={15} variant="outline" />
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] p-6" style={glassCardStyle}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/75">
                    Why teams choose it
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Built beyond a basic shortener</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
                  <Icon name="LinkIcon" size={24} variant="solid" />
                </div>
              </div>

              <div className="space-y-3">
                {page.differentiators.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                    <Icon name="CheckCircleIcon" size={18} variant="solid" className="mt-0.5 shrink-0 text-emerald-400" />
                    <span className="text-sm leading-relaxed text-white/58">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-[#161920] p-4">
                <div className="mb-3 flex items-center justify-between text-xs text-white/35">
                  <span>Example short link</span>
                  <span>Analytics ready</span>
                </div>
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 font-mono text-sm text-amber-200">
                  linklab.in/{page.slug.replace(/-/g, '')}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {['Clicks', 'Devices', 'QR scans'].map((label, index) => (
                    <div key={label} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-3">
                      <p className="text-lg font-bold text-white">{['1.2K', '4', '326'][index]}</p>
                      <p className="mt-1 text-[11px] text-white/36">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {page.sections.map((section) => (
              <article key={section.heading} className="rounded-[26px] p-6 lg:p-8" style={glassCardStyle}>
                <h2 className="text-2xl font-bold text-white lg:text-3xl">{section.heading}</h2>
                <p className="mt-4 text-base leading-8 text-white/54">{section.body}</p>
                <div className="mt-6 space-y-3">
                  {section.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <Icon name="CheckIcon" size={16} variant="solid" className="mt-1 shrink-0 text-amber-400" />
                      <span className="text-sm leading-7 text-white/58">{bullet}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                FAQ
              </p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">
                Common questions about {page.targetKeyword}
              </h2>
              <p className="mt-4 text-base leading-7 text-white/50">
                Clear answers for searchers comparing LinkLab with basic shorteners, enterprise link platforms, QR tools, and manual tracking workflows.
              </p>
            </div>
            <div className="space-y-3">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/52">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/5 py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-[26px] p-6 lg:p-8" style={glassCardStyle}>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                    Related pages
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Keep exploring LinkLab</h2>
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200">
                  Back to URL shortener
                  <Icon name="ArrowRightIcon" size={15} variant="outline" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {page.relatedLinks.slice(0, 8).map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-4 text-sm font-medium text-white/60 transition hover:border-amber-400/30 hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </>
  );
}

