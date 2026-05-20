import type { BlogFeaturedImage } from './data';

export interface BlogExtendedMeta {
  metaTitle?: string;
  focusKeyword?: string;
  tags?: string[];
  relatedPosts?: string[];
  featuredImage?: BlogFeaturedImage;
}

export const blogMetadata: Record<string, BlogExtendedMeta> = {
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
