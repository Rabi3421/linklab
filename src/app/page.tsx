import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import HomepageInteractive from './homepage/components/HomepageInteractive';
import { homepageFaqs } from './homepage/components/FAQSection';
import { billingPlans } from '@/lib/billing/plans';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const homepageUrl = new URL('/', appUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Branded Link & QR Platform for Marketing Agencies | LinkLab',
  description:
    'LinkLab is the branded link and QR platform for small marketing agencies running WhatsApp, Instagram, and offline campaigns for multiple clients. Dynamic QR codes and per-client reporting, priced per agency.',
  keywords: [
    'link management for agencies',
    'url shortener for agencies',
    'branded links for clients',
    'client link management',
    'agency link tracking',
    'multi client link management',
    'dynamic qr codes',
    'qr code for packaging',
    'whatsapp campaign links',
    'instagram bio link tracking',
    'offline campaign tracking',
    'branded short links',
    'client campaign reporting',
    'white label link reports',
    'url shortener',
    'link shortener',
    'short link analytics',
    'qr code generator',
    'custom domains',
    'url shortener api',
    'bulk short urls',
    'url shortener starting at ₹99',
    'no expiry link credits',
    'bitly alternative for agencies',
    'rebrandly alternative',
  ],
  alternates: {
    canonical: homepageUrl,
  },
  openGraph: {
    title: 'Branded Link & QR Platform for Marketing Agencies | LinkLab',
    description:
      'Run every client\'s branded links and QR codes without the mix-ups. Built for small marketing agencies on WhatsApp, Instagram, and offline campaigns — priced per agency, not per enterprise seat.',
    url: homepageUrl,
    siteName: 'LinkLab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Branded Link & QR Platform for Marketing Agencies | LinkLab',
    description:
      'Unlike Bitly, Dub, or Rebrandly, LinkLab is organized around your clients, not your links. Branded links, dynamic QR codes, and per-client reporting for small agencies.',
  },
};

const homepageSoftwareStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LinkLab',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: homepageUrl,
  description:
    'LinkLab is a branded link and QR platform for small marketing agencies managing multiple clients\' WhatsApp, Instagram, and offline campaigns.',
  featureList: [
    'URL shortener – shorten any URL into a clean branded short link',
    'Branded short links with custom aliases and vanity URLs',
    'Custom domain support – use your own domain for short links',
    'QR code generator – auto-generate QR codes for every short link',
    'Short link analytics – track clicks, locations, devices, and referrers',
    'Link management dashboard – create, edit, disable, and organise client campaign links',
    'Bulk short URL creation via API',
    'REST API for programmatic link creation and analytics retrieval',
    'Campaign UTM tracking integration',
    'Dynamic QR codes – repoint a printed code without reprinting it',
    'WhatsApp, Instagram, and offline campaign link tracking',
    'Link expiry and scheduled deactivation',
    'Team workspace with shared link management',
    'Real-time click data and traffic reports',
    'Geographic click distribution reporting',
    'Device and browser analytics',
    'No-expiry one-time link credit packs',
    'Custom pricing for larger client rosters',
  ],
  offers: billingPlans
    .filter((plan) => !plan.isCustomPricing)
    .map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} plan`,
      price: String((plan.priceInPaise ?? 0) / 100),
      priceCurrency: 'INR',
      description: `${plan.monthlyLinkLimit.toLocaleString('en-IN')} shortened links and ${plan.trackedClicksLabel} tracked clicks per month.`,
      url: `${appUrl}/${plan.id === 'free' ? 'register' : 'pricing'}`,
    })),
  audience: {
    '@type': 'Audience',
    audienceType: 'Small marketing agencies managing branded links, QR codes, and campaign reporting for multiple clients',
  },
};

const homepageFaqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homepageFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LinkLab',
  url: homepageUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${appUrl}/assets/brand/linklab-logo-mark.png`,
    width: 512,
    height: 512,
  },
  description:
    'LinkLab is a branded link and QR platform built for small marketing agencies managing campaigns for multiple clients.',
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LinkLab',
  url: homepageUrl,
  description:
    'Create branded links and dynamic QR codes for every client campaign, and track the clicks that go into your client reports.',
  publisher: {
    '@type': 'Organization',
    name: 'LinkLab',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${appUrl}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const howToStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to run a client campaign link with LinkLab',
  description:
    'Create a branded short link for a client campaign, generate its QR code, and track the clicks you report back — the first link takes under 60 seconds.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Paste the client\'s destination',
      text: 'Copy the campaign destination — a client landing page, product listing, booking form, or catalogue — and paste it into LinkLab.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Name it for the client',
      text: 'Set a client-prefixed custom alias, add an expiry date for a seasonal offer, or attach UTM parameters for the client\'s own analytics.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Ship it to the campaign',
      text: 'Share the link in a WhatsApp broadcast, an Instagram bio or story, an email or SMS blast, or print its QR code onto packaging and signage.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Report back to the client',
      text: 'Pull clicks, QR scans, locations, devices, browsers, and referral sources for that campaign from the link analytics view.',
    },
  ],
};

const pricingListStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'LinkLab URL shortener pricing plans',
  description:
    'LinkLab offers a free URL shortener plan and paid monthly plans starting at ₹99, with custom enterprise pricing.',
  itemListElement: billingPlans.map((plan, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: `${plan.name} plan — ${plan.price}${plan.isCustomPricing ? '' : '/month'} — ${plan.monthlyLinkLimit === Infinity ? 'unlimited' : plan.monthlyLinkLimit.toLocaleString('en-IN')} links/month`,
  })),
};

export default function Homepage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSoftwareStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingListStructuredData) }}
      />
      <AuthenticationAwareHeader isAuthenticated={false} />
      <HomepageInteractive />
    </>
  );
}
