import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import HomepageInteractive from './homepage/components/HomepageInteractive';
import { homepageFaqs } from './homepage/components/FAQSection';
import { billingPlans } from '@/lib/billing/plans';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const homepageUrl = new URL('/', appUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'URL Shortener, Branded Links, QR Codes & Analytics | LinkLab',
  description:
    'LinkLab is a free URL shortener for branded links, QR codes, custom domains, and click analytics. Shorten URLs, track every click, and manage campaigns from one platform.',
  keywords: [
    'url shortener',
    'link shortener',
    'branded links',
    'branded short links',
    'short url',
    'custom short links',
    'short link analytics',
    'link analytics',
    'qr code generator',
    'custom qr codes',
    'custom domains',
    'link management',
    'bulk short urls',
    'url shortener api',
    'track clicks',
    'link shortener for free',
    'url shortener starting at ₹99',
    'how to shorten a url',
    'link analytics dashboard',
    'url shortener for marketing teams',
    'url shortener for developers',
    'no expiry link credits',
    'one time link packs',
    'link management platform',
    'enterprise url shortener',
  ],
  alternates: {
    canonical: homepageUrl,
  },
  openGraph: {
    title: 'URL Shortener, Branded Links, QR Codes & Analytics | LinkLab',
    description:
      'Shorten URLs, create branded links, generate QR codes, track clicks, and manage campaigns with LinkLab.',
    url: homepageUrl,
    siteName: 'LinkLab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Shortener, Branded Links, QR Codes & Analytics | LinkLab',
    description:
      'A modern URL shortener for branded links, QR codes, analytics, custom domains, and developer workflows.',
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
    'LinkLab is a URL shortener and link management platform for branded links, custom domains, QR codes, short link analytics, team collaboration, and API-driven workflows.',
  featureList: [
    'URL shortener – shorten any URL into a clean branded short link',
    'Branded short links with custom aliases and vanity URLs',
    'Custom domain support – use your own domain for short links',
    'QR code generator – auto-generate QR codes for every short link',
    'Short link analytics – track clicks, locations, devices, and referrers',
    'Link management dashboard – create, edit, disable, and organise links',
    'Bulk short URL creation via API',
    'REST API for programmatic link creation and analytics retrieval',
    'Campaign UTM tracking integration',
    'Link expiry and scheduled deactivation',
    'Team workspace with shared link management',
    'Real-time click data and traffic reports',
    'Geographic click distribution reporting',
    'Device and browser analytics',
    'No-expiry one-time link credit packs',
    'Enterprise custom pricing and SLA',
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
    audienceType: 'Marketing teams, developers, agencies, content creators, e-commerce brands, and enterprise teams',
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
    'LinkLab is a URL shortener and link management platform for branded links, custom domains, QR codes, analytics, and developer workflows.',
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LinkLab',
  url: homepageUrl,
  description:
    'Shorten URLs, create branded links, generate QR codes, and track clicks with LinkLab.',
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
  name: 'How to shorten a URL with LinkLab',
  description:
    'Create a branded short link, generate a QR code, and track click analytics in under 60 seconds using the LinkLab URL shortener.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Paste your long URL',
      text: 'Copy any long URL and paste it into the LinkLab URL shortener input field.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Customise your short link',
      text: 'Set a custom alias for a branded short link, add UTM parameters, or choose a link expiry date.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Share on any channel',
      text: 'Share your branded short link via social media, email, SMS, or embed it as a QR code for print campaigns.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Track every click in real time',
      text: 'View click counts, geographic locations, devices, browsers, and referral sources from your short link analytics dashboard.',
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
