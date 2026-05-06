import type { Metadata } from 'next';
import { absoluteUrl, defaultOgImage, siteName, siteUrl } from './site';

export interface SeoLandingFaq {
  question: string;
  answer: string;
}

export interface SeoLandingSection {
  heading: string;
  body: string;
  bullets: string[];
}

export interface SeoLandingLink {
  label: string;
  href: string;
}

export interface SeoLandingPage {
  slug: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  promise: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  differentiators: string[];
  sections: SeoLandingSection[];
  faqs: SeoLandingFaq[];
  relatedLinks: SeoLandingLink[];
}

const sharedRelatedLinks: SeoLandingLink[] = [
  { label: 'URL shortener homepage', href: '/' },
  { label: 'QR code generator', href: '/qr-code-generator' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Developer API', href: '/developers' },
];

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: 'free-url-shortener',
    targetKeyword: 'free URL shortener',
    secondaryKeywords: ['url shortener free', 'free link shortener', 'shorten URL free'],
    searchIntent: 'Users want to shorten a link quickly without paying or creating friction.',
    title: 'Free URL Shortener - Shorten Links Online | LinkLab',
    description:
      'Use LinkLab as a free URL shortener to create clean short links, custom aliases, QR codes, and basic click analytics. Start free with no credit card.',
    eyebrow: 'Free URL shortener',
    h1: 'Free URL shortener for clean, trackable links',
    lede:
      'Create short links that are easier to share in social posts, messages, emails, ads, and print campaigns. LinkLab gives you a free way to shorten URLs while keeping room to grow into analytics, QR codes, custom domains, and API workflows.',
    promise:
      'Best fit for creators, small businesses, students, marketers, and early-stage teams that need reliable short links without starting on a large paid plan.',
    ctaLabel: 'Shorten a link free',
    ctaHref: '/',
    secondaryCtaLabel: 'Compare plans',
    secondaryCtaHref: '/pricing',
    differentiators: [
      'Free plan with monthly short-link quota',
      'Custom aliases for readable links',
      'QR code generated for every short link',
      'Upgrade path for analytics, domains, API, and teams',
    ],
    sections: [
      {
        heading: 'What makes a good free URL shortener?',
        body:
          'A good free URL shortener should do more than hide a long URL. It should create a link that looks trustworthy, redirects quickly, gives you basic performance feedback, and does not trap you when your campaign grows.',
        bullets: [
          'Use a memorable short code or custom alias when possible.',
          'Keep redirects fast and SSL-protected.',
          'Track basic clicks so you can see whether the link is working.',
          'Generate a QR code for offline sharing and print materials.',
        ],
      },
      {
        heading: 'Why choose LinkLab over a basic shortener?',
        body:
          'Many free shorteners are built only for one-off links. LinkLab is built as a link management platform, so the same short link can become part of a broader campaign workflow when you need analytics, QR scans, API automation, and branded domains.',
        bullets: [
          'Start with a free short link today.',
          'Add campaign tracking when the link becomes important.',
          'Move to branded links when trust and recognition matter.',
          'Use pricing that scales from small campaigns to high-volume teams.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is LinkLab really free to start?',
        answer:
          'Yes. LinkLab has a free tier for creating short links and trying the core URL shortener workflow. Paid plans unlock higher limits, longer analytics retention, custom domains, API access, and team features.',
      },
      {
        question: 'Do free short links include QR codes?',
        answer:
          'Yes. LinkLab creates a QR code for every short link so the same destination can be used in digital and offline campaigns.',
      },
      {
        question: 'Can I customize a free short URL?',
        answer:
          'You can use custom aliases when available. Branded custom domains are available on higher plans.',
      },
    ],
    relatedLinks: sharedRelatedLinks,
  },
  {
    slug: 'custom-url-shortener',
    targetKeyword: 'custom URL shortener',
    secondaryKeywords: ['custom short URL', 'custom link shortener', 'custom URL generator'],
    searchIntent: 'Users want control over the back-half, destination, and brand feel of short links.',
    title: 'Custom URL Shortener for Branded Short Links | LinkLab',
    description:
      'Create custom short URLs with readable aliases, branded links, QR codes, analytics, and custom domain workflows in LinkLab.',
    eyebrow: 'Custom URL shortener',
    h1: 'Custom URL shortener for links people trust',
    lede:
      'Turn long, messy URLs into short links with meaningful aliases like /launch, /menu, /offer, or /demo. LinkLab helps every shared link look intentional while preserving analytics and QR-code workflows.',
    promise:
      'Best fit for teams that want short links to look like part of the brand instead of random strings from a generic shortener.',
    ctaLabel: 'Create a custom short URL',
    ctaHref: '/',
    secondaryCtaLabel: 'See branded link pricing',
    secondaryCtaHref: '/pricing',
    differentiators: [
      'Readable aliases instead of random-only codes',
      'Branded domains on growth plans',
      'Analytics for every custom short link',
      'QR code pairing for offline campaigns',
    ],
    sections: [
      {
        heading: 'Use custom aliases for better sharing',
        body:
          'Custom aliases make links easier to recognize, remember, and reuse. They are especially useful in podcasts, SMS campaigns, event signage, printed flyers, and sales conversations where a random code is hard to communicate.',
        bullets: [
          'Use campaign names that match the destination.',
          'Keep aliases short and readable.',
          'Avoid vague labels such as link1 or promo2.',
          'Reserve branded domains for high-value or public campaigns.',
        ],
      },
      {
        heading: 'Custom short URLs also improve measurement',
        body:
          'When each campaign has a dedicated custom short URL, reporting becomes cleaner. You can compare clicks, referrers, devices, and locations without depending only on analytics inside the destination page.',
        bullets: [
          'Create one alias per campaign, channel, or creative.',
          'Attach UTMs to keep GA4 and ad reporting consistent.',
          'Use QR codes for print and offline attribution.',
          'Disable or expire links when campaigns end.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a custom URL shortener?',
        answer:
          'A custom URL shortener lets you choose a readable short-link back-half and, on supported plans, use your own branded domain.',
      },
      {
        question: 'Can I use my own domain for short links?',
        answer:
          'Yes. LinkLab supports custom domains on selected paid plans so teams can create branded links with their own domain or subdomain.',
      },
      {
        question: 'Are custom short links better than random codes?',
        answer:
          'For public campaigns, usually yes. A readable custom alias is easier to remember, looks more trustworthy, and gives teams clearer reporting.',
      },
    ],
    relatedLinks: [
      { label: 'Branded link shortener', href: '/branded-link-shortener' },
      ...sharedRelatedLinks,
    ],
  },
  {
    slug: 'short-link-generator',
    targetKeyword: 'short link generator',
    secondaryKeywords: ['short URL generator', 'generate short link', 'short link maker'],
    searchIntent: 'Users want an immediate tool to create a short link from a long URL.',
    title: 'Short Link Generator - Create Short URLs Online | LinkLab',
    description:
      'Generate short links from long URLs with LinkLab. Create custom aliases, QR codes, and track clicks from one short link generator.',
    eyebrow: 'Short link generator',
    h1: 'Short link generator for campaigns, bios, and messages',
    lede:
      'Paste a long URL and turn it into a short link that is easier to share anywhere. LinkLab is built for quick link generation today and deeper link management when your campaign needs tracking.',
    promise:
      'Best fit for users who need a fast short-link tool but do not want to lose analytics, QR code, or branding options later.',
    ctaLabel: 'Generate a short link',
    ctaHref: '/',
    secondaryCtaLabel: 'Read analytics guide',
    secondaryCtaHref: '/blog/url-shortener-analytics-metrics-that-improve-campaign-performance',
    differentiators: [
      'Fast link creation from the homepage',
      'Custom alias support',
      'Automatic QR code output',
      'Analytics-ready from the first link',
    ],
    sections: [
      {
        heading: 'Generate short links without losing context',
        body:
          'Short links are most useful when they stay connected to a purpose. Use a different short link for each campaign, ad, post, or offline placement so reporting stays clear.',
        bullets: [
          'Create a separate short link for each important channel.',
          'Name links around campaigns or destinations.',
          'Use QR codes when the link appears offline.',
          'Check clicks before scaling a campaign.',
        ],
      },
      {
        heading: 'Use short links across every channel',
        body:
          'Short links work well in social captions, WhatsApp campaigns, newsletters, SMS, sales follow-ups, product packaging, event pages, and creator bios.',
        bullets: [
          'Social media posts and paid ads.',
          'Email newsletters and SMS campaigns.',
          'Print flyers, packaging, posters, and menus.',
          'Developer and product workflows through the API.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I generate a short link?',
        answer:
          'Paste your destination URL into LinkLab, choose an optional custom alias, and create the short link. LinkLab also creates a QR code for the same destination.',
      },
      {
        question: 'Can a short link be edited later?',
        answer:
          'Link management controls depend on your plan and workspace. For important campaigns, create links inside an account so you can manage analytics and lifecycle settings.',
      },
      {
        question: 'Can I track short link clicks?',
        answer:
          'Yes. LinkLab tracks click data such as total clicks, referrers, countries, devices, and time patterns on supported plans.',
      },
    ],
    relatedLinks: sharedRelatedLinks,
  },
  {
    slug: 'url-shortener-with-analytics',
    targetKeyword: 'URL shortener with analytics',
    secondaryKeywords: ['link shortener with analytics', 'short link analytics', 'track short links'],
    searchIntent: 'Users want a shortener that proves campaign performance, not just shorter URLs.',
    title: 'URL Shortener With Analytics - Track Every Click | LinkLab',
    description:
      'Use LinkLab as a URL shortener with analytics for clicks, referrers, devices, countries, time patterns, QR scans, and campaign reporting.',
    eyebrow: 'URL shortener with analytics',
    h1: 'URL shortener with analytics for smarter campaigns',
    lede:
      'Short links are useful. Short links with analytics are actionable. LinkLab helps marketers, agencies, creators, and product teams understand where clicks come from and which campaigns deserve more attention.',
    promise:
      'Best fit for teams that need campaign visibility across social, email, SMS, WhatsApp, ads, QR codes, and offline placements.',
    ctaLabel: 'Start tracking links',
    ctaHref: '/register',
    secondaryCtaLabel: 'View analytics article',
    secondaryCtaHref: '/blog/url-shortener-analytics-metrics-that-improve-campaign-performance',
    differentiators: [
      'Click totals and trend reporting',
      'Country, device, browser, and referrer insights',
      'QR scan and short-link workflows together',
      'API-ready reporting for developers',
    ],
    sections: [
      {
        heading: 'Analytics turns short links into decisions',
        body:
          'A raw click count tells you whether people clicked. Better analytics explains where the click came from, what device they used, and when the traffic peaked. That context helps teams improve copy, timing, landing pages, and channel mix.',
        bullets: [
          'Track total and recent clicks.',
          'Compare referrers across channels.',
          'Spot mobile-heavy campaigns before optimizing landing pages.',
          'Use geography data for regional campaigns.',
        ],
      },
      {
        heading: 'A practical Bitly alternative for lean teams',
        body:
          'Established platforms are powerful, but many teams need a simpler starting point with affordable pricing. LinkLab focuses on core shortening, QR codes, analytics, custom domains, and API workflows without forcing early-stage teams into enterprise-sized commitments.',
        bullets: [
          'Free tier for testing the workflow.',
          'Low-cost paid plans for growing usage.',
          'Custom domains when branded trust matters.',
          'Developer access for repeatable link creation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What analytics does a URL shortener track?',
        answer:
          'A strong URL shortener tracks clicks, referrers, countries, devices, browsers, and time-based trends. Some teams also connect short links with UTM parameters for GA4 reporting.',
      },
      {
        question: 'Is LinkLab an alternative to Bitly analytics?',
        answer:
          'LinkLab is designed for teams that want URL shortening, QR codes, custom links, and campaign analytics with a more accessible pricing path.',
      },
      {
        question: 'Can I track WhatsApp links?',
        answer:
          'Yes. Use a dedicated LinkLab short link with consistent UTM parameters for WhatsApp campaigns, then review LinkLab analytics and GA4 together.',
      },
    ],
    relatedLinks: [
      { label: 'WhatsApp click tracking guide', href: '/blog/how-to-track-whatsapp-clicks-with-short-links-utms-and-ga4' },
      ...sharedRelatedLinks,
    ],
  },
  {
    slug: 'branded-link-shortener',
    targetKeyword: 'branded link shortener',
    secondaryKeywords: ['branded URL shortener', 'branded short links', 'custom domain shortener'],
    searchIntent: 'Users want short links that carry their own brand or domain.',
    title: 'Branded Link Shortener for Custom Domains | LinkLab',
    description:
      'Create branded short links with custom aliases, custom domains, QR codes, analytics, and link management workflows in LinkLab.',
    eyebrow: 'Branded link shortener',
    h1: 'Branded link shortener for links your audience recognizes',
    lede:
      'Generic short links are useful, but branded short links build trust. LinkLab helps teams create short links that match campaigns, domains, and brand identity while still tracking performance.',
    promise:
      'Best fit for marketers, agencies, ecommerce brands, and teams that share links publicly and care about click trust.',
    ctaLabel: 'Create branded links',
    ctaHref: '/register',
    secondaryCtaLabel: 'See custom URL page',
    secondaryCtaHref: '/custom-url-shortener',
    differentiators: [
      'Custom aliases and branded domains',
      'QR codes connected to the same link workflow',
      'Analytics for clicks and campaign performance',
      'Affordable path from free links to branded domains',
    ],
    sections: [
      {
        heading: 'Why branded links get more trust',
        body:
          'People are more likely to click a link when the domain and alias look familiar. A branded short link also reinforces campaign identity every time the link is copied, forwarded, or printed.',
        bullets: [
          'Use a short branded domain or subdomain.',
          'Match the back-half to the campaign or destination.',
          'Avoid random strings for high-visibility campaigns.',
          'Keep QR and link analytics tied to the same destination.',
        ],
      },
      {
        heading: 'Built for brand and performance together',
        body:
          'Branding should not remove measurement. LinkLab keeps branded links connected to click analytics, QR codes, campaign tags, and lifecycle controls so teams can protect trust and still make data-informed decisions.',
        bullets: [
          'Track branded links by campaign.',
          'Use QR codes for product packaging and events.',
          'Organize links by client, channel, or destination.',
          'Automate creation with developer workflows.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a branded link shortener?',
        answer:
          'A branded link shortener creates short links using a custom domain or recognizable brand wording instead of only a generic shortener domain.',
      },
      {
        question: 'Do branded links help SEO?',
        answer:
          'Branded short links are mainly useful for trust, click-through rate, sharing, and campaign attribution. They should use proper redirects and should not replace canonical landing pages.',
      },
      {
        question: 'Can I use branded links with QR codes?',
        answer:
          'Yes. LinkLab can pair short links and QR codes so offline scans and digital clicks can be managed together.',
      },
    ],
    relatedLinks: [
      { label: 'Custom URL shortener', href: '/custom-url-shortener' },
      ...sharedRelatedLinks,
    ],
  },
  {
    slug: 'qr-code-link-generator',
    targetKeyword: 'QR code link generator',
    secondaryKeywords: ['url to QR code', 'QR code generator for links', 'link to QR code'],
    searchIntent: 'Users want to turn a website link into a scannable QR code.',
    title: 'QR Code Link Generator - URL to QR Code | LinkLab',
    description:
      'Create a QR code from any website link with LinkLab. Generate, customize, download, and pair QR codes with short link analytics.',
    eyebrow: 'QR code link generator',
    h1: 'QR code link generator for websites, menus, and campaigns',
    lede:
      'Turn any URL into a scannable QR code for print, packaging, menus, event signage, retail displays, and offline campaigns. LinkLab also gives you short links and analytics when you need tracking.',
    promise:
      'Best fit for teams connecting offline attention to online destinations.',
    ctaLabel: 'Generate a QR code',
    ctaHref: '/qr-code-generator',
    secondaryCtaLabel: 'Shorten the URL first',
    secondaryCtaHref: '/',
    differentiators: [
      'Free QR code generator and scanner',
      'Custom QR styles and PNG download',
      'Short link pairing for tracking',
      'Useful for menus, print, packaging, and events',
    ],
    sections: [
      {
        heading: 'Why convert links into QR codes?',
        body:
          'QR codes make a digital destination accessible from physical spaces. Instead of asking someone to type a long URL, you let them scan and land on the exact page you want.',
        bullets: [
          'Restaurant menus and order forms.',
          'Product packaging and retail displays.',
          'Event registration and check-in pages.',
          'Flyers, posters, brochures, and business cards.',
        ],
      },
      {
        heading: 'Use short links when you need analytics',
        body:
          'A plain QR code sends users to a destination. A QR code backed by a short link can also help you measure scan activity and update campaign reporting.',
        bullets: [
          'Create a short link for the destination.',
          'Generate a QR code for the short link.',
          'Use UTMs for GA4 campaign reporting.',
          'Review clicks, devices, and locations after launch.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I create a QR code from a URL?',
        answer:
          'Yes. Paste a website URL into LinkLab QR tools, customize the design, and download the QR code as a PNG.',
      },
      {
        question: 'Should I use a direct URL or a short link in a QR code?',
        answer:
          'Use a direct URL for simple static QR codes. Use a short link when you want cleaner URLs, campaign attribution, or click and scan analytics.',
      },
      {
        question: 'Can I scan a QR code image with LinkLab?',
        answer:
          'Yes. The QR tools page can decode QR codes from uploaded screenshots or images in the browser.',
      },
    ],
    relatedLinks: [
      { label: 'QR code generator', href: '/qr-code-generator' },
      { label: 'Free URL shortener', href: '/free-url-shortener' },
      ...sharedRelatedLinks,
    ],
  },
  {
    slug: 'bulk-url-shortener',
    targetKeyword: 'bulk URL shortener',
    secondaryKeywords: ['bulk link shortener', 'bulk short URL generator', 'shorten URLs in bulk'],
    searchIntent: 'Users want to create many short links for campaigns, products, clients, or automation.',
    title: 'Bulk URL Shortener Workflows for Teams | LinkLab',
    description:
      'Use LinkLab for bulk URL shortener workflows with API-driven link creation, custom aliases, QR codes, analytics, and campaign-ready link management.',
    eyebrow: 'Bulk URL shortener',
    h1: 'Bulk URL shortener workflows without spreadsheet chaos',
    lede:
      'When a campaign needs dozens or thousands of links, manual copy-paste breaks down. LinkLab supports repeatable link creation through account workflows and developer API access so teams can create, organize, and track short links at scale.',
    promise:
      'Best fit for agencies, ecommerce teams, product platforms, and developers that need many links with consistent naming and analytics.',
    ctaLabel: 'Explore API docs',
    ctaHref: '/developers',
    secondaryCtaLabel: 'See pricing',
    secondaryCtaHref: '/pricing',
    differentiators: [
      'API-driven link creation',
      'Custom aliases and campaign naming',
      'Analytics for every generated link',
      'QR codes for product and offline workflows',
    ],
    sections: [
      {
        heading: 'When bulk URL shortening matters',
        body:
          'Bulk shortening is useful when every product, coupon, creator, offline asset, or client campaign needs a separate short link. Separate links create cleaner reporting and reduce attribution confusion.',
        bullets: [
          'Product catalogs and ecommerce feeds.',
          'Agency client campaigns.',
          'Influencer and affiliate tracking links.',
          'QR codes for packaging, events, and print assets.',
        ],
      },
      {
        heading: 'Plan the workflow before generating links',
        body:
          'Bulk link creation works best when the naming, UTM structure, destination rules, and ownership are defined before generation. That keeps dashboards searchable and analytics comparable.',
        bullets: [
          'Define a slug naming convention.',
          'Keep UTM source, medium, and campaign values consistent.',
          'Group links by campaign, client, or product type.',
          'Use API access for repeatable generation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does LinkLab support bulk URL shortening?',
        answer:
          'LinkLab supports repeatable short-link creation through account and developer workflows. For large batches, use the API so your application or script can create links consistently.',
      },
      {
        question: 'Can bulk short links include analytics?',
        answer:
          'Yes. Each short link can collect analytics, which makes bulk-generated links useful for campaign comparison and attribution.',
      },
      {
        question: 'Can I generate QR codes in bulk from short links?',
        answer:
          'Every LinkLab short link includes a QR code, so bulk link workflows can support product labels, event materials, and offline campaigns.',
      },
    ],
    relatedLinks: [
      { label: 'Developer API', href: '/developers' },
      { label: 'URL shortener API', href: '/url-shortener-api' },
      ...sharedRelatedLinks,
    ],
  },
  {
    slug: 'link-management-tool',
    targetKeyword: 'link management tool',
    secondaryKeywords: ['link management platform', 'manage short links', 'link tracking tool'],
    searchIntent: 'Users want a platform to organize, track, and govern many links over time.',
    title: 'Link Management Tool for Short Links, QR Codes & Analytics | LinkLab',
    description:
      'Manage short links, branded links, QR codes, analytics, custom domains, and developer workflows with LinkLab link management tools.',
    eyebrow: 'Link management tool',
    h1: 'Link management tool for campaigns that keep growing',
    lede:
      'A single short link is easy to manage. Hundreds of campaign links need structure. LinkLab helps teams create, organize, track, and scale short links, QR codes, custom domains, and developer workflows from one platform.',
    promise:
      'Best fit for teams that have outgrown one-off shorteners and need a central workspace for links.',
    ctaLabel: 'Start managing links',
    ctaHref: '/register',
    secondaryCtaLabel: 'Read analytics guide',
    secondaryCtaHref: '/blog/url-shortener-analytics-metrics-that-improve-campaign-performance',
    differentiators: [
      'Central dashboard for short links',
      'Analytics and QR codes in one workflow',
      'Custom domains for branded trust',
      'API access for repeatable creation',
    ],
    sections: [
      {
        heading: 'Why link management matters',
        body:
          'Links are campaign infrastructure. If teams cannot find, edit, measure, or retire old links, reporting gets messy and customers may land on outdated destinations.',
        bullets: [
          'Keep important links searchable and organized.',
          'Review analytics before making campaign decisions.',
          'Use branded domains for public-facing links.',
          'Expire or disable links when promotions end.',
        ],
      },
      {
        heading: 'Link management for marketers and developers',
        body:
          'Marketers need clear campaign reporting. Developers need reliable APIs. LinkLab brings both together so teams can create links manually, automate creation, and review performance from the same system.',
        bullets: [
          'Marketing campaign links and QR codes.',
          'Developer-created links from backend systems.',
          'Ecommerce product links and packaging QR codes.',
          'Agency links organized by client or project.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a link management tool?',
        answer:
          'A link management tool helps teams create, organize, track, edit, and govern short links and branded links across campaigns and channels.',
      },
      {
        question: 'How is link management different from URL shortening?',
        answer:
          'URL shortening creates a shorter redirect. Link management adds analytics, organization, custom domains, QR codes, lifecycle controls, and team workflows.',
      },
      {
        question: 'Who needs link management?',
        answer:
          'Marketing teams, agencies, ecommerce brands, content creators, developers, and businesses that share many links across channels benefit from link management.',
      },
    ],
    relatedLinks: sharedRelatedLinks,
  },
  {
    slug: 'website-url-shortener',
    targetKeyword: 'website URL shortener',
    secondaryKeywords: ['shorten website URL', 'website link shortener', 'shorten website link'],
    searchIntent: 'Users want to make a website page URL shorter and easier to share.',
    title: 'Website URL Shortener - Shorten Website Links | LinkLab',
    description:
      'Shorten website URLs for landing pages, blogs, product pages, menus, forms, and campaigns with LinkLab. Add QR codes, custom aliases, and analytics.',
    eyebrow: 'Website URL shortener',
    h1: 'Website URL shortener for every page you share',
    lede:
      'Long website URLs can look messy in messages, bios, ads, and print materials. LinkLab turns website links into short, readable URLs with QR codes and analytics when you need them.',
    promise:
      'Best fit for anyone sharing website pages across social, email, SMS, WhatsApp, offline campaigns, or sales conversations.',
    ctaLabel: 'Shorten a website URL',
    ctaHref: '/',
    secondaryCtaLabel: 'Create a QR code',
    secondaryCtaHref: '/qr-code-generator',
    differentiators: [
      'Works for landing pages, blogs, product pages, and forms',
      'Custom aliases for memorable sharing',
      'QR code output for offline access',
      'Analytics-ready campaign links',
    ],
    sections: [
      {
        heading: 'Shorten website links for cleaner sharing',
        body:
          'A short website URL is easier to paste into a social profile, share in a chat, print on a flyer, or say out loud during a podcast or event.',
        bullets: [
          'Landing pages and demo booking pages.',
          'Product, category, and checkout pages.',
          'Blog posts, resource pages, and PDFs.',
          'Forms, menus, support pages, and event pages.',
        ],
      },
      {
        heading: 'Use analytics when traffic matters',
        body:
          'If the website link belongs to a campaign, create a dedicated short link and use UTMs. That keeps reporting clean across LinkLab analytics and your website analytics tool.',
        bullets: [
          'Use one short link per campaign or channel.',
          'Pair with QR codes for print and offline traffic.',
          'Track referrers, devices, and click timing.',
          'Keep destination URLs cleaner in public copy.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I shorten any website URL?',
        answer:
          'Yes. Paste a valid website URL into LinkLab and create a short link. The tool normalizes common URL formats and redirects visitors to the original destination.',
      },
      {
        question: 'Can I shorten a Google Form or PDF link?',
        answer:
          'Yes. Website URLs, form links, document links, landing pages, product pages, and menu links can all be shortened as long as they are valid URLs.',
      },
      {
        question: 'Can I make a QR code from a shortened website URL?',
        answer:
          'Yes. LinkLab creates QR codes for short links and also has a dedicated QR code generator for URL-to-QR workflows.',
      },
    ],
    relatedLinks: sharedRelatedLinks,
  },
  {
    slug: 'url-shortener-api',
    targetKeyword: 'URL shortener API',
    secondaryKeywords: ['link shortener API', 'short link API', 'create short links API'],
    searchIntent: 'Developers want to create and track short links programmatically.',
    title: 'URL Shortener API for Developers | LinkLab',
    description:
      'Use the LinkLab URL shortener API to create short links, custom aliases, QR-code-ready links, and analytics workflows from your application.',
    eyebrow: 'URL shortener API',
    h1: 'URL shortener API for automated link workflows',
    lede:
      'Build short-link creation into your product, backend, ecommerce system, CRM, or marketing automation workflow. LinkLab gives developers an API path for creating links and retrieving owner-scoped analytics.',
    promise:
      'Best fit for developers who need reliable link creation without sending every request through a manual dashboard.',
    ctaLabel: 'Read API docs',
    ctaHref: '/developers',
    secondaryCtaLabel: 'See API pricing',
    secondaryCtaHref: '/pricing',
    differentiators: [
      'Bearer-token API authentication',
      'Programmatic short-link creation',
      'Custom aliases and expiration support',
      'Analytics retrieval for created links',
    ],
    sections: [
      {
        heading: 'What developers can automate',
        body:
          'A URL shortener API is useful anywhere links are created repeatedly: product emails, invoices, SMS notifications, referral campaigns, creator campaigns, QR code systems, and internal tools.',
        bullets: [
          'Create links from backend services.',
          'Generate custom aliases from product or campaign IDs.',
          'Attach expiration dates for temporary campaigns.',
          'Fetch analytics for reporting dashboards.',
        ],
      },
      {
        heading: 'Design API links for reporting',
        body:
          'Programmatic link creation should still follow a naming and tracking strategy. Developers should coordinate slug patterns, UTMs, ownership, and retention needs before scaling generation.',
        bullets: [
          'Use consistent slug patterns.',
          'Store LinkLab link IDs in your system.',
          'Create separate links for separate campaigns.',
          'Handle API errors and quota limits gracefully.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does LinkLab have a URL shortener API?',
        answer:
          'Yes. LinkLab includes developer API workflows for authenticated users so applications can create short links and access analytics.',
      },
      {
        question: 'Can the API create custom aliases?',
        answer:
          'Yes. The link creation endpoint supports optional custom aliases when the requested alias is valid and available.',
      },
      {
        question: 'Is API access available on the free plan?',
        answer:
          'API access depends on the selected plan. Check the pricing page for current plan limits and developer access.',
      },
    ],
    relatedLinks: [
      { label: 'Developers documentation', href: '/developers' },
      { label: 'Bulk URL shortener workflows', href: '/bulk-url-shortener' },
      ...sharedRelatedLinks,
    ],
  },
];

export const seoLandingPageSlugs = seoLandingPages.map((page) => page.slug);

export const getSeoLandingPage = (slug: string) => {
  const page = seoLandingPages.find((item) => item.slug === slug);

  if (!page) {
    throw new Error(`Unknown SEO landing page: ${slug}`);
  }

  return page;
};

export const buildSeoLandingMetadata = (page: SeoLandingPage): Metadata => {
  const url = absoluteUrl(`/${page.slug}`);

  return {
    metadataBase: new URL(siteUrl),
    title: page.title,
    description: page.description,
    keywords: [page.targetKeyword, ...page.secondaryKeywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName,
      type: 'website',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${siteName} URL shortener dashboard and link tools`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [defaultOgImage],
    },
  };
};

