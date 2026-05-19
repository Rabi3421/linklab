import type { Metadata } from 'next';
import Link from 'next/link';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { absoluteUrl, defaultOgImage, siteUrl } from '@/lib/seo/site';

const pageUrl = absoluteUrl('/link-tracking');

const linkTrackingFaqs = [
  {
    question: 'What is link tracking?',
    answer:
      'Link tracking is the practice of monitoring who clicks your links, where they come from, what device they use, and when they click. LinkLab tracks clicks, countries, devices, browsers, and referral sources for every short link you create.',
  },
  {
    question: 'How does link analytics work?',
    answer:
      'When someone clicks a LinkLab short link, the platform records the click event with data such as geographic location, device type, browser, referrer, and timestamp. You can view all of this in the link analytics dashboard under each link.',
  },
  {
    question: 'Can I track links shared on WhatsApp or other messaging apps?',
    answer:
      'Yes. Use a unique LinkLab short link with UTM parameters for each messaging channel. This prevents WhatsApp traffic from merging into direct traffic in your analytics and gives you channel-level click data.',
  },
  {
    question: 'What is a UTM parameter and why does it matter?',
    answer:
      'UTM parameters are tags added to a URL — source, medium, campaign, content, term — that tell Google Analytics and other tools where a visitor came from. LinkLab short links preserve UTM parameters through the redirect so your GA4 reports stay accurate.',
  },
  {
    question: 'Does LinkLab support real-time click tracking?',
    answer:
      'Yes. Click data appears in your LinkLab analytics dashboard in near real time. You can see click counts, geographic breakdowns, device types, and referrer data update as clicks come in.',
  },
  {
    question: 'Can I track QR code scans alongside link clicks?',
    answer:
      'Yes. Every LinkLab short link has a matching QR code. When someone scans that QR code, the scan is recorded as a click in the same analytics dashboard, so you can compare QR scans vs direct link clicks in one report.',
  },
  {
    question: 'Is link tracking available on the free plan?',
    answer:
      'Basic click analytics including total clicks and recent activity are available on the free plan. Paid plans unlock longer analytics retention, referrer data, device and browser breakdowns, geographic maps, and API access to analytics.',
  },
  {
    question: 'What is the difference between link analytics and Google Analytics?',
    answer:
      'Google Analytics tracks what happens on your website after someone arrives. LinkLab link analytics tracks what happens at the link level — who clicked, from where, on what device, and from which referrer — before they reach your site. The two tools complement each other.',
  },
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Link Tracking & URL Analytics for Every Click | LinkLab',
  description:
    'Track link clicks, referrers, devices, countries, and campaign performance with LinkLab link analytics. Real-time URL analytics for short links and QR codes.',
  keywords: [
    'link tracking',
    'link analytics',
    'url analytics',
    'click tracking',
    'short link analytics',
    'track link clicks',
    'link click tracker',
    'url click tracking',
    'campaign link tracking',
    'qr code analytics',
    'referrer tracking',
    'utm link tracking',
    'link performance analytics',
    'track short links',
    'click analytics dashboard',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Link Tracking & URL Analytics for Every Click | LinkLab',
    description:
      'Track link clicks, referrers, devices, countries, and campaign performance with LinkLab. Real-time analytics for short links and QR codes.',
    url: pageUrl,
    siteName: 'LinkLab',
    type: 'website',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'LinkLab link tracking and URL analytics dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Tracking & URL Analytics for Every Click | LinkLab',
    description:
      'Real-time link click tracking, referrer analytics, device data, and campaign reporting for short links and QR codes.',
    images: [defaultOgImage],
  },
};

const webApplicationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LinkLab Link Tracking & Analytics',
  url: pageUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  description:
    'A link tracking and URL analytics platform that measures clicks, referrers, geographic location, device type, and campaign performance for short links and QR codes.',
  featureList: [
    'Real-time click tracking for short links',
    'Geographic location analytics (country and region)',
    'Device and browser breakdown',
    'Referrer source tracking',
    'UTM parameter preservation through redirects',
    'QR code scan tracking',
    'Campaign-level link performance comparison',
    'API access to analytics data',
  ],
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: linkTrackingFaqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

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
      name: 'Link Tracking',
      item: pageUrl,
    },
  ],
};

const analyticsMetrics = [
  {
    icon: 'CursorArrowRaysIcon',
    metric: 'Total clicks',
    description: 'Count every click on your short link or QR code scan across all channels.',
  },
  {
    icon: 'GlobeAltIcon',
    metric: 'Geographic data',
    description: 'See which countries and regions are driving traffic to your links.',
  },
  {
    icon: 'DevicePhoneMobileIcon',
    metric: 'Device breakdown',
    description: 'Understand if your audience is on mobile, desktop, or tablet before optimising landing pages.',
  },
  {
    icon: 'LinkIcon',
    metric: 'Referrer sources',
    description: 'Know exactly which platform, app, or website sent each click to your link.',
  },
  {
    icon: 'ClockIcon',
    metric: 'Time patterns',
    description: 'Spot peak click windows so you can time campaigns for maximum reach.',
  },
  {
    icon: 'QrCodeIcon',
    metric: 'QR scan tracking',
    description: 'Every QR code scan is logged as a tracked click in the same analytics dashboard.',
  },
] as const;

const useCases = [
  {
    icon: 'MegaphoneIcon',
    title: 'Marketing campaigns',
    body: 'Create a dedicated short link for each campaign, channel, and creative. Compare click volume, referrer mix, and timing across every link from one dashboard.',
    tags: ['Email', 'Paid social', 'SMS', 'WhatsApp'],
  },
  {
    icon: 'BuildingStorefrontIcon',
    title: 'E-commerce & product links',
    body: 'Track clicks on product page links, promotional offers, and shopping cart recovery messages. Understand which traffic source actually converts.',
    tags: ['Product pages', 'Offers', 'Cart recovery'],
  },
  {
    icon: 'QrCodeIcon',
    title: 'Print & offline campaigns',
    body: 'Every LinkLab QR code is a tracked link. Know how many people scanned your packaging, poster, or menu QR code and what device they used.',
    tags: ['Packaging', 'Menus', 'Posters', 'Events'],
  },
  {
    icon: 'CodeBracketIcon',
    title: 'Developer & API workflows',
    body: 'Retrieve click analytics programmatically for any link your application creates. Build custom dashboards, reporting exports, or attribution logic on top of the data.',
    tags: ['REST API', 'Webhooks', 'Data export'],
  },
] as const;

export default function LinkTrackingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">

        {/* ── Hero section ─────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 15% 20%, rgba(99,102,241,0.09) 0%, transparent 60%),
                           radial-gradient(ellipse 45% 50% at 85% 25%, rgba(139,92,246,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 40% 45% at 50% 82%, rgba(59,130,246,0.05) 0%, transparent 60%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300/85">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Link Tracking & URL Analytics
              </div>

              <h1 className="font-heading text-4xl font-bold leading-[1.04] tracking-[-0.02em] text-white md:text-5xl lg:text-6xl">
                Link tracking that tells you{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  who clicked, from where, and when.
                </span>
              </h1>

              <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-white/58">
                Every LinkLab short link comes with real-time click tracking. See geographic location, device type, browser, referrer source, and campaign-level performance — no third-party tag needed.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  <Icon name="ChartBarIcon" size={16} variant="solid" />
                  Start tracking links free
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/70 transition hover:text-white"
                >
                  Shorten a link first
                  <Icon name="ArrowRightIcon" size={15} variant="outline" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/35">
                {['Real-time analytics', 'UTM support', 'QR scan tracking', 'API access', 'Free to start'].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item}</span>
                ))}
              </div>
            </div>

            {/* Analytics preview card */}
            <div
              className="rounded-[28px] p-6"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                border: '1px solid rgba(200,205,220,0.14)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300/75">
                    Analytics dashboard
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">What you can measure</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                  <Icon name="ChartBarSquareIcon" size={24} variant="solid" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Total clicks', value: '4,821', trend: '+12% vs last week', color: 'text-indigo-300' },
                  { label: 'Top country', value: 'India (IN)', trend: '62% of clicks', color: 'text-violet-300' },
                  { label: 'Top device', value: 'Mobile', trend: '78% of sessions', color: 'text-blue-300' },
                  { label: 'Top referrer', value: 'WhatsApp', trend: '1,204 clicks', color: 'text-purple-300' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
                  >
                    <span className="text-sm text-white/58">{item.label}</span>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-xs text-white/35">{item.trend}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 font-mono text-sm text-indigo-200">
                linklab.in/spring-launch → 4,821 clicks
              </div>
            </div>
          </div>
        </section>

        {/* ── Analytics metrics ────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">What you track</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Six analytics dimensions for every link</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-white/52">
                LinkLab captures more than a click count. Every short link records the context that helps teams understand where traffic comes from and how campaigns are actually performing.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {analyticsMetrics.map((item) => (
                <div key={item.metric} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    <Icon name={item.icon as never} size={20} variant="solid" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.metric}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-[640px]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">How it works</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Set up link tracking in three steps</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                No code changes on your website. No third-party tag required. Link tracking is built into every short link you create with LinkLab.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: '01',
                  icon: 'LinkIcon',
                  title: 'Create a short link',
                  body: 'Paste your destination URL into LinkLab, choose an optional custom alias, and add UTM parameters if you want campaign-level reporting in GA4.',
                },
                {
                  step: '02',
                  icon: 'ShareIcon',
                  title: 'Share it anywhere',
                  body: 'Use the short link in emails, social posts, WhatsApp messages, SMS campaigns, paid ads, or print materials as a QR code.',
                },
                {
                  step: '03',
                  icon: 'ChartBarIcon',
                  title: 'Track every click',
                  body: 'Open the analytics view for that link in your LinkLab dashboard. See total clicks, referrers, countries, devices, and time patterns in real time.',
                },
              ].map((item) => (
                <div key={item.step} className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <span className="absolute right-5 top-5 font-mono text-4xl font-bold text-white/[0.05]">{item.step}</span>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500">
                    <Icon name={item.icon as never} size={20} variant="solid" className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use cases ────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">Who uses link tracking</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Link tracking for every team and campaign type</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-white/52">
                From marketing teams comparing channels to developers building analytics pipelines — here are the most common link tracking workflows.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 text-indigo-400">
                    <Icon name={item.icon as never} size={20} variant="solid" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/45">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── UTM tracking explainer ───────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">UTM tracking</p>
                <h2 className="text-3xl font-bold text-white lg:text-4xl">Combine short link analytics with Google Analytics 4</h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  LinkLab short links preserve UTM parameters through the redirect. That means your GA4 session source, medium, and campaign values stay accurate — even when the link is forwarded or shared privately through WhatsApp, Telegram, or email.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Use utm_source=whatsapp to separate WhatsApp traffic in GA4',
                    'Use utm_medium=email for newsletter campaigns',
                    'Use utm_campaign to compare different launch messages',
                    'Use utm_content to A/B test two creatives on the same channel',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                      <Icon name="CheckCircleIcon" size={16} variant="solid" className="mt-0.5 shrink-0 text-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/blog/how-to-track-whatsapp-clicks-with-short-links-utms-and-ga4"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <Icon name="DocumentTextIcon" size={16} variant="solid" />
                    Read the WhatsApp tracking guide
                  </Link>
                </div>
              </div>
              <div
                className="rounded-2xl p-5 font-mono text-xs"
                style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.16)' }}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">Example UTM short link</p>
                <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-white/62">{`Original URL:
https://yourbrand.com/spring-sale
  ?utm_source=whatsapp
  &utm_medium=messaging
  &utm_campaign=spring_launch_2026

LinkLab short link:
linklab.in/spring-launch

→ Redirects with all UTM params intact
→ Tracked in LinkLab AND in GA4
→ 100% attribution preserved`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related tools ────────────────────────────────────── */}
        <section className="border-b border-white/5 py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-[26px] p-6 lg:p-8"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                border: '1px solid rgba(200,205,220,0.14)',
              }}
            >
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">Related tools</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Everything that works with link tracking</h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'URL Shortener', href: '/', desc: 'Create short links with built-in analytics' },
                  { label: 'QR Code Generator', href: '/qr-code-generator', desc: 'Generate QR codes — scans are tracked clicks' },
                  { label: 'Free URL Shortener', href: '/free-url-shortener', desc: 'Start tracking links at no cost' },
                  { label: 'URL Shortener API', href: '/url-shortener-api', desc: 'Access analytics data programmatically' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-4 transition hover:border-indigo-400/30 hover:text-indigo-300"
                  >
                    <p className="text-sm font-semibold text-white">{link.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/45">{link.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">FAQ</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Link tracking — frequently asked questions</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                Answers to common questions about link analytics, UTM tracking, QR code scan reporting, and how link tracking works with Google Analytics.
              </p>
            </div>
            <div className="space-y-3">
              {linkTrackingFaqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/52">{faq.answer}</p>
                </div>
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
