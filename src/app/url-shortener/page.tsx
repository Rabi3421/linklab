import type { Metadata } from 'next';
import Link from 'next/link';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { absoluteUrl, defaultOgImage, siteUrl } from '@/lib/seo/site';

const pageUrl = absoluteUrl('/url-shortener');

const urlShortenerFaqs = [
  {
    question: 'What is a URL shortener?',
    answer:
      'A URL shortener converts a long web address into a short, shareable link. When someone clicks the short link, they are redirected to the original destination. LinkLab also tracks click analytics, device types, and referrers for every short link you create.',
  },
  {
    question: 'Are LinkLab short links free?',
    answer:
      'Yes. LinkLab offers a free plan that lets you shorten URLs, create QR codes, and view basic click analytics with no credit card required. Paid plans unlock custom domains, branded links, longer analytics history, and API access.',
  },
  {
    question: 'Do short links expire?',
    answer:
      'Free plan links are permanent and do not expire. Paid plans and link credit packs also create permanent links. LinkLab does not delete short links for inactivity.',
  },
  {
    question: 'Can I use my own domain for short links?',
    answer:
      'Yes. Paid plans support custom domains so your short links show your brand name instead of a generic shortener domain. Custom domain links improve click-through rates and keep all analytics data under your account.',
  },
  {
    question: 'Does LinkLab support UTM parameters?',
    answer:
      'Yes. You can add UTM parameters — source, medium, campaign, content, and term — when creating a short link. LinkLab preserves them through the redirect so your Google Analytics and GA4 attribution reports stay accurate.',
  },
  {
    question: 'Can I shorten URLs in bulk using the API?',
    answer:
      'Yes. LinkLab provides a developer API for programmatic link creation, retrieval, and analytics. Bulk URL shortening, QR code generation, and click data export are all supported through the API.',
  },
  {
    question: 'Is there a link limit on the free plan?',
    answer:
      'The free plan includes a set number of links per month. If you need more, link credit packs let you purchase a fixed number of links that never expire and do not renew monthly.',
  },
  {
    question: 'What analytics do I get with a short link?',
    answer:
      'Every LinkLab short link records total clicks, unique clicks, referrer source, device type, browser, country, region, and timestamp. Paid plans include longer data retention, geographic maps, and API access to raw analytics.',
  },
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'URL Shortener — Free Short Links with Click Analytics | LinkLab',
  description:
    'Free URL shortener with click analytics, custom domains, QR codes, and UTM tracking. Shorten links, track every click, and manage campaigns from one platform.',
  keywords: [
    'url shortener',
    'free url shortener',
    'url shortener with analytics',
    'custom url shortener',
    'shorten url',
    'short link generator',
    'branded url shortener',
    'utm link shortener',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'URL Shortener — Free Short Links with Click Analytics | LinkLab',
    description:
      'Free URL shortener with click analytics, custom domains, QR codes, and UTM tracking. Shorten links, track every click, and manage campaigns from one platform.',
    url: pageUrl,
    siteName: 'LinkLab',
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'LinkLab URL Shortener' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Shortener — Free Short Links with Click Analytics | LinkLab',
    description:
      'Free URL shortener with click analytics, custom domains, QR codes, and UTM tracking. Shorten links, track every click, and manage campaigns from one platform.',
    images: [defaultOgImage],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'LinkLab URL Shortener',
      url: pageUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        description: 'Free plan available. Paid plans from ₹99/month.',
      },
      description:
        'Free URL shortener with click analytics, custom domains, branded links, QR code generation, and UTM tracking. Shorten links and track every click from one platform.',
      featureList: [
        'URL shortening',
        'Click analytics',
        'Custom domains',
        'QR code generation',
        'UTM parameter support',
        'Developer API',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: urlShortenerFaqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'URL Shortener', item: pageUrl },
      ],
    },
  ],
};

const features = [
  {
    icon: 'LinkIcon',
    title: 'Shorten any URL instantly',
    description:
      'Paste a long link and get a clean short URL in seconds. No account required to try — sign up to keep your links and analytics permanently.',
  },
  {
    icon: 'ChartBarIcon',
    title: 'Click analytics on every link',
    description:
      'Every short link records total clicks, unique clicks, referrer sources, device types, browsers, and geographic data automatically.',
  },
  {
    icon: 'GlobeAltIcon',
    title: 'Custom domains for branded links',
    description:
      'Use your own domain for short links so recipients see your brand name before they click, not a generic shortener subdomain.',
  },
  {
    icon: 'QrCodeIcon',
    title: 'QR code included with every link',
    description:
      'Every short link generates a matching QR code automatically. QR scans are tracked alongside link clicks in the same analytics dashboard.',
  },
  {
    icon: 'TagIcon',
    title: 'UTM parameter support',
    description:
      'Add UTM tags to short links so GA4 and Google Analytics correctly attribute campaign traffic. LinkLab preserves UTM parameters through every redirect.',
  },
  {
    icon: 'CodeBracketIcon',
    title: 'Developer API for bulk shortening',
    description:
      'Create, retrieve, and analyse short links programmatically. The REST API supports bulk link creation, QR generation, and click data export.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Paste your long URL',
    description: 'Enter any web address — a product page, campaign landing page, file, video, or social profile link.',
  },
  {
    number: '02',
    title: 'Customise and shorten',
    description: 'Add a custom slug, UTM parameters, or a custom domain if you have one. Click shorten to generate the link.',
  },
  {
    number: '03',
    title: 'Share and track every click',
    description: 'Share your short link anywhere. Click data, referrers, devices, and geography appear in your analytics dashboard in real time.',
  },
];

const useCases = [
  {
    icon: 'MegaphoneIcon',
    title: 'Marketing campaigns',
    description:
      'Tag each campaign link with UTMs and a unique short URL to compare performance across email, social, SMS, and paid channels without guessing which source drove results.',
  },
  {
    icon: 'ShoppingCartIcon',
    title: 'E-commerce and product links',
    description:
      'Shorten product and promotion URLs for sharing across channels. Track which links drive clicks and which placements convert to purchases.',
  },
  {
    icon: 'DocumentTextIcon',
    title: 'Content and newsletters',
    description:
      'Replace long article and resource URLs in newsletters and social posts. Track open-to-click patterns and compare engagement across issues or campaigns.',
  },
  {
    icon: 'CodeBracketSquareIcon',
    title: 'Developer and API workflows',
    description:
      'Automate link creation at scale using the LinkLab REST API. Generate short links, QR codes, and retrieve analytics programmatically for dashboards or CRM integrations.',
  },
];

const cardBase = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(200,205,220,0.10)',
  borderRadius: 20,
};

export default function UrlShortenerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AuthenticationAwareHeader />

      <main className="min-h-screen" style={{ background: '#13151b', color: '#f5f5f0' }}>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,158,11,0.10) 0%, transparent 65%)',
            }}
          />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/35 mb-8 font-body">
              <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/55">URL Shortener</span>
            </nav>

            <div className="max-w-[760px]">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium text-amber-300/80 mb-6"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
              >
                <Icon name="LinkIcon" size={12} variant="solid" />
                Free URL Shortener
              </div>
              <h1 className="font-heading text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
                URL Shortener with{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  click analytics
                </span>{' '}
                built in
              </h1>
              <p className="font-body text-lg text-white/55 leading-relaxed mb-10 max-w-[600px]">
                Shorten any URL and track every click — referrer, device, country, and campaign data included. Free plan available. No credit card required.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="font-body font-semibold text-base text-white px-8 py-3.5 rounded-xl transition-all duration-250 hover:shadow-lg hover:-translate-y-[1px] active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' }}
                >
                  Start for free
                </Link>
                <Link
                  href="/pricing"
                  className="font-body font-medium text-base text-white/60 px-6 py-3.5 rounded-xl transition-all duration-250 hover:text-white/85 hover:bg-white/[0.05]"
                  style={{ border: '1px solid rgba(200,205,220,0.14)' }}
                >
                  View pricing
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap gap-8">
              {[
                { value: 'Free', label: 'plan to start' },
                { value: '₹99/mo', label: 'starter paid plan' },
                { value: '8+', label: 'analytics dimensions' },
                { value: 'REST', label: 'API for developers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-3xl font-bold text-amber-400">{stat.value}</div>
                  <div className="font-body text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium text-amber-300/80 mb-4"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
              >
                Features
              </div>
              <h2 className="font-heading text-4xl font-bold mb-4">
                More than a link shortener
              </h2>
              <p className="font-body text-base text-white/45 max-w-[480px]">
                Every short link comes with analytics, a QR code, and UTM support — no extra setup required.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 rounded-[20px]" style={cardBase}>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-amber-400"
                    style={{ background: 'rgba(245,158,11,0.10)' }}
                  >
                    <Icon name={feature.icon as any} size={22} variant="outline" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="font-body text-sm text-white/45 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium text-amber-300/80 mb-4"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
              >
                How it works
              </div>
              <h2 className="font-heading text-4xl font-bold">Shorten a URL in three steps</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="p-7 rounded-[20px]" style={cardBase}>
                  <div
                    className="font-heading text-4xl font-bold mb-5"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="font-body text-sm text-white/45 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium text-amber-300/80 mb-4"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
              >
                Use cases
              </div>
              <h2 className="font-heading text-4xl font-bold">Who uses LinkLab URL Shortener</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {useCases.map((useCase) => (
                <div key={useCase.title} className="flex gap-5 p-6 rounded-[20px]" style={cardBase}>
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-amber-400"
                    style={{ background: 'rgba(245,158,11,0.10)' }}
                  >
                    <Icon name={useCase.icon as any} size={24} variant="outline" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{useCase.title}</h3>
                    <p className="font-body text-sm text-white/45 leading-relaxed">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium text-amber-300/80 mb-4"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
              >
                FAQ
              </div>
              <h2 className="font-heading text-4xl font-bold">URL shortener questions</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {urlShortenerFaqs.map((faq) => (
                <div key={faq.question} className="p-6 rounded-[20px]" style={cardBase}>
                  <h3 className="font-heading text-base font-semibold mb-3">{faq.question}</h3>
                  <p className="font-body text-sm text-white/45 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold mb-8">Related tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'QR Code Generator', href: '/qr-code-generator', desc: 'Create QR codes from any URL or text.' },
                { label: 'Link Tracking', href: '/link-tracking', desc: 'Track clicks, referrers, and campaign data.' },
                { label: 'Barcode Generator', href: '/barcode-generator', desc: 'Generate Code 128, EAN-13, and more.' },
                { label: 'URL Shortener API', href: '/developers', desc: 'Programmatic link creation and analytics.' },
              ].map((tool) => (
                <Link
                  key={tool.label}
                  href={tool.href}
                  className="p-5 rounded-[18px] transition-all duration-200 hover:bg-white/[0.06]"
                  style={cardBase}
                >
                  <div className="font-heading text-base font-semibold mb-1">{tool.label}</div>
                  <div className="font-body text-sm text-white/40">{tool.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </>
  );
}
