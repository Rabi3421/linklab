import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import Icon from '@/components/ui/AppIcon';
import QrToolsWorkspace from './components/QrToolsWorkspace';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const pageUrl = new URL('/qr-code-generator', appUrl).toString();

const qrFaqs = [
  {
    question: 'Can I generate a QR code from a URL for free?',
    answer:
      'Yes. LinkLab lets you create a QR code from a URL or text directly on the page. You can customise the QR design, preview it instantly, and download the QR code as a PNG.',
  },
  {
    question: 'Can I scan a QR code from an uploaded image?',
    answer:
      'Yes. Upload a screenshot or image containing a QR code and LinkLab will extract the URL, text, or other encoded content directly in your browser.',
  },
  {
    question: 'Does the QR code scanner work with screenshots?',
    answer:
      'Yes. The scanner works with screenshots, PNGs, JPGs, WEBP images, and other common formats as long as the QR code is clear enough to read.',
  },
  {
    question: 'Can I create branded QR codes for marketing campaigns?',
    answer:
      'Yes. LinkLab includes QR styling controls so you can change colors, patterns, frame styles, and even add a logo for branded campaign QR codes.',
  },
  {
    question: 'What kind of content can a QR code contain?',
    answer:
      'A QR code can contain a website URL, plain text, product link, menu link, event registration page, contact card, or many other short text-based formats.',
  },
  {
    question: 'Is this QR generator useful for print and offline campaigns?',
    answer:
      'Yes. You can use the generated QR codes on packaging, posters, flyers, restaurant menus, event signage, retail displays, and other offline materials.',
  },
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'QR Code Generator & Scanner Online | LinkLab',
  description:
    'Create a QR code from a URL or text, customise the design, and scan QR codes from uploaded images online. Free QR code generator and QR code scanner for links, menus, campaigns, and more.',
  keywords: [
    'qr code generator',
    'qr code scanner',
    'scan qr code from image',
    'free qr code generator',
    'url to qr code',
    'qr code reader online',
    'decode qr code from image',
    'scan qr code from screenshot',
    'create qr code for url',
    'qr code generator for links',
    'upload qr code and read url',
    'qr code scanner from photo',
    'custom qr code generator',
    'branded qr code generator',
    'qr code for website link',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'QR Code Generator & Scanner Online | LinkLab',
    description:
      'Generate QR codes for URLs or text, customise the design, and scan QR codes from uploaded images online with LinkLab.',
    url: pageUrl,
    siteName: 'LinkLab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator & Scanner Online | LinkLab',
    description:
      'Free QR code generator and QR code scanner for URLs, text, screenshots, menus, and campaign assets.',
  },
};

const webApplicationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LinkLab QR Code Generator and Scanner',
  url: pageUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  description:
    'A web-based QR code generator and QR code scanner for creating QR codes from URLs or text and decoding QR codes from uploaded images.',
  featureList: [
    'Generate QR codes from URLs',
    'Generate QR codes from plain text',
    'Scan QR codes from uploaded images',
    'Decode QR codes from screenshots',
    'Create branded QR codes with custom colors',
    'Download QR code PNG files',
    'Extract links or text from scanned QR codes',
  ],
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qrFaqs.map((item) => ({
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
      item: appUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'QR Code Generator',
      item: pageUrl,
    },
  ],
};

const createQrHowToStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to create a QR code from a URL',
  description: 'Create a QR code from any URL or text online with LinkLab.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Paste your URL or text',
      text: 'Enter the website URL, landing page, menu link, product page, or plain text you want to convert into a QR code.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Customise the QR design',
      text: 'Adjust QR colors, corner styles, dots, frame style, and branding options to match your campaign or website.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download the QR code',
      text: 'Download the QR code as a PNG and use it on print materials, retail packaging, event assets, or digital campaigns.',
    },
  ],
};

const scanQrHowToStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to scan a QR code from an image',
  description: 'Upload an image or screenshot containing a QR code and decode it online.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload the QR code image',
      text: 'Choose a screenshot, photo, PNG, JPG, WEBP, or any image file that contains a clear QR code.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Let the scanner decode the QR',
      text: 'LinkLab reads the QR code directly in your browser and extracts the URL, text, or encoded content.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Copy or open the result',
      text: 'Copy the decoded content or open it directly if the QR code contains a website link.',
    },
  ],
};

export default function QrCodeGeneratorPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createQrHowToStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scanQrHowToStructuredData) }}
      />
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">

        {/* ── Hero + tool section ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 15% 20%, rgba(245,158,11,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 45% 50% at 85% 25%, rgba(99,102,241,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 40% 45% at 50% 82%, rgba(239,68,68,0.05) 0%, transparent 60%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">

            {/* Compact inline headline */}
            <div className="mx-auto mb-6 max-w-[1180px]">
              <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    QR Code Generator + Scanner
                  </div>
                  <h1 className="font-heading text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-4xl">
                    QR tools for{' '}
                    <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      creation, scanning
                    </span>{' '}
                    &amp; delivery.
                  </h1>
                  <p className="mt-2 max-w-[580px] text-sm leading-relaxed text-white/50 md:text-base">
                    Generate QR codes from any URL, customise the design, and scan QR codes from uploaded images — all in one workspace.
                  </p>
                </div>
                <div className="hidden shrink-0 flex-wrap justify-end gap-2 text-xs text-white/35 lg:flex">
                  {['Free generator', 'Scan from image', 'Custom design', 'Decode screenshot'].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* The unified tool card — full width of container */}
            <div className="mx-auto max-w-[1180px]">
              <QrToolsWorkspace />
            </div>
          </div>
        </section>

        {/* ── What this page does ─────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">What you can do here</p>
                <h2 className="text-3xl font-bold text-white lg:text-4xl">One page. Two powerful QR workflows.</h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  Most QR tools do one thing — generate or scan. LinkLab does both in the same workspace so you can create, customise, and verify QR codes without switching between different apps or browser tabs.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: 'QrCodeIcon',
                      title: 'Generate QR codes from any URL or text',
                      body: 'Paste a website URL, landing page, Google Form, WhatsApp link, product page, or plain text. The QR code generates instantly. Customise colors, dot patterns, corner styles, frame, and logo before you download.',
                    },
                    {
                      icon: 'MagnifyingGlassIcon',
                      title: 'Scan and decode QR codes from images',
                      body: 'Upload a screenshot, camera photo, PNG, or WEBP containing a QR code. LinkLab reads the QR code entirely in your browser and extracts the encoded URL or text — nothing leaves your device.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                        <Icon name={item.icon as never} size={20} variant="solid" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/50">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { stat: '4 presets', label: 'Built-in QR style presets', sub: 'Brand Sunset, Slate Pro, Ocean Glow, Emerald Pop' },
                  { stat: '100% browser', label: 'Client-side QR decoding', sub: 'No image upload to any server when scanning' },
                  { stat: 'PNG ready', label: 'High-resolution download', sub: '960px PNG — print, packaging, and digital ready' },
                  { stat: 'Free tier', label: 'No account needed to start', sub: 'Generate and download QR codes right away' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-2xl font-bold text-amber-400">{item.stat}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/42">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How to use — Generate ───────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-[640px]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">How to use</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Create a QR code in under a minute</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                No account needed to generate your first QR code. Sign up to unlock custom domains, analytics, and branded short links attached to your QR.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  step: '01',
                  icon: 'LinkIcon',
                  title: 'Paste your URL or text',
                  body: 'Enter any website URL, product page, menu link, form link, event registration, or plain text into the destination field.',
                },
                {
                  step: '02',
                  icon: 'SwatchIcon',
                  title: 'Pick a style preset',
                  body: 'Choose from Brand Sunset, Slate Pro, Ocean Glow, or Emerald Pop — or manually set your own colors, dot style, corner style, and frame.',
                },
                {
                  step: '03',
                  icon: 'PhotoIcon',
                  title: 'Add your logo (optional)',
                  body: 'Upload a PNG, JPG, or SVG logo to embed in the center of the QR code. It will be resized and optimised automatically.',
                },
                {
                  step: '04',
                  icon: 'ArrowDownTrayIcon',
                  title: 'Download your QR code',
                  body: 'Click Download PNG to get a high-resolution 960px QR code ready for print, packaging, posters, flyers, and digital campaigns.',
                },
              ].map((item) => (
                <div key={item.step} className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <span className="absolute right-5 top-5 font-mono text-4xl font-bold text-white/[0.05]">{item.step}</span>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-red-500">
                    <Icon name={item.icon as never} size={20} variant="solid" className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-white/5 pt-14">
              <div className="mb-10 max-w-[560px]">
                <h3 className="text-2xl font-bold text-white">How to scan a QR code from an image</h3>
                <p className="mt-3 text-base leading-relaxed text-white/50">Use the Scan QR tab to decode any QR code you have saved as an image or screenshot.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    step: '01',
                    icon: 'ArrowUpTrayIcon',
                    title: 'Switch to Scan QR tab',
                    body: 'Click the Scan QR tab at the top of the tool. Then click the upload zone or drag your file into it.',
                  },
                  {
                    step: '02',
                    icon: 'QrCodeIcon',
                    title: 'Upload your QR image',
                    body: 'Choose any PNG, JPG, WEBP, screenshot, or camera photo that contains a visible QR code. Higher contrast = better results.',
                  },
                  {
                    step: '03',
                    icon: 'ClipboardDocumentIcon',
                    title: 'Copy or open the result',
                    body: 'The decoded URL or text appears instantly in the result panel. Copy it to clipboard or click Open link if it\'s a URL.',
                  },
                ].map((item) => (
                  <div key={item.step} className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                    <span className="absolute right-5 top-5 font-mono text-4xl font-bold text-white/[0.05]">{item.step}</span>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500">
                      <Icon name={item.icon as never} size={20} variant="solid" className="text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits / Use cases ─────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">Who uses this</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">QR codes work everywhere your customers are</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-white/52">
                From restaurant tables to retail shelves to social media bios — here are the most common ways people use LinkLab&apos;s QR generator.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  icon: 'BuildingStorefrontIcon',
                  title: 'Restaurants & menus',
                  body: 'Replace printed menus with a QR code on each table. Update the menu URL any time without reprinting the QR code.',
                  tags: ['Menu links', 'Table QR', 'Order forms'],
                },
                {
                  icon: 'MegaphoneIcon',
                  title: 'Marketing campaigns',
                  body: 'Print QR codes on flyers, posters, packaging, and event signage to bridge offline traffic to landing pages and promotions.',
                  tags: ['Flyers', 'Packaging', 'Retail signage'],
                },
                {
                  icon: 'DevicePhoneMobileIcon',
                  title: 'App downloads & social',
                  body: 'Point a QR code at your App Store or Play Store link, WhatsApp chat, Instagram profile, or social bio page.',
                  tags: ['App Store', 'WhatsApp', 'Social links'],
                },
                {
                  icon: 'CalendarDaysIcon',
                  title: 'Events & check-ins',
                  body: 'Generate QR codes for event registration forms, ticketing pages, venue maps, or WiFi passwords for attendees.',
                  tags: ['Tickets', 'Registration', 'WiFi QR'],
                },
                {
                  icon: 'DocumentTextIcon',
                  title: 'PDFs & digital assets',
                  body: 'Share brochures, product sheets, catalogs, and instruction manuals via QR without emailing files or using cloud storage links.',
                  tags: ['PDFs', 'Catalogs', 'Brochures'],
                },
                {
                  icon: 'MagnifyingGlassIcon',
                  title: 'QR code verification',
                  body: 'Use the scanner to verify what\'s encoded in a QR before printing at scale. Catch wrong URLs early and avoid costly reprints.',
                  tags: ['Pre-print check', 'QR audit', 'Campaign review'],
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 text-amber-400">
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

        {/* ── Pricing snapshot ─────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-[620px]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">Pricing</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">QR code generation is free. Upgrade for branded links and analytics.</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                Generating and downloading QR codes is available on every plan including the free tier. Unlock custom short domains, click tracking, and team features by upgrading.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  name: 'Free',
                  price: '$0',
                  cadence: '/month',
                  badge: 'No card needed',
                  accent: 'border-white/10',
                  badgeColor: 'bg-white/8 text-white/55',
                  features: ['Basic QR exports', '10 links/month', '30-day analytics', 'Shared short domain'],
                },
                {
                  name: 'Launch',
                  price: '$5',
                  cadence: '/month',
                  badge: 'Most popular',
                  accent: 'border-amber-500/40',
                  badgeColor: 'bg-amber-500/15 text-amber-300',
                  features: ['Styled QR downloads', '500 links/month', '1 custom domain', '90-day analytics + UTM'],
                },
                {
                  name: 'Growth',
                  price: '$10',
                  cadence: '/month',
                  badge: 'For teams',
                  accent: 'border-white/10',
                  badgeColor: 'bg-white/8 text-white/55',
                  features: ['All QR features', '2K links/month', '3 custom domains', 'API + webhooks'],
                },
                {
                  name: 'Scale',
                  price: '$29',
                  cadence: '/month',
                  badge: 'High volume',
                  accent: 'border-white/10',
                  badgeColor: 'bg-white/8 text-white/55',
                  features: ['All QR features', '10K links/month', '10 custom domains', 'A/B testing + priority support'],
                },
              ].map((plan) => (
                <div key={plan.name} className={`rounded-2xl border ${plan.accent} bg-white/[0.03] p-6`}>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-white">{plan.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${plan.badgeColor}`}>{plan.badge}</span>
                  </div>
                  <p className="mb-5 text-3xl font-bold text-white">
                    {plan.price}<span className="text-sm font-normal text-white/40">{plan.cadence}</span>
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                        <Icon name="CheckIcon" size={14} variant="solid" className="mt-0.5 shrink-0 text-amber-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5">
              <div>
                <p className="font-semibold text-white">Need more links without a subscription?</p>
                <p className="mt-1 text-sm text-white/50">Link packs start at $1.50 for 100 links — credits never expire and stack on any plan.</p>
              </div>
              <a href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400">
                <Icon name="ArrowRightIcon" size={15} variant="solid" />
                See full pricing
              </a>
            </div>
          </div>
        </section>

        {/* ── Why LinkLab QR vs generic tools ─────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">Why LinkLab</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">More than a basic QR generator</h2>
              <p className="mx-auto mt-4 max-w-[580px] text-base leading-relaxed text-white/52">
                Most free QR generators give you a plain black-and-white code. LinkLab gives you a full QR design system connected to branded links and analytics.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/8 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  icon: 'PaintBrushIcon',
                  title: 'Fully styled QR output',
                  body: 'Choose from 6 dot styles, 7 corner styles, 3 frame options, and a full color picker for foreground, corner, and background. Every QR looks intentional, not generic.',
                },
                {
                  icon: 'ShieldCheckIcon',
                  title: 'Browser-only QR scanning',
                  body: 'When you scan a QR from an image, the decoding runs entirely in your browser using the jsQR library. Your uploaded images never leave your device.',
                },
                {
                  icon: 'LinkIcon',
                  title: 'Attach to a tracked short link',
                  body: 'Upgrade to any paid plan and pair your QR code with a branded short link. Every scan becomes a tracked click with full analytics, UTM support, and device data.',
                },
                {
                  icon: 'ArrowDownTrayIcon',
                  title: 'High-res PNG for print',
                  body: 'Downloads are generated at 960px — large enough for print-on-demand, product packaging, event banners, and retail POS displays without blurring.',
                },
                {
                  icon: 'BoltIcon',
                  title: 'Instant live preview',
                  body: 'Every style change — color, dot style, logo — updates the preview in real time so you see exactly what the QR will look like before you download.',
                },
                {
                  icon: 'GlobeAltIcon',
                  title: 'Works on any device',
                  body: 'The QR generator and scanner work on desktop, tablet, and mobile browsers with no app installation, no plugins, and no account required to get started.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.02] p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-amber-400">
                    <Icon name={item.icon as never} size={18} variant="solid" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/48">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">FAQ</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Common questions about QR code generation and scanning</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                Answers to the most frequent questions about creating QR codes from URLs, scanning QR images, styling QR codes for print, and how the free tier works.
              </p>
            </div>
            <div className="space-y-3">
              {qrFaqs.map((faq) => (
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

