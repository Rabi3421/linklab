import type { BlogFeaturedImage } from './data';

export interface BlogExtendedMeta {
  metaTitle?: string;
  focusKeyword?: string;
  tags?: string[];
  relatedPosts?: string[];
  featuredImage?: BlogFeaturedImage;
}

export const blogMetadata: Record<string, BlogExtendedMeta> = {
  'how-to-convert-link-to-qr-code': {
    metaTitle: 'How to Convert a Link to a QR Code for Free (2026)',
    focusKeyword: 'link to qr code',
    tags: ['QR Code', 'URL', 'Free Tool', 'Print', 'Generator'],
    relatedPosts: [
      'static-vs-dynamic-qr-code',
      'how-to-track-qr-code-scans',
      'how-to-add-utm-parameters-to-qr-codes',
    ],
    featuredImage: {
      src: '/images/blog/how-to-convert-link-to-qr-code/url-to-qr-code-flow-diagram.svg',
      alt: 'How to convert a URL to a QR code — four-step flow from link to scannable QR code using LinkLab',
      width: 900,
      height: 340,
    },
  },

  'rebrandly-alternatives': {
    metaTitle: 'Best Rebrandly Alternatives for Branded Short Links 2026 | LinkLab',
    focusKeyword: 'rebrandly alternatives',
    tags: ['URL Shortener', 'Rebrandly', 'Branded Links', 'Comparison', 'Custom Domain'],
    relatedPosts: [
      'best-bitly-alternatives',
      'tinyurl-alternatives',
      'branded-short-links-guide',
    ],
    featuredImage: {
      src: '/images/blog/rebrandly-alternatives/rebrandly-alternatives-comparison-hero.svg',
      alt: 'Best Rebrandly alternatives comparison showing Short.io, Dub.co, Cuttly and LinkLab side by side with free plan details',
      width: 1200,
      height: 630,
    },
  },

  'itf-14-barcode-generator': {
    metaTitle: 'ITF-14 Barcode Generator: Outer Carton Barcodes Explained | LinkLab',
    focusKeyword: 'itf-14 barcode',
    tags: ['Barcode', 'ITF-14', 'Shipping', 'GTIN-14', 'Supply Chain'],
    relatedPosts: [
      'ean-13-barcode-generator',
      'code-128-barcode-generator',
      'barcode-generator-guide',
    ],
    featuredImage: {
      src: '/images/blog/itf-14-barcode-generator/itf-14-barcode-structure.svg',
      alt: 'ITF-14 barcode digit structure diagram showing Packaging Indicator, GTIN-13 inner product data, and check digit',
      width: 900,
      height: 340,
    },
  },

  'ean-13-barcode-generator': {
    metaTitle: 'EAN-13 Barcode Generator: Guide for Product and Retail Barcodes | LinkLab',
    focusKeyword: 'ean-13 barcode generator',
    tags: ['Barcode', 'EAN-13', 'Retail', 'GS1', 'Product Labels'],
    relatedPosts: [
      'code-128-barcode-generator',
      'how-to-generate-product-barcodes',
      'barcode-generator-guide',
    ],
    featuredImage: {
      src: '/images/blog/ean-13-barcode-generator/ean-13-barcode-structure.svg',
      alt: 'EAN-13 barcode digit structure diagram showing GS1 prefix, company prefix, item reference, and check digit breakdown',
      width: 900,
      height: 340,
    },
  },

  'code-128-barcode-generator': {
    metaTitle: 'Code 128 Barcode Generator: What It Is and How to Use It | LinkLab',
    focusKeyword: 'code 128 barcode generator',
    tags: ['Barcode', 'Code 128', 'Inventory', 'Logistics', 'Free Tool'],
    relatedPosts: [
      'barcode-generator-guide',
      'how-to-generate-product-barcodes',
      'qr-code-vs-barcode',
    ],
    featuredImage: {
      src: '/images/blog/code-128-barcode-generator/code-128-format-guide.svg',
      alt: 'Code 128 barcode format guide showing the three character set modes: 128A, 128B, and 128C',
      width: 900,
      height: 340,
    },
  },

  'how-to-track-instagram-link-clicks': {
    metaTitle: 'How to Track Instagram Bio Link Clicks (UTMs + Short Links) | LinkLab',
    focusKeyword: 'track instagram link clicks',
    tags: ['Instagram', 'UTM', 'Analytics', 'Short Links', 'Social Media'],
    relatedPosts: [
      'how-to-track-link-clicks',
      'how-to-add-utm-parameters-to-qr-codes',
      'branded-short-links-guide',
    ],
    featuredImage: {
      src: '/images/blog/how-to-track-instagram-link-clicks/instagram-bio-link-tracking-flow.svg',
      alt: 'Instagram bio link tracking setup showing UTM-tagged short links and click analytics dashboard',
      width: 960,
      height: 380,
    },
  },

  'how-to-track-whatsapp-clicks-with-short-links-utms-and-ga4': {
    metaTitle: 'Track WhatsApp Link Clicks with UTMs | LinkLab',
    focusKeyword: 'track whatsapp clicks',
    tags: ['WhatsApp', 'UTM', 'GA4', 'Attribution', 'Dark Social'],
    relatedPosts: [
      'how-to-track-link-clicks',
      'how-to-add-utm-parameters-to-qr-codes',
      'url-shortener-analytics-metrics-that-improve-campaign-performance',
    ],
    featuredImage: {
      src: '/images/blog/whatsapp-tracking/whatsapp-link-tracking-hero.webp',
      alt: 'WhatsApp link tracking setup showing UTM-tagged short links and GA4 analytics dashboard',
      width: 1200,
      height: 630,
    },
  },

  'url-shortener-analytics-metrics-that-improve-campaign-performance': {
    metaTitle: 'URL Shortener Analytics: 9 Key Metrics | LinkLab',
    focusKeyword: 'url shortener analytics',
    tags: ['Analytics', 'Campaign', 'Metrics', 'URL Shortener'],
    relatedPosts: [
      'how-to-track-link-clicks',
      'best-bitly-alternatives',
      'tinyurl-alternatives',
    ],
    featuredImage: {
      src: '/images/blog/url-shortener-analytics/url-shortener-analytics-dashboard-hero.webp',
      alt: 'URL shortener analytics dashboard showing click metrics, referrer data and device breakdown',
      width: 1200,
      height: 630,
    },
  },

  'branded-short-links-guide': {
    metaTitle: 'Branded Short Links: The Complete Guide | LinkLab',
    focusKeyword: 'branded short links',
    tags: ['Branded Links', 'Custom Domain', 'URL Shortener', 'Trust'],
    relatedPosts: [
      'best-bitly-alternatives',
      'tinyurl-alternatives',
      'how-to-track-link-clicks',
    ],
    featuredImage: {
      src: '/images/blog/branded-short-links/branded-short-links-guide-hero.webp',
      alt: 'Branded short link example showing custom domain instead of generic shortener URL',
      width: 1200,
      height: 630,
    },
  },

  'qr-codes-for-business-marketing-guide': {
    metaTitle: 'QR Codes for Business Marketing | LinkLab',
    focusKeyword: 'qr codes for business',
    tags: ['QR Codes', 'Marketing', 'Business', 'Campaigns'],
    relatedPosts: [
      'static-vs-dynamic-qr-code',
      'qr-code-marketing-ideas',
      'how-to-track-qr-code-scans',
    ],
    featuredImage: {
      src: '/images/blog/qr-codes-for-business/qr-codes-business-marketing-hero.webp',
      alt: 'QR code marketing examples for business including product packaging and event signage',
      width: 1200,
      height: 630,
    },
  },

  'barcode-generator-guide': {
    metaTitle: 'Free Barcode Generator: Products & Inventory | LinkLab',
    focusKeyword: 'free barcode generator',
    tags: ['Barcode', 'Generator', 'Inventory', 'Products'],
    relatedPosts: [
      'qr-code-vs-barcode',
      'how-to-generate-product-barcodes',
      'qr-code-marketing-ideas',
    ],
    featuredImage: {
      src: '/images/blog/barcode-generator-guide/barcode-generator-guide-hero.webp',
      alt: 'Free barcode generator showing Code 128, EAN-13 and UPC-A barcode types for products and inventory',
      width: 1200,
      height: 630,
    },
  },

  'static-vs-dynamic-qr-code': {
    metaTitle: 'Static vs Dynamic QR Codes: Full Comparison | LinkLab',
    focusKeyword: 'static vs dynamic qr code',
    tags: ['QR Codes', 'Dynamic QR', 'Analytics', 'Print'],
    relatedPosts: [
      'how-to-track-qr-code-scans',
      'how-to-add-utm-parameters-to-qr-codes',
      'qr-code-marketing-ideas',
    ],
    featuredImage: {
      src: '/images/blog/static-vs-dynamic-qr-code/static-vs-dynamic-qr-comparison-hero.webp',
      alt: 'Static vs dynamic QR code comparison showing differences in editability, analytics and redirect flow',
      width: 1200,
      height: 630,
    },
  },

  'best-bitly-alternatives': {
    metaTitle: 'Best Bitly Alternatives 2026 | LinkLab',
    focusKeyword: 'bitly alternatives',
    tags: ['URL Shortener', 'Bitly', 'Comparison', 'Analytics'],
    relatedPosts: [
      'tinyurl-alternatives',
      'how-to-track-link-clicks',
      'url-shortener-analytics-metrics-that-improve-campaign-performance',
    ],
    featuredImage: {
      src: '/images/blog/best-bitly-alternatives/bitly-alternatives-comparison-hero.webp',
      alt: 'Bitly alternatives comparison including Dub.co, Short.io, Rebrandly, Cuttly and LinkLab',
      width: 1200,
      height: 630,
    },
  },

  'how-to-track-qr-code-scans': {
    metaTitle: 'How to Track QR Code Scans with Analytics | LinkLab',
    focusKeyword: 'track qr code scans',
    tags: ['QR Codes', 'Analytics', 'GA4', 'UTM', 'Tracking'],
    relatedPosts: [
      'static-vs-dynamic-qr-code',
      'how-to-add-utm-parameters-to-qr-codes',
      'how-to-track-link-clicks',
    ],
    featuredImage: {
      src: '/images/blog/how-to-track-qr-code-scans/qr-code-scan-analytics-dashboard-hero.webp',
      alt: 'QR code scan analytics dashboard showing total scans, device breakdown and geographic data',
      width: 1200,
      height: 630,
    },
  },

  'qr-code-vs-barcode': {
    metaTitle: 'QR Code vs Barcode: Key Differences | LinkLab',
    focusKeyword: 'qr code vs barcode',
    tags: ['QR Code', 'Barcode', 'Comparison', 'GS1'],
    relatedPosts: [
      'how-to-generate-product-barcodes',
      'static-vs-dynamic-qr-code',
      'qr-code-marketing-ideas',
    ],
    featuredImage: {
      src: '/images/blog/qr-code-vs-barcode/qr-code-vs-barcode-comparison-hero.webp',
      alt: 'QR code vs barcode comparison showing the visual difference between 2D matrix and 1D linear formats',
      width: 1200,
      height: 630,
    },
  },

  'how-to-generate-product-barcodes': {
    metaTitle: 'How to Generate a Product Barcode Free | LinkLab',
    focusKeyword: 'generate product barcode free',
    tags: ['Barcode', 'Product', 'GS1', 'UPC', 'EAN'],
    relatedPosts: [
      'qr-code-vs-barcode',
      'static-vs-dynamic-qr-code',
      'qr-code-marketing-ideas',
    ],
    featuredImage: {
      src: '/images/blog/how-to-generate-product-barcodes/product-barcode-generator-hero.webp',
      alt: 'LinkLab free barcode generator showing a Code 128 barcode ready to download as SVG or PNG',
      width: 1200,
      height: 630,
    },
  },

  'how-to-track-link-clicks': {
    metaTitle: 'Track Link Clicks Without Google Analytics | LinkLab',
    focusKeyword: 'track link clicks without google analytics',
    tags: ['Analytics', 'Privacy', 'Plausible', 'UTM', 'Link Tracking'],
    relatedPosts: [
      'how-to-add-utm-parameters-to-qr-codes',
      'how-to-track-qr-code-scans',
      'best-bitly-alternatives',
    ],
    featuredImage: {
      src: '/images/blog/how-to-track-link-clicks/link-click-tracking-analytics-hero.webp',
      alt: 'Link click analytics dashboard showing click tracking data, referrer sources and device breakdown',
      width: 1200,
      height: 630,
    },
  },

  'how-to-add-utm-parameters-to-qr-codes': {
    metaTitle: 'Add UTM Parameters to QR Codes | LinkLab',
    focusKeyword: 'utm parameters qr codes',
    tags: ['UTM', 'QR Codes', 'GA4', 'Print Campaigns', 'Tracking'],
    relatedPosts: [
      'how-to-track-qr-code-scans',
      'static-vs-dynamic-qr-code',
      'how-to-track-link-clicks',
    ],
    featuredImage: {
      src: '/images/blog/how-to-add-utm-parameters-to-qr-codes/utm-parameters-qr-code-hero.webp',
      alt: 'URL with UTM parameters for QR code tracking showing utm_source, utm_medium and utm_campaign values',
      width: 1200,
      height: 630,
    },
  },

  'qr-code-marketing-ideas': {
    metaTitle: 'QR Code Marketing Ideas That Work | LinkLab',
    focusKeyword: 'qr code marketing ideas',
    tags: ['QR Codes', 'Marketing', 'Campaigns', 'Restaurant', 'Events'],
    relatedPosts: [
      'how-to-add-utm-parameters-to-qr-codes',
      'static-vs-dynamic-qr-code',
      'how-to-generate-product-barcodes',
    ],
    featuredImage: {
      src: '/images/blog/qr-code-marketing-ideas/qr-code-marketing-ideas-hero.webp',
      alt: 'QR code marketing use cases for restaurants, product packaging, business cards and event signage',
      width: 1200,
      height: 630,
    },
  },

  'tinyurl-alternatives': {
    metaTitle: 'Best TinyURL Alternatives for Business | LinkLab',
    focusKeyword: 'tinyurl alternatives',
    tags: ['URL Shortener', 'TinyURL', 'Comparison', 'Analytics', 'Custom Domain'],
    relatedPosts: [
      'best-bitly-alternatives',
      'how-to-track-link-clicks',
      'url-shortener-analytics-metrics-that-improve-campaign-performance',
    ],
    featuredImage: {
      src: '/images/blog/tinyurl-alternatives/tinyurl-alternatives-comparison-hero.webp',
      alt: 'TinyURL alternatives comparison showing Rebrandly, Dub.co, Short.io, Cuttly and LinkLab feature differences',
      width: 1200,
      height: 630,
    },
  },
};
