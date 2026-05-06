import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import Icon from '@/components/ui/AppIcon';
import BarcodeWorkspace from './components/BarcodeWorkspace';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const pageUrl = new URL('/barcode-generator', appUrl).toString();

// ── FAQ content ────────────────────────────────────────────────────────────

const barcodeFaqs = [
  {
    question: 'What is a barcode generator?',
    answer:
      'A barcode generator is a tool that converts text or numbers into a scannable barcode image. LinkLab\'s free barcode generator creates barcodes in formats like Code 128, EAN-13, EAN-8, UPC-A, Code 39, and ITF-14. You can customise colours, bar width, and height, then download as PNG or SVG.',
  },
  {
    question: 'How do I generate a barcode for free?',
    answer:
      'Type or paste your text or number into the barcode generator, choose a format (such as Code 128 for general use or EAN-13 for retail products), adjust colours and size, then click Download PNG. No account or payment is required.',
  },
  {
    question: 'Can I generate barcodes in bulk?',
    answer:
      'The free tool on this page generates one barcode at a time. For bulk barcode generation — creating hundreds or thousands of barcodes from a CSV list — use the LinkLab API. API access is available on paid plans.',
  },
  {
    question: 'What barcode formats does this generator support?',
    answer:
      'LinkLab supports Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14, MSI/Plessey, and Pharmacode. Code 128 is the best choice for general use. EAN-13 and UPC-A are required for retail product packaging. ITF-14 is used for shipping cartons.',
  },
  {
    question: 'What is the difference between Code 128 and Code 39?',
    answer:
      'Code 128 supports the full ASCII character set (letters, digits, symbols) and produces a more compact barcode. Code 39 only supports uppercase letters, digits, and a few symbols, but is simpler to implement in older scanning systems. For new applications, Code 128 is preferred.',
  },
  {
    question: 'Can I use this barcode generator for retail product packaging?',
    answer:
      'Yes. EAN-13 is the standard barcode used on retail products globally. Enter your 12-digit GTIN and the generator will calculate and add the check digit automatically. For US retail, use UPC-A instead. Download the barcode as a high-resolution PNG or SVG for print.',
  },
  {
    question: 'What is an EAN-13 barcode?',
    answer:
      'EAN-13 (European Article Number) is a 13-digit barcode standard used worldwide on retail product packaging. It encodes a country code, company prefix, product code, and check digit. It is scanned at point-of-sale terminals in shops, supermarkets, and warehouses.',
  },
  {
    question: 'What is a Code 128 barcode used for?',
    answer:
      'Code 128 is a high-density linear barcode used in shipping labels, inventory management, logistics, and general industrial applications. It can encode all 128 ASCII characters and is the most widely used general-purpose barcode format.',
  },
] as const;

// ── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Free Barcode Generator Online | Code 128, EAN-13, UPC, Code 39 | LinkLab',
  description:
    'Generate barcodes online free. Create Code 128, EAN-13, EAN-8, UPC-A, Code 39, and ITF-14 barcodes. Free barcode generator — customise colours, download PNG or SVG, bulk barcode generation via API.',
  keywords: [
    'barcode generator',
    'barcode generator free',
    'free barcode generator',
    'qr barcode generator',
    'barcode generator online',
    'barcode generator website',
    'barcode generator bulk',
    'barcode generator in bulk',
    'barcode generator batch',
    'barcode generator code 128',
    'barcode generator 128',
    'barcode generator code 39',
    'ean 13 barcode generator',
    'ean-13 barcode generator',
    'upc barcode generator',
    'upc-a barcode generator',
    'itf 14 barcode generator',
    'qrcode generator',
    'online barcode generator',
    'create barcode online',
    'barcode maker',
    'barcode creator',
    'product barcode generator',
    'retail barcode generator',
    'inventory barcode generator',
    'shipping barcode generator',
    'barcode image generator',
    'barcode png download',
    'barcode svg download',
    'code 128 barcode',
    'code 39 barcode',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Free Barcode Generator Online | Code 128, EAN-13, UPC, Code 39 | LinkLab',
    description:
      'Create barcodes in Code 128, EAN-13, EAN-8, UPC-A, Code 39, and ITF-14 formats. Free online barcode generator — customise colours, download PNG or SVG instantly.',
    url: pageUrl,
    siteName: 'LinkLab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Barcode Generator Online | Code 128, EAN-13, UPC, Code 39 | LinkLab',
    description:
      'Generate Code 128, EAN-13, UPC-A, Code 39, and ITF-14 barcodes online free. Download PNG or SVG instantly.',
  },
};

// ── Structured data ────────────────────────────────────────────────────────

const webApplicationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LinkLab Barcode Generator',
  url: pageUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  description:
    'A free online barcode generator supporting Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14, MSI, and Pharmacode formats. Customise colours, download PNG or SVG.',
  featureList: [
    'Generate Code 128 barcodes',
    'Generate EAN-13 barcodes for retail products',
    'Generate EAN-8 barcodes',
    'Generate UPC-A barcodes',
    'Generate Code 39 barcodes',
    'Generate ITF-14 shipping barcodes',
    'Custom foreground and background colours',
    'Adjustable bar width and height',
    'Download barcode as PNG',
    'Download barcode as SVG',
    'Show or hide encoded value text',
    'Bulk barcode generation via API',
  ],
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: barcodeFaqs.map((item) => ({
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
      name: 'Barcode Generator',
      item: pageUrl,
    },
  ],
};

const howToStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to generate a barcode online for free',
  description: 'Create a barcode in Code 128, EAN-13, UPC-A, Code 39, or ITF-14 format using the free LinkLab barcode generator.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Enter your barcode content',
      text: 'Type or paste the text, number, or product code you want to encode. For EAN-13, enter 12 digits; for Code 128, enter any text or number.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose a barcode format',
      text: 'Select from Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14, MSI, or Pharmacode depending on your use case.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Customise colours and size',
      text: 'Pick a colour preset or set custom bar and background colours. Adjust bar width and height using the sliders.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Download the barcode',
      text: 'Click Download PNG for a high-resolution raster image or SVG for a scalable vector file suitable for print and packaging.',
    },
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function BarcodeGeneratorPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />

      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">

        {/* ── Hero + tool ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 15% 20%, rgba(99,102,241,0.08) 0%, transparent 60%),
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

          <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
            <div className="mx-auto mb-6 max-w-[1180px]">
              <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    Free Barcode Generator
                  </div>
                  <h1 className="font-heading text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-4xl">
                    Barcode generator for{' '}
                    <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                      retail, logistics
                    </span>{' '}
                    &amp; inventory.
                  </h1>
                  <p className="mt-2 max-w-[580px] text-sm leading-relaxed text-white/50 md:text-base">
                    Generate barcodes in Code 128, EAN-13, EAN-8, UPC-A, Code 39, and ITF-14 formats. Customise colours, download PNG or SVG — free with no account required.
                  </p>
                </div>
                <div className="hidden shrink-0 flex-wrap justify-end gap-2 text-xs text-white/35 lg:flex">
                  {['Code 128', 'EAN-13', 'UPC-A', 'Code 39', 'ITF-14', 'PNG + SVG'].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-[1180px]">
              <BarcodeWorkspace />
            </div>
          </div>
        </section>

        {/* ── What it does ─────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">What this tool does</p>
                <h2 className="text-3xl font-bold text-white lg:text-4xl">One free barcode generator. Eight formats.</h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  Whether you need a retail product barcode, a shipping label, an inventory sticker, or a pharmaceutical pack barcode — this tool supports the right format with instant live preview and high-quality output.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: 'QrCodeIcon',
                      title: 'Linear barcode generation',
                      body: 'Enter your value, select a format, and a scannable barcode appears instantly. No server round-trip, no waiting — all barcode rendering happens in your browser.',
                    },
                    {
                      icon: 'SwatchIcon',
                      title: 'Custom colours + size',
                      body: 'Choose from 6 colour presets or pick exact foreground and background colours. Adjust bar width and height to suit print-ready or on-screen use.',
                    },
                    {
                      icon: 'ArrowDownTrayIcon',
                      title: 'PNG and SVG download',
                      body: 'Download barcodes as high-resolution PNG (3× pixel density) for print-on-demand, product packaging, and retail POS. Or SVG for infinitely scalable vector output.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
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
                  { stat: '8 formats', label: 'Barcode formats supported', sub: 'Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14, MSI, Pharmacode' },
                  { stat: '3× PNG', label: 'High-res download', sub: 'Print-ready — packaging, labels, and POS displays' },
                  { stat: 'SVG ready', label: 'Scalable vector output', sub: 'Infinitely scalable for any print size or resolution' },
                  { stat: '100% free', label: 'No account required', sub: 'Generate and download barcodes right away' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-2xl font-bold text-indigo-400">{item.stat}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/42">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How to use ────────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-[640px]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">How to use</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Generate a barcode in under a minute</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                Four steps from input to download. Works on desktop and mobile. No plugins, no account, no file upload.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  step: '01',
                  icon: 'PencilIcon',
                  title: 'Enter your value',
                  body: 'Type or paste the text, number, or product code you want encoded. The live preview updates instantly.',
                },
                {
                  step: '02',
                  icon: 'ListBulletIcon',
                  title: 'Choose a format',
                  body: 'Select Code 128 for general use, EAN-13 for retail products, UPC-A for US market, ITF-14 for shipping cartons, or Code 39 for industrial labels.',
                },
                {
                  step: '03',
                  icon: 'SwatchIcon',
                  title: 'Customise appearance',
                  body: 'Pick a colour preset or set custom bar and background colours. Adjust bar width and barcode height to match your label spec.',
                },
                {
                  step: '04',
                  icon: 'ArrowDownTrayIcon',
                  title: 'Download PNG or SVG',
                  body: 'Click Download PNG for a high-resolution raster image (3× pixel density) or SVG for a fully scalable vector file ready for print.',
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

        {/* ── Format guide ─────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">Format guide</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Which barcode format should you use?</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-white/52">
                Different industries and use cases require different barcode standards. Here is a quick guide to help you pick the right format.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  format: 'Code 128',
                  badge: 'General purpose',
                  badgeColor: 'bg-indigo-500/12 text-indigo-300 border-indigo-500/20',
                  body: 'The most versatile barcode format. Supports all 128 ASCII characters — letters, digits, and symbols. Best for shipping labels, inventory tags, library systems, healthcare ID, and any application that doesn\'t require a specific standard.',
                  useCases: ['Shipping labels', 'Inventory tags', 'Library cards', 'Healthcare ID'],
                },
                {
                  format: 'EAN-13',
                  badge: 'Retail products',
                  badgeColor: 'bg-amber-500/12 text-amber-300 border-amber-500/20',
                  body: 'The global standard for retail product packaging. Used on nearly every product sold in supermarkets and shops worldwide outside North America. Encodes a 13-digit GTIN. Enter 12 digits — the check digit is calculated automatically.',
                  useCases: ['Supermarket products', 'Consumer goods', 'FMCG packaging', 'POS scanning'],
                },
                {
                  format: 'UPC-A',
                  badge: 'US retail',
                  badgeColor: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
                  body: 'The North American retail standard, used on products sold in the United States and Canada. Functionally similar to EAN-13 but 12 digits. Required for selling through major US retailers like Walmart, Target, and Amazon US.',
                  useCases: ['US supermarkets', 'North American retail', 'Amazon US listings', 'Walmart suppliers'],
                },
                {
                  format: 'ITF-14',
                  badge: 'Shipping & wholesale',
                  badgeColor: 'bg-blue-500/12 text-blue-300 border-blue-500/20',
                  body: 'Used on corrugated cardboard boxes, shipping cartons, and pallets — not individual retail items. Encodes a 14-digit GTIN and is printed directly on packaging. Scannable even on rough cardboard surfaces.',
                  useCases: ['Shipping cartons', 'Pallets', 'Wholesale boxes', 'Warehouse receiving'],
                },
                {
                  format: 'Code 39',
                  badge: 'Industrial & defence',
                  badgeColor: 'bg-violet-500/12 text-violet-300 border-violet-500/20',
                  body: 'One of the oldest barcode formats, widely supported in industrial, automotive, military, and government applications. Supports uppercase A–Z, digits 0–9, and a few special characters. Less compact than Code 128 but universally readable.',
                  useCases: ['Automotive parts', 'Defence equipment', 'Government ID', 'Industrial labels'],
                },
                {
                  format: 'EAN-8',
                  badge: 'Small packaging',
                  badgeColor: 'bg-rose-500/12 text-rose-300 border-rose-500/20',
                  body: 'A shorter version of EAN-13 designed for small product packaging where there is not enough space for a full 13-digit barcode. Common on confectionery, cosmetics, and small consumer goods. Enter 7 digits — the check digit is auto-calculated.',
                  useCases: ['Small products', 'Confectionery', 'Cosmetics', 'Compact packaging'],
                },
              ].map((item) => (
                <div key={item.format} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white">{item.format}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/52 mb-4">{item.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.useCases.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/42">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use cases ────────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">Use cases</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Who uses a barcode generator?</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-base leading-relaxed text-white/52">
                From small businesses creating product labels to developers building inventory systems — barcodes are everywhere.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  icon: 'BuildingStorefrontIcon',
                  title: 'Retail & e-commerce sellers',
                  body: 'Generate EAN-13 or UPC-A barcodes for product listings on Amazon, Flipkart, and physical retail. Print on labels for shelf-ready packaging.',
                  tags: ['EAN-13', 'UPC-A', 'Product labels'],
                },
                {
                  icon: 'TruckIcon',
                  title: 'Logistics & warehousing',
                  body: 'Create Code 128 barcodes for shipping labels, packing slips, and carton identification. Use ITF-14 for wholesale carton tracking.',
                  tags: ['Code 128', 'ITF-14', 'Shipping labels'],
                },
                {
                  icon: 'BeakerIcon',
                  title: 'Manufacturers & factories',
                  body: 'Label parts, components, and finished goods with Code 128 or Code 39 barcodes for production line tracking and quality control.',
                  tags: ['Code 128', 'Code 39', 'Part tracking'],
                },
                {
                  icon: 'BookOpenIcon',
                  title: 'Libraries & schools',
                  body: 'Generate Code 128 barcodes for book labelling, asset tagging, and student ID cards. Fully compatible with standard barcode scanners.',
                  tags: ['Code 128', 'Asset tags', 'Book labels'],
                },
                {
                  icon: 'HeartIcon',
                  title: 'Healthcare & pharmacy',
                  body: 'Create Pharmacode barcodes for pharmaceutical packaging, or Code 128 for patient wristbands, specimen labels, and medication tracking.',
                  tags: ['Pharmacode', 'Code 128', 'Patient ID'],
                },
                {
                  icon: 'CodeBracketIcon',
                  title: 'Developers & system builders',
                  body: 'Prototype barcode label formats, test scanner compatibility, or generate test barcodes for inventory and point-of-sale system development.',
                  tags: ['Bulk via API', 'Testing', 'Prototyping'],
                },
              ].map((item) => (
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

        {/* ── Bulk & API section ────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">Bulk barcode generation</p>
                <h2 className="text-3xl font-bold text-white lg:text-4xl">Need barcodes in bulk? Use the API.</h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  The free barcode generator on this page creates one barcode at a time. For batch barcode generation — creating hundreds or thousands of barcodes from a product list, CSV file, or database — use the LinkLab API.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Generate barcodes programmatically from any data source',
                    'Supports all formats: Code 128, EAN-13, UPC-A, Code 39, ITF-14 and more',
                    'Batch barcode generation in a single API call',
                    'PNG and SVG output with custom colours and dimensions',
                    'Integrate with your inventory, WMS, or e-commerce platform',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                      <Icon name="CheckCircleIcon" size={16} variant="solid" className="mt-0.5 shrink-0 text-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/developers"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <Icon name="CodeBracketIcon" size={16} variant="solid" />
                    View API docs
                  </a>
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,205,220,0.12)' }}
                  >
                    See plans
                    <Icon name="ArrowRightIcon" size={14} variant="solid" />
                  </a>
                </div>
              </div>
              <div
                className="rounded-2xl p-6 font-mono text-sm"
                style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.16)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-400 mb-4">Example API request</p>
                <pre className="text-white/65 leading-relaxed overflow-x-auto whitespace-pre-wrap text-xs">{`POST /api/barcodes/generate

{
  "format": "CODE128",
  "values": [
    "PROD-001",
    "PROD-002",
    "PROD-003"
  ],
  "options": {
    "lineColor": "#000000",
    "background": "#FFFFFF",
    "width": 2,
    "height": 100
  }
}`}</pre>
                <p className="mt-4 text-xs text-white/35">Available on Starter plan and above.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Also try QR ──────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-2xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.14)' }}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-400 mb-1">Also try</p>
                <h3 className="text-xl font-bold text-white mb-1">Need a QR code instead of a barcode?</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[480px]">
                  QR codes store more data, work with mobile cameras, and are better for URLs, menus, and marketing campaigns. Try the free LinkLab QR code generator and scanner.
                </p>
              </div>
              <a
                href="/qr-code-generator"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400"
              >
                <Icon name="QrCodeIcon" size={16} variant="solid" />
                QR code generator →
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">FAQ</p>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">Barcode generator — frequently asked questions</h2>
              <p className="mt-4 text-base leading-relaxed text-white/52">
                Answers to common questions about barcode formats, free barcode generation, bulk barcodes, and EAN-13 vs UPC-A vs Code 128.
              </p>
            </div>
            <div className="space-y-3">
              {barcodeFaqs.map((faq) => (
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
