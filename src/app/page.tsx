import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import HomepageInteractive from './homepage/components/HomepageInteractive';
import { homepageFaqs } from './homepage/components/FAQSection';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const homepageUrl = new URL('/', appUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'URL Shortener, Branded Links, QR Codes & Analytics | LinkLab',
  description:
    'LinkLab is a URL shortener for branded links, custom domains, QR codes, short link analytics, and link management. Shorten URLs, track clicks, and scale campaigns from one platform.',
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
    'URL shortener',
    'Branded links',
    'Custom domains',
    'QR code generation',
    'Short link analytics',
    'Link management dashboard',
    'Bulk short URLs',
    'Developer API',
  ],
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
  logo: `${appUrl}/favicon.ico`,
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
      <AuthenticationAwareHeader isAuthenticated={false} />
      <HomepageInteractive />
    </>
  );
}
